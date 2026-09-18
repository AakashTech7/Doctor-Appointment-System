package com.study.DoctorAppointmentSystem.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.study.DoctorAppointmentSystem.enums.AppointmentStatus;
import com.study.DoctorAppointmentSystem.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Appointment {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@Column(nullable = false)
	private LocalDate appointmentDate;

	@Column(nullable = false)
	private LocalTime appointmentTime;

	@ManyToOne
	private Doctor doctor;

	@ManyToOne
	private Patient patient;

	@OneToOne
	private DoctorSlots doctorSlots;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AppointmentStatus status;

	@OneToOne(mappedBy = "appointment")
	private MedicalRecords medicalRecord;

	@Enumerated(EnumType.STRING)
	private PaymentStatus paymentStatus;
	
	@OneToOne
	private Payment payment;
}
