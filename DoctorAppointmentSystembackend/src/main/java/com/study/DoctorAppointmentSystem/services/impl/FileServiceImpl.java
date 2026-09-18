package com.study.DoctorAppointmentSystem.services.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.study.DoctorAppointmentSystem.services.FileService;

@Service
public class FileServiceImpl implements FileService {

	@Override
	public String uploadImage(MultipartFile file, String path) {
		String filename = file.getOriginalFilename();

		String extention = filename.substring(filename.lastIndexOf('.'));

		String newFileName = UUID.randomUUID().toString() + extention;

		File folder = new File(path);

		if (!folder.exists()) {
			folder.mkdirs();
		}

		try {
			Files.copy(file.getInputStream(), Paths.get(path, newFileName));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return newFileName;
	}

	@Override
	public InputStream getResource(String path, String name) {
		String fileName = path + File.separator + name;
		FileInputStream inputStream = null;

		try {
			inputStream = new FileInputStream(fileName);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return inputStream;
	}

}
