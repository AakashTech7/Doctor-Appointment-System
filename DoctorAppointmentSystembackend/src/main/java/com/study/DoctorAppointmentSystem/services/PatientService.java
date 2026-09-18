package com.study.DoctorAppointmentSystem.services;

import java.util.List;

import com.study.DoctorAppointmentSystem.dtos.PatientDto;

public interface PatientService {
	PatientDto addPatient(Integer userId, PatientDto patientDto);

	List<PatientDto> getAllPatients();

	PatientDto getPatientById(Integer id);

	PatientDto getPatientdetail(Integer userId);

	PatientDto updatePatient(Integer id, PatientDto patientDto);

	void deletePatient(Integer id);
}
