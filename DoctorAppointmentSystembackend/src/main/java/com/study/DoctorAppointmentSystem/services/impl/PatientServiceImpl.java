package com.study.DoctorAppointmentSystem.services.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.study.DoctorAppointmentSystem.Utils.AgeUtil;
import com.study.DoctorAppointmentSystem.dtos.PatientDto;
import com.study.DoctorAppointmentSystem.entity.Patient;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.repository.PatientRepository;
import com.study.DoctorAppointmentSystem.repository.UserRepositories;
import com.study.DoctorAppointmentSystem.services.PatientService;

@Service
public class PatientServiceImpl implements PatientService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private PatientRepository patientRepository;

	@Autowired
	private UserRepositories userRepositories;

	@Override
	public PatientDto addPatient(Integer userId, PatientDto patientDto) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("user not exist"));
		Patient patient = modelMapper.map(patientDto, Patient.class);
		patient.setUser(user);
		patient.setAge(AgeUtil.calculateAge(patient.getDateOfBirth()));
		patientRepository.save(patient);
		return modelMapper.map(patient, PatientDto.class);
	}

	@Override
	public List<PatientDto> getAllPatients() {
		List<Patient> patients = patientRepository.findAll();
		return patients.stream().map((p) -> {
			PatientDto responseDto = modelMapper.map(p, PatientDto.class);
			responseDto.setPatientName(p.getUser().getName());
			responseDto.setEmail(p.getUser().getEmail());
			responseDto.setPhoneNumber(p.getUser().getPhNo());
			return responseDto;
		}).toList();
	}

	@Override
	public PatientDto getPatientById(Integer id) {
		Patient patient = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("patient not found"));
		PatientDto patientDto = modelMapper.map(patient, PatientDto.class);
		patientDto.setPatientName(patient.getUser().getName());
		patientDto.setAge(AgeUtil.calculateAge(patient.getDateOfBirth()));
		patientDto.setEmail(patient.getUser().getEmail());
		patientDto.setPhoneNumber(patient.getUser().getPhNo());
		return patientDto;
	}

	@Override
	public PatientDto getPatientdetail(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("id not found"));
		Patient patient = user.getPatient();
		return modelMapper.map(patient, PatientDto.class);
	}

	@Override
	public PatientDto updatePatient(Integer id, PatientDto patientDto) {
		User user = userRepositories.findById(id).orElseThrow(() -> new RuntimeException("id not found"));
		Patient patient = user.getPatient();
		patient.setDateOfBirth(patientDto.getDateOfBirth());
		patient.setGender(patientDto.getGender());
		patient.setBloodGroup(patientDto.getBloodGroup());
		patient.setAddress(patientDto.getAddress());
		patient.setCity(patientDto.getCity());
		patient.setState(patientDto.getState());
		patient.setPincode(patientDto.getPincode());
		Patient updatedPatient = patientRepository.save(patient);
		return modelMapper.map(updatedPatient, PatientDto.class);
	}

	@Override
	public void deletePatient(Integer id) {
		Patient patient = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("id not found"));
		patientRepository.delete(patient);
	}

}
