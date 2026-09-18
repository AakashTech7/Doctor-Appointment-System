package com.study.DoctorAppointmentSystem.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.DoctorAppointmentSystem.dtos.MedicalRecordsDto;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.services.MedicalRecordsService;

@RestController
@RequestMapping("/medical-record")
@CrossOrigin
public class MedicalRecordController {

	@Autowired
	private MedicalRecordsService medicalRecordService;

	@PostMapping("/add-record/{appointmentId}")
	public ResponseEntity<MedicalRecordsDto> saveMedicalReport(@RequestBody MedicalRecordsDto medicalRecordsDto,
			@PathVariable Integer appointmentId, @AuthenticationPrincipal User user) {

		return ResponseEntity
				.ok(medicalRecordService.saveMedicalReport(medicalRecordsDto, appointmentId, user.getId()));
	}

	@GetMapping("/doctor/patient-record/{appointmentId}")
	public ResponseEntity<MedicalRecordsDto> getMedicalRecordForDoctor(@PathVariable Integer appointmentId,
			@AuthenticationPrincipal User user) {

		return ResponseEntity.ok(medicalRecordService.getMedicalRecordForDoctor(appointmentId, user.getId()));
	}

	@GetMapping("/patient/{appointmentId}")
	public ResponseEntity<MedicalRecordsDto> getMedicalRecordForPatient(@AuthenticationPrincipal User user,
			@PathVariable Integer appointmentId) {
		return ResponseEntity.ok(medicalRecordService.getMedicalRecordForPatient(user.getId(), appointmentId));
	}

	@GetMapping("/exists/{appointmentId}")
	public ResponseEntity<Boolean> checkMedicalRecordExistsOfPatient(@PathVariable Integer appointmentId) {
		return ResponseEntity.ok(medicalRecordService.checkMedicalRecordExistsOfPatient(appointmentId));
	}

	@PutMapping("/update-record/{appointmentId}")
	public ResponseEntity<MedicalRecordsDto> updateMedicalRecord(@AuthenticationPrincipal User user,
			@RequestBody MedicalRecordsDto medicalRecordsDto, @PathVariable Integer appointmentId) {

		return ResponseEntity
				.ok(medicalRecordService.updateMedicalRecord(user.getId(), appointmentId, medicalRecordsDto));
	}

	@GetMapping("/all-records/{patientId}")
	public ResponseEntity<List<MedicalRecordsDto>> getAllMedicalRecordsOfPatient(@PathVariable Integer patientId) {
		return ResponseEntity.ok(medicalRecordService.getAllMedicalRecordsOfPatient(patientId));
	}

}
