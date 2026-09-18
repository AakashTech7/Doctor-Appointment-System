package com.study.DoctorAppointmentSystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;


import com.study.DoctorAppointmentSystem.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Integer> {

	

}
