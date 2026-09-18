package com.study.DoctorAppointmentSystem.services.impl;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.study.DoctorAppointmentSystem.entity.Doctor;
import com.study.DoctorAppointmentSystem.services.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
	private JavaMailSender javaMailSender;

	@Value("${spring.mail.username}")
	private String senderEmail;

	@Override
	public void sendAppointmentAcceptedEmail(String patientEmail, String patientName, String doctorName,
			LocalDate appointmentDate, LocalTime appointmentTime) {
		System.out.println("Email method called");
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(senderEmail);
		message.setTo(patientEmail);
		message.setSubject("Appointment Confirmed");
		message.setText("Hello " + patientName + ",\n\n" + "Your appointment has been confirmed.\n\n" + "Doctor: Dr. "
				+ doctorName + "\n" + "Date: " + appointmentDate + "\n" + "Time: " + appointmentTime + "\n\n"
				+ "Please arrive 10 minutes before your scheduled appointment.\n\n"
				+ "Thank you for choosing our hospital.\n\n" + "Regards,\n" + "Doctor Appointment System");
		javaMailSender.send(message);
		System.out.println("Email sent");
	}

	@Override
	public void sendAppointmentRejectEmail(String patientEmail, String patientName, String doctorName,
			LocalDate appointmentDate, LocalTime appointmentTime) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(senderEmail);
		message.setTo(patientEmail);
		message.setSubject("Appointment Confirmed");
		message.setText("Hello " + patientName + ",\n\n" + "Your appointment has been Rejected.\n\n" + "Doctor: Dr. "
				+ doctorName + "\n" + "Date: " + appointmentDate + "\n" + "Time: " + appointmentTime + "\n\n"
				+ "Thank you for choosing our hospital.\n\n" + "Regards,\n" + "Doctor Appointment System");
		javaMailSender.send(message);

	}

	@Override
	public void sendApprovalMailToDoctor(Doctor doctor) {
		SimpleMailMessage mail = new SimpleMailMessage();

		String to = doctor.getUser().getEmail();

		String subject = "Doctor Registration Approved";

		String message = "Dear Dr. " + doctor.getUser().getName() + ",\n\n" + "Congratulations! 🎉\n\n"
				+ "We are pleased to inform you that your profile has been successfully verified and approved by the Admin.\n\n"
				+ "Your account is now active, and you can log in to the Doctor Appointment System to start managing appointments and providing healthcare services to patients.\n\n"
				+ "Login to your account and begin accepting appointments.\n\n"
				+ "Thank you for being a part of our platform.\n\n" + "Best Regards,\n"
				+ "Doctor Appointment System Team";
		mail.setFrom(senderEmail);
		mail.setTo(to);
		mail.setSubject(subject);
		mail.setText(message);

		try {
			javaMailSender.send(mail);
			System.out.println("Mail sent");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void sendRejectedMailToDoctor(Doctor doctor) {
		SimpleMailMessage mail = new SimpleMailMessage();

		String to = doctor.getUser().getEmail();

		String subject = "Doctor Registration Rejected";

		String message = "Dear Dr. " + doctor.getUser().getName() + ",\n\n"
				+ "We regret to inform you that your profile registration has been rejected by the Admin after reviewing your application.\n\n"
				+ "As a result, your account has not been activated, and you are currently unable to access the Doctor Appointment System.\n\n"
				+ "If you believe this decision was made in error or you require further clarification, please feel free to contact our support team.\n\n"
				+ "Thank you for your interest in joining our platform. We wish you all the best in your future endeavors.\n\n"
				+ "Best Regards,\n" + "Doctor Appointment System Team";
		mail.setFrom(senderEmail);
		mail.setTo(to);
		mail.setSubject(subject);
		mail.setText(message);

		try {
			javaMailSender.send(mail);
			System.out.println("Mail sent");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
