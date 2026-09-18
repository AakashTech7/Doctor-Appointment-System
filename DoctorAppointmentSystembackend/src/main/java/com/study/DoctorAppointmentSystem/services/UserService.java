package com.study.DoctorAppointmentSystem.services;

import com.study.DoctorAppointmentSystem.dtos.UserDto;

public interface UserService {
	UserDto registerUser(UserDto userDto);

	boolean checkEmail(String email);
}
