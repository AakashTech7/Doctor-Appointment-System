package com.study.DoctorAppointmentSystem.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.study.DoctorAppointmentSystem.entity.Doctor;
import com.study.DoctorAppointmentSystem.enums.DoctorStatus;
import com.study.DoctorAppointmentSystem.repository.DoctorRepository;
import com.study.DoctorAppointmentSystem.services.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

	@Autowired
	private DoctorRepository doctorRepository;

	@Autowired
	private EmailServiceImpl emailServiceImpl;

	@Override
	public String approveDoctor(Integer docId) {
		Doctor doctor = doctorRepository.findById(docId).orElseThrow(() -> new RuntimeException("Doctor not found"));
		doctor.setStatus(DoctorStatus.Approved);
		doctorRepository.save(doctor);
		emailServiceImpl.sendApprovalMailToDoctor(doctor);
		return "Doctor Approved Successfully";
	}

	@Override
	public String rejectDoctor(Integer docId) {
		Doctor doctor = doctorRepository.findById(docId).orElseThrow(() -> new RuntimeException("Doctor not found"));
		doctor.setStatus(DoctorStatus.Rejected);
		doctorRepository.save(doctor);
		emailServiceImpl.sendRejectedMailToDoctor(doctor);
		return "Admin Rejected your profile";
	}

}
