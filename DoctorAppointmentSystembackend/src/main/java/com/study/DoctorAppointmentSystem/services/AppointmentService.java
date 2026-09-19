package com.study.DoctorAppointmentSystem.services;

import java.util.List;
import com.study.DoctorAppointmentSystem.dtos.AppointmentRequestDto;
import com.study.DoctorAppointmentSystem.dtos.AppointmentResponseDto;
import com.study.DoctorAppointmentSystem.dtos.DoctorDashboardDto;
import com.study.DoctorAppointmentSystem.dtos.PatientDashboardDto;
import com.study.DoctorAppointmentSystem.dtos.PatientDto;
import com.study.DoctorAppointmentSystem.entity.Appointment;

public interface AppointmentService {

	AppointmentResponseDto bookAppointment(Integer userId, Integer slotId);

	AppointmentResponseDto getAppointmentById(Integer id);

	List<AppointmentResponseDto> getAllAppointments();

	AppointmentResponseDto updateAppointment(Integer id, AppointmentRequestDto appointmentRequestDto);

	void deleteAppointment(Integer id);

	List<AppointmentResponseDto> getAllAppointmentsOfPatientById(Integer id);

	List<PatientDto> getAllAppointmentsOfDoctorById(Integer userId);

	AppointmentResponseDto acceptAppointment(Integer id);

	AppointmentResponseDto rejectAppointment(Integer id);

	AppointmentResponseDto cancelAppointment(Integer id);

	List<AppointmentResponseDto> statusPending(Integer id);

	List<AppointmentResponseDto> todaySchedule(Integer id);

	AppointmentResponseDto completedAppointment(Integer userId, Integer appointmentId);

	List<AppointmentResponseDto> appointmentHistory(Integer userId);

	DoctorDashboardDto getTodayAppointmentTotalPatientCompletedAppointmentMonthlyEarning(Integer userId);

	List<AppointmentResponseDto> rejectedAppointments(Integer userId);

	PatientDashboardDto getTotalAppointmentAndTotalConsultantAndReportsAndPrescriptions(Integer userId);

	List<AppointmentResponseDto> searchCompletedAppointments(String keyword, Integer userId);

	AppointmentResponseDto getNextAppointment(Integer userId);

	AppointmentResponseDto getLastConsultationDate(Integer userId);

	Long getCountOfPendingAppointments();

	List<AppointmentResponseDto> getPendingPaymentAppointments(Integer patientId);

	List<AppointmentResponseDto> getPatientPaymentHistory(Integer userId);

	List<AppointmentResponseDto> getCompletedAppointments();

	List<AppointmentResponseDto> getAllAppointmentsForDoctor(Integer userId);

}
