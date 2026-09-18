package com.study.DoctorAppointmentSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
	private Integer appointmentId;

	private Integer paymentAmount;

	private String razorpayPaymentId;

	private String razorpayOrderId;

	private String razorpaySignature;

}
