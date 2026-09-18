package com.study.DoctorAppointmentSystem.services.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.study.DoctorAppointmentSystem.dtos.MedicalRecordsDto;
import com.study.DoctorAppointmentSystem.entity.Appointment;
import com.study.DoctorAppointmentSystem.entity.Doctor;
import com.study.DoctorAppointmentSystem.entity.MedicalRecords;
import com.study.DoctorAppointmentSystem.entity.Patient;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.repository.AppointmentRepository;
import com.study.DoctorAppointmentSystem.repository.MedicalRecordsRepository;
import com.study.DoctorAppointmentSystem.repository.PatientRepository;
import com.study.DoctorAppointmentSystem.repository.UserRepositories;
import com.study.DoctorAppointmentSystem.services.MedicalRecordsService;

@Service
public class MedicalRecordsServiceImpl implements MedicalRecordsService {

	@Autowired
	private MedicalRecordsRepository medicalRecordRepository;

	@Autowired
	private AppointmentRepository appointmentRepository;

	@Autowired
	private UserRepositories userRepositories;

	@Autowired
	private PatientRepository patienRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public MedicalRecordsDto saveMedicalReport(MedicalRecordsDto medicalRecordsDto, Integer appointmentId,
			Integer userId) {

		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (!appointment.getDoctor().getUser().getId().equals(user.getId())) {
			throw new RuntimeException("You are not authorized to add medical record.");
		}

		Optional<MedicalRecords> medicalRecord = medicalRecordRepository.findByAppointment(appointment);

		if (medicalRecord.isEmpty()) {
			MedicalRecords medical = new MedicalRecords();

			medical.setAppointment(appointment);
			medical.setDiagnosis(medicalRecordsDto.getDiagnosis());
			medical.setSymptoms(medicalRecordsDto.getSymptoms());
			medical.setMedicines(medicalRecordsDto.getMedicines());
			medical.setDosage(medicalRecordsDto.getDosage());
			medical.setMedicalTest(medicalRecordsDto.getMedicalTest());
			medical.setAdvice(medicalRecordsDto.getAdvice());
			medical.setCreatedDate(LocalDate.now());
			medical.setPatient(appointment.getPatient());

			medicalRecordRepository.save(medical);

			return modelMapper.map(medical, MedicalRecordsDto.class);
		} else {
			return modelMapper.map(medicalRecord.get(), MedicalRecordsDto.class);
		}

	}

	@Override
	public MedicalRecordsDto getMedicalRecordForDoctor(Integer appointmentId, Integer userId) {

		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (!appointment.getDoctor().getUser().getId().equals(user.getId())) {
			throw new RuntimeException("You are not authorized to view this medical record.");
		}

		MedicalRecords medicalRecord = medicalRecordRepository.findByAppointment(appointment)
				.orElseThrow(() -> new RuntimeException("Medical Record Not Found"));

		MedicalRecordsDto responseDto = modelMapper.map(medicalRecord, MedicalRecordsDto.class);
		responseDto.setPatientName(appointment.getPatient().getUser().getName());
		return responseDto;
	}

	@Override
	public MedicalRecordsDto getMedicalRecordForPatient(Integer userId, Integer appointmentId) {

		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (!appointment.getPatient().getUser().getId().equals(user.getId())) {
			throw new RuntimeException("You are not authorized to view this medical record.");
		}

		MedicalRecords medicalRecord = medicalRecordRepository.findByAppointment(appointment)
				.orElseThrow(() -> new RuntimeException("Medical Record Not Found"));
		medicalRecord.setDoctorName(appointment.getDoctor().getUser().getName());

		return modelMapper.map(medicalRecord, MedicalRecordsDto.class);
	}

	@Override
	public boolean checkMedicalRecordExistsOfPatient(Integer appointmentId) {
		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));
		return medicalRecordRepository.existsByAppointment(appointment);
	}

	@Override
	public MedicalRecordsDto updateMedicalRecord(Integer userId, Integer appointmentId,
			MedicalRecordsDto medicalRecordsDto) {
		User user = userRepositories.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (!appointment.getDoctor().getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Unauthorized");
		}

		MedicalRecords medicalRecord = medicalRecordRepository.findByAppointment(appointment)
				.orElseThrow(() -> new RuntimeException("Medical Record Not Found"));

		medicalRecord.setDiagnosis(medicalRecordsDto.getDiagnosis());
		medicalRecord.setSymptoms(medicalRecordsDto.getSymptoms());
		medicalRecord.setMedicines(medicalRecordsDto.getMedicines());
		medicalRecord.setDosage(medicalRecordsDto.getDosage());
		medicalRecord.setMedicalTest(medicalRecordsDto.getMedicalTest());
		medicalRecord.setAdvice(medicalRecordsDto.getAdvice());

		medicalRecord.setUpdatedDate(LocalDate.now());

		MedicalRecords updatedMedicalRecord = medicalRecordRepository.save(medicalRecord);

		return modelMapper.map(updatedMedicalRecord, MedicalRecordsDto.class);
	}

	@Override
	public List<MedicalRecordsDto> getAllMedicalRecordsOfPatient(Integer patientId) {
		Patient patient = patienRepository.findById(patientId)
				.orElseThrow(() -> new RuntimeException("Patientnot found"));
		List<MedicalRecords> listOfMedicalRecords = medicalRecordRepository.findByPatient(patient);
		List<MedicalRecordsDto> records = listOfMedicalRecords.stream().map((r) -> {
			MedicalRecordsDto recordsDto = modelMapper.map(r, MedicalRecordsDto.class);
			recordsDto.setAppointmentId(r.getAppointment().getId());
			recordsDto.setPatientName(r.getPatient().getUser().getName());
			recordsDto.setPatientId(r.getPatient().getPatientId());
			recordsDto.setDoctorName(r.getAppointment().getDoctor().getUser().getName());
			return recordsDto;
		}).toList();
		return records;
	}

}
