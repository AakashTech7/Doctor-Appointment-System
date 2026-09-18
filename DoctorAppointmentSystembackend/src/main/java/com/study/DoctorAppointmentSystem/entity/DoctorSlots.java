package com.study.DoctorAppointmentSystem.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import org.hibernate.annotations.ManyToAny;

import com.study.DoctorAppointmentSystem.enums.SlotsStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DoctorSlots {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer slotId;

	@Column(nullable = false)
	private LocalDate slotDate;

	@Column(nullable = false)
	private LocalTime startTime;

	@Column(nullable = false)
	private LocalTime endTime;

	@Enumerated(EnumType.STRING)
	private SlotsStatus slotStatus;


	@ManyToOne
	private Doctor doctor;
}
