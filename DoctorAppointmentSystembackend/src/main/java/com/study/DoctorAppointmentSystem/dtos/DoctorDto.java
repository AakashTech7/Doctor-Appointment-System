package com.study.DoctorAppointmentSystem.dtos;

import com.study.DoctorAppointmentSystem.enums.DoctorStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {

	private Integer docId;

	private String doctorName;

	private String specialization;

	private String qualification;

	private Integer consultationFee;

	private Integer experience;

	private String imageUrl;

	private DoctorStatus status;

}
