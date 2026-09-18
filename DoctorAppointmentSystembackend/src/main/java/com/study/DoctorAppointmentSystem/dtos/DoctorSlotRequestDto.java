package com.study.DoctorAppointmentSystem.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSlotRequestDto {

	@NotNull
	@FutureOrPresent
	private LocalDate slotDate;

	@NotNull
	private LocalTime startTime;

	@NotNull
	private LocalTime endTime;
}
