package com.study.DoctorAppointmentSystem.dtos;

import java.time.LocalDate;

import com.study.DoctorAppointmentSystem.entity.Appointment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {

	private Integer patientId;

	private String patientName;

	@NotNull
	private LocalDate dateOfBirth;

	@NotNull
	private String gender;

	private String bloodGroup;

	private Integer age;
	
	private String email;
	
	private String phoneNumber;

	@NotNull
	private String address;

	private String city;

	private String state;

	private long pincode;

}
