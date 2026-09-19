package com.study.DoctorAppointmentSystem.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.study.DoctorAppointmentSystem.dtos.AppointmentResponseDto;
import com.study.DoctorAppointmentSystem.entity.Appointment;
import com.study.DoctorAppointmentSystem.entity.Doctor;
import com.study.DoctorAppointmentSystem.entity.Patient;
import com.study.DoctorAppointmentSystem.enums.AppointmentStatus;
import com.study.DoctorAppointmentSystem.enums.PaymentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

	List<Appointment> findByPatientPatientId(Integer id);

	List<Appointment> findByDoctorDocId(Integer id);

	List<Appointment> findByDoctorAndStatus(Doctor doctor, AppointmentStatus status);

	List<Appointment> findByDoctorAndAppointmentDateAndStatus(Doctor doctor, LocalDate appointmentDate,
			AppointmentStatus status);

	long countByDoctorAndAppointmentDateAndStatus(Doctor doctor, LocalDate appointmentDate, AppointmentStatus status);

//	unique counts of patients return kregi.
	@Query("SELECT COUNT(DISTINCT a.patient.patientId) FROM Appointment a WHERE a.doctor = :doctor")
	long countDistinctPatientsByDoctor(@Param("doctor") Doctor doctor);

	long countByDoctorAndStatusAndPaymentStatusAndAppointmentDateBetween(Doctor doctor, AppointmentStatus status,
			PaymentStatus paymentStatus, LocalDate startDate, LocalDate endDate);

	long countByPatient(Patient patient);

	@Query("""
			SELECT COUNT(DISTINCT a.doctor)
			FROM Appointment a
			WHERE a.patient = :patient
			AND a.status = :status
			""")
	long countDistinctDoctorsByPatientAndStatus(@Param("patient") Patient patient,
			@Param("status") AppointmentStatus status);

	List<Appointment> findByDoctorAndStatusAndPatientUserNameContainingIgnoreCase(Doctor doctor,
			AppointmentStatus status, String name);

	Optional<Appointment> findFirstByPatientAndStatusOrderByAppointmentDateAscAppointmentTimeAsc(Patient patient,
			AppointmentStatus status);

	Optional<Appointment> findFirstByPatientAndStatusOrderByAppointmentDateDescAppointmentTimeDesc(Patient patient,
			AppointmentStatus status);

	long countByStatus(AppointmentStatus status);

	List<Appointment> findByPatientPatientIdAndPaymentStatusAndStatus(Integer patientId, PaymentStatus paymentStatus,
			AppointmentStatus status);

	List<Appointment> findByPatientPatientIdAndStatus(Integer patientId, AppointmentStatus status);

	long countByDoctorAndStatusAndPaymentStatus(Doctor doctor, AppointmentStatus status, PaymentStatus paymentStatus);

	List<Appointment> findByStatus(AppointmentStatus status);

	List<Appointment> findByDoctor(Doctor doctor);
}
