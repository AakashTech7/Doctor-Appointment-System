package com.study.DoctorAppointmentSystem.services.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.study.DoctorAppointmentSystem.Utils.AgeUtil;
import com.study.DoctorAppointmentSystem.dtos.AppointmentRequestDto;
import com.study.DoctorAppointmentSystem.dtos.AppointmentResponseDto;
import com.study.DoctorAppointmentSystem.dtos.DoctorDashboardDto;
import com.study.DoctorAppointmentSystem.dtos.PatientDashboardDto;
import com.study.DoctorAppointmentSystem.dtos.PatientDto;
import com.study.DoctorAppointmentSystem.entity.Appointment;
import com.study.DoctorAppointmentSystem.entity.Doctor;
import com.study.DoctorAppointmentSystem.entity.DoctorSlots;
import com.study.DoctorAppointmentSystem.entity.Patient;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.enums.AppointmentStatus;
import com.study.DoctorAppointmentSystem.enums.PaymentStatus;
import com.study.DoctorAppointmentSystem.enums.SlotsStatus;
import com.study.DoctorAppointmentSystem.repository.AppointmentRepository;
import com.study.DoctorAppointmentSystem.repository.DoctorRepository;
import com.study.DoctorAppointmentSystem.repository.DoctorSlotsRepository;
import com.study.DoctorAppointmentSystem.repository.PatientRepository;
import com.study.DoctorAppointmentSystem.repository.UserRepositories;
import com.study.DoctorAppointmentSystem.services.AppointmentService;
import com.study.DoctorAppointmentSystem.services.EmailService;

@Service
public class AppointmentServiceImpl implements AppointmentService {

	@Autowired
	private UserRepositories userRepositories;

	@Autowired
	private AppointmentRepository appointmentRepository;

	@Autowired
	private DoctorSlotsRepository doctorSlotsRepository;

	@Autowired
	private PatientRepository patientRepository;

	@Autowired
	private DoctorRepository doctorRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public AppointmentResponseDto bookAppointment(Integer userId, Integer slotId) {

		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		DoctorSlots doctorSlots = doctorSlotsRepository.findById(slotId)
				.orElseThrow(() -> new RuntimeException("Slot not found"));

		Doctor doctor = doctorSlots.getDoctor();
		Patient patient = user.getPatient();

		boolean slotAvailable = doctorSlots.getSlotStatus().equals(SlotsStatus.AVAILABLE);

		if (!slotAvailable) {
			throw new RuntimeException("Slot Already Booked");
		}

		Appointment appointment = new Appointment();
		appointment.setAppointmentDate(doctorSlots.getSlotDate());
		appointment.setAppointmentTime(doctorSlots.getStartTime());
		appointment.setDoctor(doctor);
		appointment.setPatient(patient);
		appointment.setDoctorSlots(doctorSlots);
		appointment.setStatus(AppointmentStatus.Pending);

		Appointment saveAppointment = appointmentRepository.save(appointment);

		doctorSlots.setSlotStatus(SlotsStatus.BOOKED);
		doctorSlotsRepository.save(doctorSlots);

		AppointmentResponseDto responseDto = modelMapper.map(saveAppointment, AppointmentResponseDto.class);

		responseDto.setPatientName(patient.getUser().getName());
		responseDto.setDocId(doctor.getDocId());
		responseDto.setDoctorName(doctor.getUser().getName());
		responseDto.setSpecialization(doctor.getSpecialization());

		return responseDto;
	}

	@Override
	public AppointmentResponseDto getAppointmentById(Integer id) {
		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Id not found"));

		AppointmentResponseDto responseDto = modelMapper.map(appointment, AppointmentResponseDto.class);

		responseDto.setPatientName(appointment.getPatient().getUser().getName());
		responseDto.setDoctorName(appointment.getDoctor().getUser().getName());

		return responseDto;
	}

	@Override
	public List<AppointmentResponseDto> getAllAppointments() {

		List<Appointment> appointments = appointmentRepository.findAll();

		List<AppointmentResponseDto> listOfAppointments = appointments.stream().map((a) -> {
			AppointmentResponseDto responseDto = modelMapper.map(a, AppointmentResponseDto.class);
			responseDto.setPatientName(a.getPatient().getUser().getName());
			responseDto.setConsultationFee(a.getDoctor().getConsultationFee());
			responseDto.setDoctorName(a.getDoctor().getUser().getName());
			responseDto.setDateOfBirth(a.getPatient().getDateOfBirth());
			responseDto.setAge(AgeUtil.calculateAge(a.getPatient().getDateOfBirth()));
			responseDto.setGender(a.getPatient().getGender());
			responseDto.setDocId(a.getDoctor().getDocId());
			responseDto.setSpecialization(a.getDoctor().getSpecialization());
			return responseDto;
		}).toList();

		return listOfAppointments;
	}

	@Override
	public AppointmentResponseDto updateAppointment(Integer id, AppointmentRequestDto appointmentRequestDto) {
		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Appointment Id not found"));
		appointment.setAppointmentDate(appointmentRequestDto.getAppointmentDate());
		appointment.setAppointmentTime(appointmentRequestDto.getAppointmentTime());

		Appointment updatedAppointment = appointmentRepository.save(appointment);
		AppointmentResponseDto responseDto = modelMapper.map(updatedAppointment, AppointmentResponseDto.class);
		responseDto.setPatientName(appointment.getPatient().getUser().getName());
		responseDto.setDoctorName(appointment.getDoctor().getUser().getName());
		return responseDto;
	}

	@Override
	public void deleteAppointment(Integer id) {
		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Id not found"));
		appointmentRepository.delete(appointment);
	}

	@Override
	public List<AppointmentResponseDto> getAllAppointmentsOfPatientById(Integer id) {
		List<Appointment> appointments = appointmentRepository.findByPatientPatientId(id);
		List<AppointmentResponseDto> listOfAllPatientAppointments = appointments.stream().map((a) -> {
			AppointmentResponseDto responseDto = modelMapper.map(a, AppointmentResponseDto.class);
			responseDto.setDoctorName(a.getDoctor().getUser().getName());
			responseDto.setSpecialization(a.getDoctor().getSpecialization());
			return responseDto;
		}).toList();
		return listOfAllPatientAppointments;
	}

	@Override
	public List<PatientDto> getAllAppointmentsOfDoctorById(Integer userId) {

		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = user.getDoctor();

		List<Appointment> appointments = appointmentRepository.findByDoctorAndStatus(doctor,
				AppointmentStatus.Completed);
		List<Patient> distinctPatients = appointments.stream().map((appointment) -> appointment.getPatient()).distinct()
				.toList();
		List<PatientDto> listOfPatientDto = distinctPatients.stream().map((p) -> {
			PatientDto responseDto = modelMapper.map(p, PatientDto.class);
			responseDto.setPatientName(p.getUser().getName());
			responseDto.setAge(AgeUtil.calculateAge(p.getDateOfBirth()));
			return responseDto;
		}).toList();
		return listOfPatientDto;
	}

	@Override
	public AppointmentResponseDto acceptAppointment(Integer id) {

		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Appointment Id not found"));

		Patient patient = appointment.getPatient();
		Doctor doctor = appointment.getDoctor();

		appointment.setStatus(AppointmentStatus.Booked);

		appointmentRepository.save(appointment);

		emailService.sendAppointmentAcceptedEmail(patient.getUser().getEmail(), patient.getUser().getName(),
				doctor.getUser().getName(), appointment.getAppointmentDate(), appointment.getAppointmentTime());

		AppointmentResponseDto responseDto = modelMapper.map(appointment, AppointmentResponseDto.class);
		responseDto.setPatientName(appointment.getPatient().getUser().getName());
		responseDto.setDoctorName(appointment.getDoctor().getUser().getName());
		return responseDto;
	}

	@Override
	public AppointmentResponseDto rejectAppointment(Integer id) {
		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Appointment id not found"));
		Patient patient = appointment.getPatient();
		Doctor doctor = appointment.getDoctor();
		appointment.setStatus(AppointmentStatus.Rejected);
		appointmentRepository.save(appointment);
		emailService.sendAppointmentRejectEmail(patient.getUser().getEmail(), patient.getUser().getName(),
				doctor.getUser().getName(), appointment.getAppointmentDate(), appointment.getAppointmentTime());
		AppointmentResponseDto responseDto = modelMapper.map(appointment, AppointmentResponseDto.class);
		responseDto.setPatientName(appointment.getPatient().getUser().getName());
		responseDto.setDoctorName(appointment.getDoctor().getUser().getName());
		return responseDto;
	}

	@Override
	public AppointmentResponseDto cancelAppointment(Integer id) {
		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Appointment id not found"));
		appointment.setStatus(AppointmentStatus.Cancelled);
		appointmentRepository.save(appointment);
		AppointmentResponseDto responseDto = modelMapper.map(appointment, AppointmentResponseDto.class);
		responseDto.setPatientName(appointment.getPatient().getUser().getName());
		responseDto.setDoctorName(appointment.getDoctor().getUser().getName());
		return responseDto;
	}

	@Override
	public List<AppointmentResponseDto> statusPending(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = user.getDoctor();
		List<Appointment> pendingStatus = appointmentRepository.findByDoctorAndStatus(doctor,
				AppointmentStatus.Pending);
		List<AppointmentResponseDto> listOfPendingStatus = pendingStatus.stream().map((ps) -> {
			AppointmentResponseDto responseDto = modelMapper.map(ps, AppointmentResponseDto.class);
			responseDto.setPatientName(ps.getPatient().getUser().getName());
			responseDto.setDoctorName(ps.getDoctor().getUser().getName());
			responseDto.setDateOfBirth(ps.getPatient().getDateOfBirth());
			responseDto.setAge(AgeUtil.calculateAge(ps.getPatient().getDateOfBirth()));
			responseDto.setGender(ps.getPatient().getGender());
			return responseDto;
		}).toList();
		return listOfPendingStatus;
	}

	@Override
	public List<AppointmentResponseDto> todaySchedule(Integer id) {
		User user = userRepositories.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = user.getDoctor();
		LocalDate today = LocalDate.now();
		List<Appointment> bookedStatus = appointmentRepository.findByDoctorAndAppointmentDateAndStatus(doctor, today,
				AppointmentStatus.Booked);
		List<AppointmentResponseDto> listOfTodaysSchedule = bookedStatus.stream().map((bs) -> {
			AppointmentResponseDto responseDto = modelMapper.map(bs, AppointmentResponseDto.class);
			responseDto.setPatientName(bs.getPatient().getUser().getName());
			responseDto.setDoctorName(bs.getDoctor().getUser().getName());
			responseDto.setDateOfBirth(bs.getPatient().getDateOfBirth());
			responseDto.setAge(AgeUtil.calculateAge(bs.getPatient().getDateOfBirth()));
			responseDto.setGender(bs.getPatient().getGender());
			return responseDto;
		}).toList();
		return listOfTodaysSchedule;
	}

	@Override
	public AppointmentResponseDto completedAppointment(Integer userId, Integer appointmentId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));
		appointment.setStatus(AppointmentStatus.Completed);
		appointment.setPaymentStatus(PaymentStatus.Pending);
		Appointment savedAppointment = appointmentRepository.save(appointment);
		AppointmentResponseDto responseDto = modelMapper.map(savedAppointment, AppointmentResponseDto.class);
		return responseDto;
	}

	@Override
	public List<AppointmentResponseDto> appointmentHistory(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = user.getDoctor();
		List<Appointment> appointments = appointmentRepository.findByDoctorAndStatus(doctor,
				AppointmentStatus.Completed);

		long paidCount = appointmentRepository.countByDoctorAndStatusAndPaymentStatus(doctor,
				AppointmentStatus.Completed, PaymentStatus.Paid);

		long pendingCount = appointmentRepository.countByDoctorAndStatusAndPaymentStatus(doctor,
				AppointmentStatus.Completed, PaymentStatus.Pending);
		List<AppointmentResponseDto> listOfAppointmentHistory = appointments.stream().map((a) -> {
			AppointmentResponseDto responseDto = modelMapper.map(a, AppointmentResponseDto.class);
			responseDto.setPatientName(a.getPatient().getUser().getName());
			responseDto.setConsultationFee(a.getDoctor().getConsultationFee());
			responseDto.setAge(AgeUtil.calculateAge(a.getPatient().getDateOfBirth()));
			responseDto.setGender(a.getPatient().getGender());
			responseDto.setPaidCount(paidCount);
			responseDto.setPendingCount(pendingCount);
			return responseDto;
		}).toList();

		return listOfAppointmentHistory;
	}

	@Override
	public DoctorDashboardDto getTodayAppointmentTotalPatientCompletedAppointmentMonthlyEarning(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = user.getDoctor();
		LocalDate today = LocalDate.now();

		long todayAppointments = appointmentRepository.countByDoctorAndAppointmentDateAndStatus(doctor, today,
				AppointmentStatus.Booked);

		long totalPatients = appointmentRepository.countDistinctPatientsByDoctor(doctor);

		List<Appointment> completedVisits = appointmentRepository.findByDoctorAndStatus(doctor,
				AppointmentStatus.Completed);
		int totalCompletedVists = completedVisits.size();

		long month = appointmentRepository.countByDoctorAndStatusAndPaymentStatusAndAppointmentDateBetween(doctor,
				AppointmentStatus.Completed, PaymentStatus.Paid, LocalDate.now().withDayOfMonth(1),
				LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()));

		DoctorDashboardDto dashboardDto = new DoctorDashboardDto();

		dashboardDto.setTodayAppointments(todayAppointments);
		dashboardDto.setTotalPatients(totalPatients);
		dashboardDto.setCompletedVisits(totalCompletedVists);
		dashboardDto.setMonthlyEarnings(month * doctor.getConsultationFee());

		return dashboardDto;
	}

	@Override
	public List<AppointmentResponseDto> rejectedAppointments(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = user.getDoctor();
		List<Appointment> rejectedAppointments = appointmentRepository.findByDoctorAndStatus(doctor,
				AppointmentStatus.Rejected);
		List<AppointmentResponseDto> listOfRejectedAppointments = rejectedAppointments.stream().map((r) -> {
			AppointmentResponseDto responseDto = modelMapper.map(r, AppointmentResponseDto.class);
			responseDto.setPatientName(r.getPatient().getUser().getName());
			responseDto.setAge(AgeUtil.calculateAge(r.getPatient().getDateOfBirth()));
			responseDto.setGender(r.getPatient().getGender());
			return responseDto;
		}).toList();
		return listOfRejectedAppointments;
	}

	@Override
	public PatientDashboardDto getTotalAppointmentAndTotalConsultantAndReportsAndPrescriptions(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Patient patient = user.getPatient();
		long totalAppointments = appointmentRepository.countByPatient(patient);
		long totalConsultants = appointmentRepository.countDistinctDoctorsByPatientAndStatus(patient,
				AppointmentStatus.Completed);
		PatientDashboardDto patientDashboardDto = new PatientDashboardDto();
		patientDashboardDto.setTotalAppointments(totalAppointments);
		patientDashboardDto.setDoctorsConsulted(totalConsultants);
		return patientDashboardDto;
	}

	@Override
	public List<AppointmentResponseDto> searchCompletedAppointments(String patientName, Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = user.getDoctor();
		List<Appointment> searchPatients = appointmentRepository
				.findByDoctorAndStatusAndPatientUserNameContainingIgnoreCase(doctor, AppointmentStatus.Completed,
						patientName);
		List<AppointmentResponseDto> listOfSearchedPatients = searchPatients.stream().map((s) -> {
			AppointmentResponseDto responseDto = modelMapper.map(s, AppointmentResponseDto.class);
			responseDto.setPatientName(s.getPatient().getUser().getName());
			responseDto.setAge(AgeUtil.calculateAge(s.getPatient().getDateOfBirth()));
			responseDto.setGender(s.getPatient().getGender());
			return responseDto;
		}).toList();
		return listOfSearchedPatients;
	}

	@Override
	public AppointmentResponseDto getNextAppointment(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Patient patient = user.getPatient();

		Optional<Appointment> appointment = appointmentRepository
				.findFirstByPatientAndStatusOrderByAppointmentDateAscAppointmentTimeAsc(patient,
						AppointmentStatus.Pending);

		if (appointment.isEmpty()) {
			return null;
		}

		AppointmentResponseDto responseDto = modelMapper.map(appointment.get(), AppointmentResponseDto.class);

		return responseDto;
	}

	@Override
	public AppointmentResponseDto getLastConsultationDate(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("user not found"));
		Patient patient = user.getPatient();
		Optional<Appointment> appointment = appointmentRepository
				.findFirstByPatientAndStatusOrderByAppointmentDateDescAppointmentTimeDesc(patient,
						AppointmentStatus.Completed);
		if (appointment.isEmpty()) {
			return null;
		}
		AppointmentResponseDto responseDto = modelMapper.map(appointment.get(), AppointmentResponseDto.class);
		return responseDto;
	}

	@Override
	public Long getCountOfPendingAppointments() {
		long countOfPendingStatus = appointmentRepository.countByStatus(AppointmentStatus.Pending);
		return countOfPendingStatus;
	}

	@Override
	public List<AppointmentResponseDto> getPendingPaymentAppointments(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Patient patient = user.getPatient();

		List<Appointment> pendingPaymentAppointment = appointmentRepository
				.findByPatientPatientIdAndPaymentStatusAndStatus(patient.getPatientId(), PaymentStatus.Pending,
						AppointmentStatus.Completed);
		List<AppointmentResponseDto> listOfPendingPaymentAppointments = pendingPaymentAppointment.stream().map((p) -> {
			AppointmentResponseDto responseDto = modelMapper.map(p, AppointmentResponseDto.class);
			responseDto.setDoctorName(p.getDoctor().getUser().getName());
			responseDto.setSpecialization(p.getDoctor().getSpecialization());
			responseDto.setAppointmentDate(p.getAppointmentDate());
			responseDto.setAppointmentTime(p.getAppointmentTime());
			responseDto.setConsultationFee(p.getDoctor().getConsultationFee());
			return responseDto;
		}).toList();

		return listOfPendingPaymentAppointments;
	}

	@Override
	public List<AppointmentResponseDto> getPatientPaymentHistory(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Patient patient = user.getPatient();

		return appointmentRepository.findByPatientPatientIdAndStatus(patient.getPatientId(), AppointmentStatus.Completed)
				.stream().map((appointment) -> {
					AppointmentResponseDto responseDto = modelMapper.map(appointment, AppointmentResponseDto.class);
					responseDto.setDoctorName(appointment.getDoctor().getUser().getName());
					responseDto.setSpecialization(appointment.getDoctor().getSpecialization());
					responseDto.setConsultationFee(appointment.getDoctor().getConsultationFee());
					return responseDto;
				}).toList();
	}

	@Override
	public List<AppointmentResponseDto> getCompletedAppointments() {
		List<Appointment> listOfCompletedAppointments = appointmentRepository.findByStatus(AppointmentStatus.Completed);
		List<AppointmentResponseDto> list = listOfCompletedAppointments.stream().map((c) -> {
			AppointmentResponseDto responseDto = modelMapper.map(c, AppointmentResponseDto.class);
			responseDto.setDoctorName(c.getDoctor().getUser().getName());
			responseDto.setConsultationFee(c.getDoctor().getConsultationFee());
			responseDto.setPatientName(c.getPatient().getUser().getName());
			return responseDto;
		}).toList();

		return list;
	}

	@Override
	public List<AppointmentResponseDto> getAllAppointmentsForDoctor(Integer userId) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Doctor doctor = user.getDoctor();
		List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);
		List<AppointmentResponseDto> listOfAppointments = appointments.stream().map((a) -> {
			AppointmentResponseDto responseDto = modelMapper.map(a, AppointmentResponseDto.class);
			responseDto.setPatientName(a.getPatient().getUser().getName());
			responseDto.setDoctorName(a.getDoctor().getUser().getName());
			responseDto.setDateOfBirth(a.getPatient().getDateOfBirth());
			responseDto.setAge(AgeUtil.calculateAge(a.getPatient().getDateOfBirth()));
			responseDto.setGender(a.getPatient().getGender());
			responseDto.setSpecialization(a.getDoctor().getSpecialization());
			return responseDto;
		}).toList();
		return listOfAppointments;
	}

}
