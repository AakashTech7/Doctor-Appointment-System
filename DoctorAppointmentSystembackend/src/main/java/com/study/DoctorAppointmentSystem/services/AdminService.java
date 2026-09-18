package com.study.DoctorAppointmentSystem.services;

public interface AdminService {

	String approveDoctor(Integer docId);

	String rejectDoctor(Integer docId);
}
