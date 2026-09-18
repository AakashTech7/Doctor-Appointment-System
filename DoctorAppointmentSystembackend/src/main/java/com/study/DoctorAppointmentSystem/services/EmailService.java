package com.study.DoctorAppointmentSystem.services;

import java.time.LocalDate;
import java.time.LocalTime;

import com.study.DoctorAppointmentSystem.entity.Doctor;

public interface EmailService {

	void sendAppointmentAcceptedEmail(String patientEmail, String patientName, String doctorName,
			LocalDate appointmentDate, LocalTime appointmentTime);

	void sendAppointmentRejectEmail(String patientEmail, String patientName, String doctorName,
			LocalDate appointmentDate, LocalTime appointmentTime);

	void sendApprovalMailToDoctor(Doctor doctor);

	void sendRejectedMailToDoctor(Doctor doctor);
}
