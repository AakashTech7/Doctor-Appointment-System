package com.study.DoctorAppointmentSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.DoctorAppointmentSystem.services.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;

	@PutMapping("/approve-doctor/{docId}")
	public ResponseEntity<String> approveDoctor(@PathVariable Integer docId) {
		return ResponseEntity.ok(adminService.approveDoctor(docId));
	}

	@PutMapping("reject-doctor/{docId}")
	public ResponseEntity<String> rejectDoctor(@PathVariable Integer doctId) {
		return null;
	}

}
