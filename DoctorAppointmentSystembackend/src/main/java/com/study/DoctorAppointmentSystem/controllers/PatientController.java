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

import com.study.DoctorAppointmentSystem.dtos.PatientDto;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.services.PatientService;

import lombok.Delegate;

@RestController
@RequestMapping("/patient")
@CrossOrigin
public class PatientController {

	@Autowired
	private PatientService patientService;

//	----------------------------------------------
//	POST - localhost:8080/patient/register/{userId}
//	----------------------------------------------

	@PostMapping("/register/{userId}")
	public ResponseEntity<PatientDto> addPatient(@PathVariable Integer userId, @RequestBody PatientDto patientDto) {
		return new ResponseEntity<PatientDto>(patientService.addPatient(userId, patientDto), HttpStatus.CREATED);
	}

//	----------------------------------------------
//	GET - localhost:8080/patient
//	----------------------------------------------

	@GetMapping("/all-patients")
	public ResponseEntity<List<PatientDto>> getAllPatients() {
		return ResponseEntity.ok(patientService.getAllPatients());
	}

//	----------------------------------------------
//	GET - localhost:8080/patient/{id}
//	----------------------------------------------
	@GetMapping("/{patientId}")
	public ResponseEntity<PatientDto> getPatientBypatientId(@PathVariable Integer patientId ) {
		return ResponseEntity.ok(patientService.getPatientById(patientId));
	}
	
//	----------------------------------------------
//	GET - localhost:8080/patient
//	----------------------------------------------
	@GetMapping()
	public ResponseEntity<PatientDto> getPatientDetail(@AuthenticationPrincipal User user ) {
		return ResponseEntity.ok(patientService.getPatientdetail(user.getId()));
	}

//	----------------------------------------------
//	PUT - localhost:8080/patient/{id}
//	----------------------------------------------

	@PutMapping("/update-patient")
	public ResponseEntity<PatientDto> updatePatient(@AuthenticationPrincipal User user, @RequestBody PatientDto patientDto) {
		return ResponseEntity.ok(patientService.updatePatient(user.getId(), patientDto));
	}
//	----------------------------------------------
//	DELETE - localhost:8080/patient/{id}
//	----------------------------------------------

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable Integer id) {
		patientService.deletePatient(id);
		HashMap<String, String> response = new HashMap<String, String>();
		response.put("message", "Patient deleted");
		return ResponseEntity.ok(response);
	}

}
