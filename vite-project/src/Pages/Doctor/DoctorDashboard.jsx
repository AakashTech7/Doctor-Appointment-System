import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileHeart,
  History,
  LogOut,
  Pencil,
  Plus,
  Stethoscope,
  UsersRound,
  XCircle,
} from "lucide-react";
import { api } from "../../api";
import { LoginContext } from "../../Context/LoginContext";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState({});
  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();
  const { user, logout } = useContext(LoginContext);

  useEffect(() => {
    const loadDashboard = async () => {
      const requests = [
        user?.doctor?.id ? api.get(`/doctors/${user.doctor.id}`) : Promise.resolve(null),
        api.get("/appointments/doctors/dashboard-cards"),
      ];
      const [doctorResult, dashboardResult] = await Promise.allSettled(requests);

      if (doctorResult.status === "fulfilled" && doctorResult.value?.data) setDoctor(doctorResult.value.data);
      if (dashboardResult.status === "fulfilled") setDashboard(dashboardResult.value.data || {});
    };

    loadDashboard();
  }, [user?.doctor?.id]);

  const doctorName = user?.name?.split(" ")[0] || "Doctor";
  const stats = [
    { value: dashboard.todayAppointments ?? 0, label: "Today's appointments", detail: "Your schedule for today", icon: CalendarCheck2, tone: "teal" },
    { value: dashboard.totalPatients ?? 0, label: "Total patients", detail: "Patients under your care", icon: UsersRound, tone: "blue" },
    { value: dashboard.completedVisits ?? 0, label: "Completed visits", detail: "Consultations delivered", icon: CheckCircle2, tone: "green" },
    { value: `₹${dashboard.monthlyEarnings ?? 0}`, label: "Monthly earnings", detail: "Consultation earnings", icon: CircleDollarSign, tone: "amber" },
  ];

  const actions = [
    { title: "Manage slots", description: "Create and update your available appointment times.", icon: Plus, tone: "teal", button: "Manage slots", path: "/doctor/manage-slots" },
    { title: "Today's schedule", description: "Review patients and stay on top of today's consultations.", icon: CalendarClock, tone: "blue", button: "View schedule", path: "/doctor/today's-schedule" },
    { title: "Patient appointments", description: "Review appointment requests and ongoing consultations.", icon: ClipboardList, tone: "indigo", button: "Manage appointments", path: "/doctor/my-appointments" },
    { title: "My profile", description: "Keep your professional details and availability up to date.", icon: Pencil, tone: "sky", button: "Edit profile", path: "/doctor/update-profile" },
    { title: "Appointment history", description: "Review completed and cancelled consultation records.", icon: History, tone: "orange", button: "View history", path: "/appointment-history" },
    { title: "Rejected requests", description: "View rejected appointment requests and their details.", icon: XCircle, tone: "rose", button: "View requests", path: "/rejected-appointment" },
    { title: "Medical records", description: "Access medical records for patients with completed visits.", icon: FileHeart, tone: "green", button: "View records", path: "/doctor/medical-records-of-distinct-patinet" },
    { title: "Payment status", description: "Review payment status for completed consultations.", icon: CircleDollarSign, tone: "purple", button: "View payments", path: "/doctor/patient-payment-status" },
  ];

  return (
    <main className="doctor-dashboard">
      <div className="doctor-dashboard__container">
        <section className="doctor-hero">
          <div className="doctor-hero__orb doctor-hero__orb--large" />
          <div className="doctor-hero__orb doctor-hero__orb--small" />
          <div className="doctor-hero__content">
            <div className="doctor-hero__copy">
              <span className="doctor-hero__eyebrow"><Stethoscope size={15} /> Clinical workspace</span>
              <h1>Welcome back, <strong>Dr. {doctorName}</strong></h1>
              <p>{doctor?.specialization ? `${doctor.specialization} · ` : ""}Manage appointments, patients, and your practice from one focused workspace.</p>
              <div className="doctor-hero__actions">
                <button className="doctor-button doctor-button--light" onClick={() => navigate("/doctor/today's-schedule")}>
                  <CalendarCheck2 size={17} /> Today's schedule
                </button>
                <button className="doctor-button doctor-button--ghost" onClick={() => { logout?.(); navigate("/"); }}>
                  <LogOut size={17} /> Sign out
                </button>
              </div>
            </div>
            <div className="doctor-hero__profile" aria-label="Doctor profile image">
              <img src={`http://localhost:8080/doctors/get-image/${user?.doctor?.docId}`} alt={`Dr. ${doctorName}`} />
              <span className="doctor-hero__online-dot" title="Available" />
            </div>
          </div>
        </section>

        <section className="doctor-stats" aria-label="Practice overview">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article className="doctor-stat-card" key={stat.label}>
                <div className={`doctor-icon doctor-icon--${stat.tone}`}><Icon size={22} /></div>
                <div>
                  <p className="doctor-stat-card__value">{stat.value}</p>
                  <h2>{stat.label}</h2>
                </div>
                <p className="doctor-stat-card__detail">{stat.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="doctor-actions-section">
          <div className="doctor-section-heading">
            <div>
              <p>Practice tools</p>
              <h2>Manage your clinical work</h2>
            </div>
            <span>Choose an area to continue</span>
          </div>
          <div className="doctor-actions-grid">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <article className="doctor-action-card" key={action.title}>
                  <div className={`doctor-icon doctor-icon--${action.tone}`}><Icon size={22} /></div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  <button onClick={() => navigate(action.path)}>{action.button} <ArrowRight size={16} /></button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default DoctorDashboard;
