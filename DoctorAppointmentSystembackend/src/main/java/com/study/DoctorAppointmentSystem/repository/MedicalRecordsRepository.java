package com.study.DoctorAppointmentSystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.study.DoctorAppointmentSystem.entity.Appointment;
import com.study.DoctorAppointmentSystem.entity.MedicalRecords;
import com.study.DoctorAppointmentSystem.entity.Patient;
import java.util.List;


public interface MedicalRecordsRepository extends JpaRepository<MedicalRecords, Integer> {
	
	Optional<MedicalRecords> findByAppointment(Appointment appointment);

	boolean existsByAppointment(Appointment appointment);
	
	List<MedicalRecords> findByPatient(Patient patient);

}
