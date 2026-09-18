package com.study.DoctorAppointmentSystem.services.impl;

import java.util.List;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.study.DoctorAppointmentSystem.dtos.DoctorDto;
import com.study.DoctorAppointmentSystem.entity.Doctor;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.enums.DoctorStatus;
import com.study.DoctorAppointmentSystem.repository.DoctorRepository;
import com.study.DoctorAppointmentSystem.repository.UserRepositories;
import com.study.DoctorAppointmentSystem.services.DoctorService;

@Service
public class DoctorServiceImpl implements DoctorService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private DoctorRepository doctorRepository;

	@Autowired
	private UserRepositories userRepositories;

	@Override
	public DoctorDto addDoctor(Integer userId, DoctorDto doctorDto) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = modelMapper.map(doctorDto, Doctor.class);
		doctor.setUser(user);
		doctor.setStatus(DoctorStatus.Pending);
		Doctor savedDoctor = doctorRepository.save(doctor);
		return modelMapper.map(savedDoctor, DoctorDto.class);
	}

	@Override
	public List<DoctorDto> getAllDoctors() {
		List<Doctor> doctor = doctorRepository.findAll();
		List<DoctorDto> listOfDoctors = doctor.stream().map((d) -> {
			DoctorDto responseDto = modelMapper.map(d, DoctorDto.class);
			responseDto.setDoctorName(d.getUser().getName());
			return responseDto;
		}).toList();
		return listOfDoctors;
	}

	@Override
	public DoctorDto getDoctorById(Integer id) {
		Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("doctor not found"));
		DoctorDto responseDto = modelMapper.map(doctor, DoctorDto.class);
		responseDto.setDoctorName(doctor.getUser().getName());
		return responseDto;
	}

	@Override
	public DoctorDto updateDoctor(Integer id, DoctorDto doctorDto) {
		Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Id not found"));

		doctor.setSpecialization(doctorDto.getSpecialization());
		doctor.setQualification(doctorDto.getQualification());
		doctor.setExperience(doctorDto.getExperience());
		doctor.setImageUrl(doctorDto.getImageUrl());
		doctor.setConsultationFee(doctorDto.getConsultationFee());

		Doctor updatedDoctor = doctorRepository.save(doctor);
		return modelMapper.map(updatedDoctor, DoctorDto.class);
	}

	@Override
	public void deleteDoctor(Integer id) {
		Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Id not found"));
		doctorRepository.delete(doctor);
	}

	@Override
	public List<DoctorDto> getDoctorOfPendingStatus() {
		List<Doctor> doctors = doctorRepository.findByStatus(DoctorStatus.Pending);
		List<DoctorDto> response = doctors.stream().map((d)->{
			DoctorDto responseDto = modelMapper.map(d, DoctorDto.class);
			responseDto.setDoctorName(d.getUser().getName());
			return responseDto;
		}).toList();
		return response;
	}

}
