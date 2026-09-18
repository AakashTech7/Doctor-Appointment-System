package com.study.DoctorAppointmentSystem.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MedicalRecords {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer reportId;

	@Lob
	private String diagnosis;

	@Lob
	private String symptoms;

	@Lob
	private String medicines;

	@Lob
	private String dosage;

	private String medicalTest;

	@Lob
	private String advice;

	private LocalDate createdDate;

	private LocalDate updatedDate;

	@OneToOne
	private Appointment appointment;
	
	private String doctorName;
	
	@ManyToOne
	@JoinColumn(name = "patient_id")
	private Patient patient;

}
