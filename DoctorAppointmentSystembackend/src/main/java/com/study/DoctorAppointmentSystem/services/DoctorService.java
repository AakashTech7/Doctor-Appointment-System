package com.study.DoctorAppointmentSystem.services;

import java.util.List;

import com.study.DoctorAppointmentSystem.dtos.DoctorDto;
import com.study.DoctorAppointmentSystem.entity.Doctor;

public interface DoctorService {

	DoctorDto addDoctor(Integer userId, DoctorDto doctorDto);

	List<DoctorDto> getAllDoctors();

	DoctorDto getDoctorById(Integer id);

	DoctorDto updateDoctor(Integer id, DoctorDto doctorDto);

	void deleteDoctor(Integer id);

	List<DoctorDto> getDoctorOfPendingStatus();
}
