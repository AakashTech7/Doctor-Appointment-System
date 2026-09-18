package com.study.DoctorAppointmentSystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.study.DoctorAppointmentSystem.entity.Doctor;
import com.study.DoctorAppointmentSystem.enums.DoctorStatus;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

	List<Doctor> findByStatus(DoctorStatus status);
}
