package com.study.DoctorAppointmentSystem.services.impl;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.study.DoctorAppointmentSystem.dtos.PaymentResponseDto;
import com.study.DoctorAppointmentSystem.entity.Appointment;
import com.study.DoctorAppointmentSystem.entity.Payment;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.enums.PaymentStatus;
import com.study.DoctorAppointmentSystem.repository.AppointmentRepository;
import com.study.DoctorAppointmentSystem.repository.PaymentRepository;
import com.study.DoctorAppointmentSystem.repository.UserRepositories;
import com.study.DoctorAppointmentSystem.services.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

	@Value("${razorpay.key}")
	private String razorpayKey;

	@Value("${razorpay.secret}")
	private String razorpaySecret;

	@Autowired
	private UserRepositories userRepositories;

	@Autowired
	private AppointmentRepository appointmentRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Override
	public Map<String, Object> createPaymentOrder(Integer userId, Integer appointmentId) throws RazorpayException {
		try {
			// Verify user exists (but don't require them to be a patient)
			User user = userRepositories.findById(userId)
					.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

			Appointment appointment = appointmentRepository.findById(appointmentId)
					.orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));

			if (appointment.getDoctor() == null) {
				throw new RuntimeException("No doctor associated with appointment: " + appointmentId);
			}

			Integer consultationFee = appointment.getDoctor().getConsultationFee();
			if (consultationFee == null || consultationFee <= 0) {
				throw new RuntimeException("Invalid consultation fee: " + consultationFee);
			}

			Payment existingPayment = paymentRepository.findByAppointmentId(appointmentId).orElse(null);
			if (existingPayment != null) {
				if (existingPayment.getPaymentStatus() == PaymentStatus.Paid) {
					throw new RuntimeException("This appointment has already been paid");
				}
			}

			System.out.println("Creating Razorpay order for appointment ID: " + appointmentId + ", amount: " + consultationFee);
			System.out.println("Initiated by User ID: " + userId + ", User name: " + user.getName());

			RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);

			JSONObject order = new JSONObject();
			order.put("amount", consultationFee * 100);
			order.put("currency", "INR");
			order.put("receipt", "receipt_" + UUID.randomUUID().toString().substring(0, 6));

			Order razorpayOrder = client.orders.create(order);
			System.out.println("Razorpay order created successfully: " + razorpayOrder.get("id"));

			// Keep one payment row per appointment. A fresh order is required when a
			// previous pending order was created with a different Razorpay account.
			Payment payment = existingPayment != null ? existingPayment : new Payment();
			if (existingPayment == null) {
				payment.setAppointment(appointment);
				payment.setPaymentAmount(consultationFee);
				payment.setPaymentDate(LocalDate.now());
				payment.setPaymentStatus(PaymentStatus.Pending);
			}
			payment.setRazorpayOrderId(razorpayOrder.get("id"));
			payment.setRazorpayPaymentId(null);

			paymentRepository.save(payment);

			JSONObject json = razorpayOrder.toJson();
			return buildOrderResponse(json.getString("id"), json.getInt("amount"), json.getString("status"));
		} catch (RazorpayException e) {
			System.err.println("Razorpay error: " + e.getMessage());
			throw new RuntimeException("Razorpay API error: " + e.getMessage(), e);
		} catch (Exception e) {
			System.err.println("Payment order creation error: " + e.getMessage());
			e.printStackTrace();
			throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
		}
	}

	private Map<String, Object> buildOrderResponse(String orderId, Integer amount, String status) {
		LinkedHashMap<String, Object> map = new LinkedHashMap<>();
		map.put("id", orderId);
		map.put("amount", amount);
		map.put("currency", "INR");
		map.put("status", status);
		return map;
	}

	@Override
	public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature,
			Integer appointmentId) {
		Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
				.orElseThrow(() -> new RuntimeException("Order id not found"));
		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (!payment.getAppointment().getId().equals(appointmentId)) {
			throw new RuntimeException("Payment order does not belong to this appointment");
		}
		if (payment.getPaymentStatus() == PaymentStatus.Paid) {
			return payment.getRazorpayPaymentId().equals(razorpayPaymentId);
		}

		JSONObject options = new JSONObject();
		options.put("razorpay_order_id", razorpayOrderId);
		options.put("razorpay_payment_id", razorpayPaymentId);
		options.put("razorpay_signature", razorpaySignature);

		try {
			boolean isValid = Utils.verifyPaymentSignature(options, razorpaySecret);
			if (!isValid) {
				return false;
			}
			payment.setPaymentStatus(PaymentStatus.Paid);
			payment.setRazorpayPaymentId(razorpayPaymentId);
			paymentRepository.save(payment);

			appointment.setPaymentStatus(PaymentStatus.Paid);

			appointmentRepository.save(appointment);

			return true;
		} catch (RazorpayException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}

}
