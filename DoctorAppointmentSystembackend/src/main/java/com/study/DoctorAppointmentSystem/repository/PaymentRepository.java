package com.study.DoctorAppointmentSystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.study.DoctorAppointmentSystem.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

	Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

	Optional<Payment> findByAppointmentId(Integer appointmentId);

}
