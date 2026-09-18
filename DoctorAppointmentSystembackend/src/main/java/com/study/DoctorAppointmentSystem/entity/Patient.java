package com.study.DoctorAppointmentSystem.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Patient {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer patientId;

	@Column(nullable = false)
	private LocalDate dateOfBirth;

	private Integer age;

	@Column(nullable = false)
	private String gender;

	private String bloodGroup;

	@Column(nullable = false)
	private String address;

	private String city;

	private String state;

	private long pincode;


	@OneToOne
	@JsonIgnore
	private User user;
}
