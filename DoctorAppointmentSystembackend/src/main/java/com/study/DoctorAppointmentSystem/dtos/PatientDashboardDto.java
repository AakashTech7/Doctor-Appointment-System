package com.study.DoctorAppointmentSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDashboardDto {
	private Long totalAppointments;

	private Long doctorsConsulted;

}
