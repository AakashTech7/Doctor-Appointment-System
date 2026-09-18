package com.study.DoctorAppointmentSystem.services;

import java.util.List;

import com.study.DoctorAppointmentSystem.dtos.MedicalRecordsDto;

public interface MedicalRecordsService {

//	to create/update the report.
	MedicalRecordsDto saveMedicalReport(MedicalRecordsDto medicalReportDto, Integer appointmentId, Integer userId);

//	to display the report.
	MedicalRecordsDto getMedicalRecordForDoctor(Integer appointmentId, Integer userId);

//	Patient view their report
	MedicalRecordsDto getMedicalRecordForPatient(Integer userId, Integer appointmentId);

	boolean checkMedicalRecordExistsOfPatient(Integer appointmentId);

	MedicalRecordsDto updateMedicalRecord(Integer userId, Integer appointmentId, MedicalRecordsDto medicalRecordsDto);
	
	 List<MedicalRecordsDto> getAllMedicalRecordsOfPatient(Integer patientId);
}
