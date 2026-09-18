package com.study.DoctorAppointmentSystem.services;

import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

	String uploadImage(MultipartFile file, String path);

	InputStream getResource(String path, String name);

}
