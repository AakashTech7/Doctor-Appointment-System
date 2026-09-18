package com.study.DoctorAppointmentSystem.controllers;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.RazorpayException;
import com.study.DoctorAppointmentSystem.dtos.PaymentRequestDto;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.services.PaymentService;

@RestController
@RequestMapping("/payment")
public class PaymentController {

	@Autowired
	private PaymentService paymentService;

	@PostMapping("/create-payment-order/{appointmentId}")
	public ResponseEntity<?> createPaymentOrder(@AuthenticationPrincipal User user, @PathVariable Integer appointmentId) {
		try {
			Map<String, Object> order = paymentService.createPaymentOrder(user.getId(), appointmentId);
			return ResponseEntity.ok(order);
		} catch (RazorpayException e) {
			return ResponseEntity.status(500).body(Map.of("error", "Razorpay API error: " + e.getMessage()));
		} catch (RuntimeException e) {
			return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
		}
	}

	@PostMapping("/verify-payment/{appointmentId}")
	public ResponseEntity<Boolean> verifyPayment(@RequestBody PaymentRequestDto dto,
			@PathVariable Integer appointmentId) {
		try {
			return ResponseEntity.ok(paymentService.verifyPayment(dto.getRazorpayOrderId(), dto.getRazorpayPaymentId(),
					dto.getRazorpaySignature(), appointmentId));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(false);
		}
	}

}
