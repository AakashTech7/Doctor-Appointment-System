package com.study.DoctorAppointmentSystem.services.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.study.DoctorAppointmentSystem.dtos.UserDto;
import com.study.DoctorAppointmentSystem.entity.User;
import com.study.DoctorAppointmentSystem.repository.UserRepositories;
import com.study.DoctorAppointmentSystem.services.UserService;

@Service
public class UserServiceimpl implements UserService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private UserRepositories userRepositories;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public UserDto registerUser(UserDto userDto) {
		String password = passwordEncoder.encode(userDto.getPassword());
		userDto.setPassword(password);
		User user = modelMapper.map(userDto, User.class);
		userRepositories.save(user);
		return modelMapper.map(user, UserDto.class);
	}

	@Override
	public boolean checkEmail(String email) {
		return userRepositories.existsByEmail(email);
	}

}
