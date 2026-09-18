package com.study.DoctorAppointmentSystem.validators;

import com.study.DoctorAppointmentSystem.dtos.UserDto;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, UserDto> {

	@Override
	public boolean isValid(UserDto value, ConstraintValidatorContext context) {

		return value.getPassword().equals(value.getConfirmPassword());
	}

}
