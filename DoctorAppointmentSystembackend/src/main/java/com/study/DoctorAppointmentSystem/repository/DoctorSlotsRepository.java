package com.study.DoctorAppointmentSystem.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.study.DoctorAppointmentSystem.entity.Doctor;
import com.study.DoctorAppointmentSystem.entity.DoctorSlots;
import com.study.DoctorAppointmentSystem.enums.SlotsStatus;

public interface DoctorSlotsRepository extends JpaRepository<DoctorSlots, Integer> {

//	custom query

	boolean existsByDoctorAndSlotDateAndStartTimeAndEndTime(Doctor doctor, LocalDate slotDate, LocalTime startTime,
			LocalTime endTime);

	List<DoctorSlots> findByDoctorAndSlotDateGreaterThanEqual(Doctor doctor, LocalDate slotDate);

	boolean existsByDoctorAndSlotDateAndStartTimeAndEndTimeAndSlotIdNot(Doctor doctor, LocalDate slotDate,
			LocalTime startTime, LocalTime endTime, Integer slotId);

	List<DoctorSlots> findByDoctorAndSlotStatus(Doctor doctor, SlotsStatus slotsStatus);
}
