package com.study.DoctorAppointmentSystem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
	private String token;

//	kisne login kiya uska Obj do
	private UserDto userDto;
}
