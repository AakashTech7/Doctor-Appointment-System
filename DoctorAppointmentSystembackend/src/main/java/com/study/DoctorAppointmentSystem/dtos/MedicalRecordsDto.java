package com.study.DoctorAppointmentSystem.dtos;

import java.time.LocalDate;

import com.study.DoctorAppointmentSystem.entity.Appointment;
import com.study.DoctorAppointmentSystem.entity.Patient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordsDto {
	private Integer reportId;

	private String patientName;
	
	private String doctorName;

	private String diagnosis;

	private String symptoms;

	private String medicines;

	private String dosage;

	private String advice;

	private LocalDate createdDate;

	private LocalDate updatedDate;

	private String medicalTest;

    private Integer appointmentId;
	
	private Integer patientId;
}
