package com.study.DoctorAppointmentSystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.study.DoctorAppointmentSystem.entity.User;

public interface UserRepositories extends JpaRepository<User, Integer> {

	boolean existsByEmail(String email);
	
	Optional<User> findByEmail(String email);
}
