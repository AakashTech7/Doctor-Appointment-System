package com.study.DoctorAppointmentSystem.entity;

import java.time.LocalDate;

import com.study.DoctorAppointmentSystem.enums.PaymentStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer paymentId;

	@OneToOne
	private Appointment appointment;

	private Integer paymentAmount;

	@Enumerated(EnumType.STRING)
	private PaymentStatus paymentStatus;

	private LocalDate paymentDate;

	private String razorpayOrderId;

	private String razorpayPaymentId;
}
