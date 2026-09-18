package com.study.DoctorAppointmentSystem.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.catalina.connector.Response;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.study.DoctorAppointmentSystem.dtos.AppointmentRequestDto;
import com.study.DoctorAppointmentSystem.dtos.AppointmentResponseDto;
import com.study.DoctorAppointmentSystem.dtos.DoctorDashboardDto;
import com.study.DoctorAppointmentSystem.dtos.PatientDashboardDto;
import com.study.DoctorAppointmentSystem.dtos.PatientDto;
import com.study.DoctorAppointmentSystem.entity.Appointment;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.services.AppointmentService;

@RestController
@RequestMapping("/appointments")
@CrossOrigin
public class AppointmentController {

	@Autowired
	private AppointmentService appointmentService;

//	------------------------------------
//	POST- localhost:8080/appointments/book-appointment/{slotId}
//	------------------------------------
	@PostMapping("/book-appointment/{slotId}")
	public ResponseEntity<AppointmentResponseDto> bookAppointment(@AuthenticationPrincipal User user,
			@PathVariable Integer slotId) {
		return new ResponseEntity<AppointmentResponseDto>(appointmentService.bookAppointment(user.getId(), slotId),
				HttpStatus.CREATED);
	}

//	------------------------------------
//	GET - localhost:8080/appointments/{id}
//	------------------------------------

	@GetMapping("/{id}")
	public ResponseEntity<AppointmentResponseDto> getAppointmentById(@PathVariable Integer id) {
		return ResponseEntity.ok(appointmentService.getAppointmentById(id));
	}

//	------------------------------------
//	GET - localhost:8080/appointments
//	------------------------------------

	@GetMapping
	public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments() {
		return ResponseEntity.ok(appointmentService.getAllAppointments());
	}

//	------------------------------------
//	PUT - localhost:8080/appointments/{id}
//	------------------------------------

	@PutMapping("/{id}")
	public ResponseEntity<AppointmentResponseDto> updateAppointment(@PathVariable Integer id,
			@RequestBody AppointmentRequestDto appointmentRequestDto) {
		return ResponseEntity.ok(appointmentService.updateAppointment(id, appointmentRequestDto));
	}
//	------------------------------------
//	DELETE - localhost:8080/appointments/{id}
//	------------------------------------

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteAppointment(@PathVariable Integer id) {
		appointmentService.deleteAppointment(id);
		HashMap<String, String> response = new HashMap<String, String>();
		response.put("message", "Appointment deleted");
		return ResponseEntity.ok(response);
	}

//	------------------------------------
//	GET - localhost:8080/appointments/patient/{id}
//	------------------------------------

	@GetMapping("/patient/{id}")
	public ResponseEntity<List<AppointmentResponseDto>> getAllAppointmentsOfPatientById(
			@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(appointmentService.getAllAppointmentsOfPatientById(user.getPatient().getPatientId()));
	}

//	------------------------------------
//	GET - localhost:8080/appointments/doctor/distinct-patients
//	------------------------------------
	@GetMapping("/doctor/distinct-patients")
	public ResponseEntity<List<PatientDto>> getAllAppointmentsOfDoctorById(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(appointmentService.getAllAppointmentsOfDoctorById(user.getId()));
	}

//	------------------------------------
//	PUT - localhost:8080/appointments/accept/{id}
//	------------------------------------	
	@PutMapping("/accept/{id}")
	public ResponseEntity<AppointmentResponseDto> acceptAppointment(@PathVariable Integer id) {
		return ResponseEntity.ok(appointmentService.acceptAppointment(id));
	}

//	------------------------------------
//	PUT - localhost:8080/appointments/reject/{id}
//	------------------------------------	
	@PutMapping("/reject/{id}")
	public ResponseEntity<AppointmentResponseDto> rejectAppointment(@PathVariable Integer id) {
		return ResponseEntity.ok(appointmentService.rejectAppointment(id));
	}

//	------------------------------------
//	PUT - localhost:8080/appointments/cancel/{id}
//	------------------------------------	
	@PutMapping("/cancel/{id}")
	public ResponseEntity<AppointmentResponseDto> cancelAppointment(@PathVariable Integer id) {
		return ResponseEntity.ok(appointmentService.cancelAppointment(id));
	}

//	------------------------------------
//	 GETlocalhost:8080/appointments/status/pending
//	------------------------------------	
	@GetMapping("/status/pending")
	public ResponseEntity<List<AppointmentResponseDto>> statusPending(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(appointmentService.statusPending(user.getId()));
	}

//	------------------------------------
//	GET - localhost:8080/appointments/today-schedule
//	------------------------------------	
	@GetMapping("/today-schedule")
	public ResponseEntity<List<AppointmentResponseDto>> todaySchedule(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(appointmentService.todaySchedule(user.getId()));
	}

//	------------------------------------
//	PUT - localhost:8080/appointments/complete/{appointmentId}
//	------------------------------------	
	@PutMapping("/complete/{appointmentId}")
	public ResponseEntity<AppointmentResponseDto> completedAppointment(@AuthenticationPrincipal User user,
			@PathVariable Integer appointmentId) {
		return ResponseEntity.ok(appointmentService.completedAppointment(user.getId(), appointmentId));
	}

//	------------------------------------
//	GET - localhost:8080/appointments/appointment-history
//	------------------------------------	
	@GetMapping("/appointment-history")
	public ResponseEntity<List<AppointmentResponseDto>> appointmentHistory(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(appointmentService.appointmentHistory(user.getId()));
	}

//	------------------------------------
//	GET - localhost:8080/appointments/doctors/dashboard-cards
//	------------------------------------	
	@GetMapping("/doctors/dashboard-cards")
	public ResponseEntity<DoctorDashboardDto> getTodayAppointmentTotalPatientCompletedAppointmentMonthlyEarning(
			@AuthenticationPrincipal User user) {
		return ResponseEntity
				.ok(appointmentService.getTodayAppointmentTotalPatientCompletedAppointmentMonthlyEarning(user.getId()));
	}

//	------------------------------------
//	GET - localhost:8080/appointments/rejected-appointments
//	------------------------------------
	@GetMapping("/rejected-appointments")
	public ResponseEntity<List<AppointmentResponseDto>> rejectedAppointments(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(appointmentService.rejectedAppointments(user.getId()));
	}

//	------------------------------------
//	GET - localhost:8080/appointments/patient/dashboard-cards
//	------------------------------------
	@GetMapping("/patient/dashboard-cards")
	public ResponseEntity<PatientDashboardDto> getTotalAppointmentAndTotalConsultantAndReportsAndPrescriptions(
			@AuthenticationPrincipal User user) {
		return ResponseEntity
				.ok(appointmentService.getTotalAppointmentAndTotalConsultantAndReportsAndPrescriptions(user.getId()));
	}

	@GetMapping("/search")
	public ResponseEntity<List<AppointmentResponseDto>> searchCompletedAppointments(@RequestParam String patientName,
			@AuthenticationPrincipal User user) {

		return ResponseEntity.ok(appointmentService.searchCompletedAppointments(patientName, user.getId()));
	}

	@GetMapping("/patient-next-appointment")
	public ResponseEntity<AppointmentResponseDto> getNextAppointment(@AuthenticationPrincipal User user) {
		AppointmentResponseDto responseDto = appointmentService.getNextAppointment(user.getId());
		if (responseDto == null) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/last-consultation-date")
	public ResponseEntity<AppointmentResponseDto> getLastConsultationDate(@AuthenticationPrincipal User user) {
		AppointmentResponseDto responseDto = appointmentService.getLastConsultationDate(user.getId());
		if (responseDto == null) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/count-of-pending-status")
	public ResponseEntity<Long> getCountOfPendingStatus() {
		return ResponseEntity.ok(appointmentService.getCountOfPendingAppointments());
	}

	@GetMapping("/pending-payments")
	public ResponseEntity<List<AppointmentResponseDto>> getPendingPaymentAppointments(
			@AuthenticationPrincipal User user) {

		List<AppointmentResponseDto> appointments = appointmentService.getPendingPaymentAppointments(user.getId());

		return ResponseEntity.ok(appointments);
	}

	@GetMapping("/completed-status")
	public ResponseEntity<List<AppointmentResponseDto>> getCompletedAppointments() {
		return ResponseEntity.ok(appointmentService.getCompletedAppointments());
	}

	@GetMapping("/doctor/all-appointments")
	public ResponseEntity<List<AppointmentResponseDto>> getAllAppointmentsForDoctor(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(appointmentService.getAllAppointmentsForDoctor(user.getId()));
	}

}
