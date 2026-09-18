package com.study.DoctorAppointmentSystem.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import com.study.DoctorAppointmentSystem.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {

	private Integer paymentId;

	private Integer appointmentId;

	private String patientName;

	private String doctorName;

	private Integer paymentAmount;

	private PaymentStatus paymentStatus;

	private LocalDate paymentDate;

	private String razorpayOrderId;

	private String razorpayPaymentId;

}
