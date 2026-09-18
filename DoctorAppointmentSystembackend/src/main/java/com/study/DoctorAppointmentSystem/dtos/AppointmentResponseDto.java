package com.study.DoctorAppointmentSystem.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import com.study.DoctorAppointmentSystem.enums.AppointmentStatus;
import com.study.DoctorAppointmentSystem.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {

	private Integer appointmentId;

	private Integer patientId;

	private String patientName;

	private Integer docId;

	private String gender;

	private LocalDate dateOfBirth;

	private int age;

	private String specialization;

	private String doctorName;

	private LocalDate appointmentDate;

	private LocalTime appointmentTime;

	private Integer consultationFee;
	
	private long paidCount;
	
	private long pendingCount;

	private AppointmentStatus status;

	private PaymentStatus paymentStatus;
}
