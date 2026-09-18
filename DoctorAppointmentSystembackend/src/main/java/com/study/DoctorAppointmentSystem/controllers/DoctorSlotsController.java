package com.study.DoctorAppointmentSystem.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.DoctorAppointmentSystem.dtos.DoctorSlotRequestDto;
import com.study.DoctorAppointmentSystem.dtos.DoctorSlotResponseDto;
import com.study.DoctorAppointmentSystem.entity.DoctorSlots;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.services.DoctorSlotsService;

@RestController
@RequestMapping("/slots")
@CrossOrigin
public class DoctorSlotsController {

	@Autowired
	private DoctorSlotsService doctorSlotsService;

	@PostMapping
	public ResponseEntity<DoctorSlotResponseDto> addSlots(@AuthenticationPrincipal User user,
			@RequestBody DoctorSlotRequestDto doctorSlotRequestDto) {
		return new ResponseEntity<DoctorSlotResponseDto>(doctorSlotsService.addSlot(user.getId(), doctorSlotRequestDto),
				HttpStatus.CREATED);
	}

	@GetMapping("/my-slots")
	public ResponseEntity<List<DoctorSlotResponseDto>> getAllSlots(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(doctorSlotsService.getAllSlots(user.getId()));
	}

	@GetMapping("/doctor/{doctorId}")
	public ResponseEntity<List<DoctorSlotResponseDto>> getAvailableSlotsByDoctorId(@PathVariable Integer doctorId) {
		return ResponseEntity.ok(doctorSlotsService.getAvailableSlotsByDoctorId(doctorId));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteSlot(@AuthenticationPrincipal User user,
			@PathVariable Integer id) {
		doctorSlotsService.deleteSlot(user.getId(), id);
		HashMap<String, String> response = new HashMap<String, String>();
		response.put("message", "Slot deleted");
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<DoctorSlotResponseDto> updateSlot(@AuthenticationPrincipal User user,
			@PathVariable Integer id, @RequestBody DoctorSlotRequestDto doctorSlotRequestDto) {
		return ResponseEntity.ok(doctorSlotsService.updateSlot(user.getId(), id, doctorSlotRequestDto));
	}

}
