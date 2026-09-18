package com.study.DoctorAppointmentSystem.Utils;

import java.time.LocalDate;
import java.time.Period;

public class AgeUtil {

	public static int calculateAge(LocalDate dateOfBirth) {

		LocalDate currentDate = LocalDate.now();

		int currentAge = Period.between(dateOfBirth, currentDate).getYears();

		return currentAge;
	}
}
