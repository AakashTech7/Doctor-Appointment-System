package com.study.DoctorAppointmentSystem.services;

import java.util.List;

import com.study.DoctorAppointmentSystem.dtos.DoctorSlotRequestDto;
import com.study.DoctorAppointmentSystem.dtos.DoctorSlotResponseDto;
import com.study.DoctorAppointmentSystem.entity.DoctorSlots;

public interface DoctorSlotsService {

	DoctorSlotResponseDto addSlot(Integer id, DoctorSlotRequestDto doctorSlotRequestDto);

	List<DoctorSlotResponseDto> getAllSlots(Integer id);

	List<DoctorSlotResponseDto> getAvailableSlotsByDoctorId(Integer doctorId);

	void deleteSlot(Integer id, Integer slotId);

	DoctorSlotResponseDto updateSlot(Integer id, Integer slotId, DoctorSlotRequestDto doctorSlotRequestDto);
}
