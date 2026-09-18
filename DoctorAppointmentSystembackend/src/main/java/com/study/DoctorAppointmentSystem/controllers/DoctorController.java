package com.study.DoctorAppointmentSystem.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.study.DoctorAppointmentSystem.dtos.DoctorDto;
import com.study.DoctorAppointmentSystem.services.DoctorService;
import com.study.DoctorAppointmentSystem.services.FileService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/doctors")
@CrossOrigin
public class DoctorController {

	@Autowired
	private DoctorService doctorService;

	@Autowired
	private FileService fileService;

	@Value("${doctor.image.path}")
	private String imagePath;

//	-----------------------------------------
//	POST - localhost:8080/doctors/register/{userId}
//	-----------------------------------------
	@PostMapping("/register/{userId}")
	public ResponseEntity<DoctorDto> addDoctor(@PathVariable Integer userId, @RequestBody DoctorDto doctorDto) {
		return new ResponseEntity<DoctorDto>(doctorService.addDoctor(userId, doctorDto), HttpStatus.CREATED);
	}

//	-----------------------------------------
//	GET - localhost:8080/doctors
//	-----------------------------------------
	@GetMapping
	public ResponseEntity<List<DoctorDto>> getAllDoctors() {
		return ResponseEntity.ok(doctorService.getAllDoctors());
	}

//	-----------------------------------------
//	GET - localhost:8080/doctors/{id}
//	-----------------------------------------
	@GetMapping("/{id}")
	public ResponseEntity<DoctorDto> getDoctorById(@PathVariable Integer id) {
		return ResponseEntity.ok(doctorService.getDoctorById(id));
	}

//	-----------------------------------------
//	PUT - localhost:8080/doctors/{id}
//	-----------------------------------------
	@PutMapping("/{id}")
	public ResponseEntity<DoctorDto> updateDoctor(@PathVariable Integer id, @RequestBody DoctorDto doctorDto) {
		return ResponseEntity.ok(doctorService.updateDoctor(id, doctorDto));
	}

//	-----------------------------------------
//	DELETE - localhost:8080/doctors/{id}
//	-----------------------------------------
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable Integer id) {
		doctorService.deleteDoctor(id);
		HashMap<String, String> response = new HashMap<String, String>();
		response.put("message", "Doctor deleted");
		return ResponseEntity.ok(response);
	}

//	-----------------------------------------
//	POST - localhost:8080/doctors/upload-image/{id}
//	-----------------------------------------
	@PostMapping("/upload-image/{id}")
	public ResponseEntity<String> uploadImage(@RequestParam("doctorImage") MultipartFile file,
			@PathVariable Integer id) {
		String fileName = fileService.uploadImage(file, imagePath);
		DoctorDto dto = doctorService.getDoctorById(id);
		dto.setImageUrl(fileName);
		doctorService.updateDoctor(id, dto);
		return ResponseEntity.ok(fileName);
	}

//	-------------------------------------
//	POST -- localhost:8080/doctors/get-image/{id}
//	-------------------------------------
	@GetMapping("/get-image/{id}")
	public void getImage(@PathVariable Integer id, HttpServletResponse response) {

		DoctorDto dto = doctorService.getDoctorById(id);

		InputStream image = fileService.getResource(imagePath, dto.getImageUrl());
		response.setContentType(MediaType.IMAGE_JPEG_VALUE);
		try {
			StreamUtils.copy(image, response.getOutputStream());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@GetMapping("/pending-status-doctor")
	public ResponseEntity<List<DoctorDto>> getPendingStatusDoctor() {
		return ResponseEntity.ok(doctorService.getDoctorOfPendingStatus());
	}
}
