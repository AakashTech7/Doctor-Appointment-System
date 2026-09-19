# Doctor Appointment System 🏥

A full-stack web application designed to simplify and manage doctor appointments, patient records, doctor schedules, and appointment booking through a user-friendly interface.

## 📌 Project Overview

The **Doctor Appointment System** provides a digital platform where patients can find doctors, view their availability, and book appointments. Doctors can manage their schedules and appointments, while the system helps organize patient and appointment information efficiently.

## 🚀 Features

### 👤 Patient

* Patient registration and login
* View available doctors
* Search doctors by specialization
* View doctor details and availability
* Book appointments
* View appointment history
* Manage profile information

### 👨‍⚕️ Doctor

* Doctor registration/login
* Manage doctor profile
* Manage availability and schedules
* View upcoming appointments
* View patient information
* Update appointment status

### 🛡️ Admin

* Manage doctors and patients
* Manage appointments
* Monitor system activities
* Manage doctor specializations
* View overall system information

## 🛠️ Technologies Used

### Frontend

* React.js
* HTML5
* CSS3
* Bootstrap
* JavaScript
* React Hook Form

### Backend

* Java
* Spring Boot
* REST APIs
* Spring Data JPA
* Hibernate

### Database

* MySQL

### Tools

* Git
* GitHub
* Postman
* VS Code / IntelliJ IDEA

## 🏗️ System Architecture

```text
User
  ↓
React Frontend
  ↓
REST API
  ↓
Spring Boot Backend
  ↓
Spring Data JPA / Hibernate
  ↓
MySQL Database
```

## 📂 Project Structure

```text
Doctor-Appointment-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
└── README.md
```

> Update the folder structure above if your actual project structure is different.

## 🔄 Application Flow

```text
Patient
   ↓
Register / Login
   ↓
Search Doctor
   ↓
View Doctor Profile
   ↓
Check Availability
   ↓
Select Date & Time
   ↓
Book Appointment
   ↓
Appointment Confirmation
```

Doctor Flow:

```text
Doctor Login
   ↓
Manage Profile
   ↓
Set Availability
   ↓
View Appointments
   ↓
Manage Appointment Status
```

## 🗄️ Main Modules

* Authentication & User Management
* Patient Management
* Doctor Management
* Specialization Management
* Appointment Management
* Doctor Schedule Management
* Admin Management

## 🔐 Validation & Security

* Form validation on the frontend
* Server-side validation
* REST API validation
* Role-based access where applicable
* Secure database interaction
* Error handling and meaningful API responses

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/Doctor-Appointment-System.git
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 3. Backend Setup

Open the `backend` folder in **IntelliJ IDEA** or **Eclipse**.

Configure your MySQL database in:

```text
application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/doctor_appointment
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Then run the Spring Boot application.

### 4. Database

Create the database in MySQL:

```sql
CREATE DATABASE doctor_appointment;
```

## 🧪 API Testing

REST APIs can be tested using **Postman**.

Example API categories:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/doctors
GET    /api/doctors/{id}

POST   /api/appointments
GET    /api/appointments/{id}
PUT    /api/appointments/{id}
DELETE /api/appointments/{id}
```

> Replace these endpoints with your actual API endpoints if they differ.

## 📸 Screenshots

Add screenshots of your application here:

```text
Home Page
Login Page
Doctor Listing
Doctor Profile
Appointment Booking
Patient Dashboard
Doctor Dashboard
Admin Dashboard
```

## 🎯 Future Enhancements

* Online payment integration
* Email/SMS appointment notifications
* Prescription management
* Medical report upload
* Video consultation
* Doctor reviews and ratings
* Appointment reminders
* Advanced admin analytics

## 👨‍💻 Author

**Aakash**

GitHub: `https://github.com/AakashTech7/Doctor-Appointment-System`

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
