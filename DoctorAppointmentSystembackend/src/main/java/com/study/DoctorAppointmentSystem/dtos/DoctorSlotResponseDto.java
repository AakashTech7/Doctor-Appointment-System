package com.study.DoctorAppointmentSystem.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import com.study.DoctorAppointmentSystem.enums.SlotsStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSlotResponseDto {

	private Integer slotId;

	private LocalDate slotDate;

	private LocalTime startTime;

	private LocalTime endTime;

	private String doctorName;

	private SlotsStatus slotsStatus;
}
