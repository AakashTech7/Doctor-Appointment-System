import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, RotateCcw, Search, Stethoscope, UsersRound } from "lucide-react";
import { api } from "../../api";
import "./AdminOperations.css";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const statusClass = (status) => `admin-status admin-status--${String(status || "unknown").toLowerCase()}`;

const MonitorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => { api.get("/appointments").then(({ data }) => setAppointments(data || [])).catch(() => setAppointments([])); }, []);
  const visibleAppointments = useMemo(() => appointments.filter((appointment) => {
    const nameMatches = `${appointment.doctorName || ""} ${appointment.patientName || ""}`.toLowerCase().includes(search.toLowerCase());
    return nameMatches && (!status || appointment.status === status) && (!date || String(appointment.appointmentDate).slice(0, 10) === date);
  }), [appointments, search, status, date]);
  const reset = () => { setSearch(""); setStatus(""); setDate(""); };
  return <main className="admin-operations"><div className="admin-operations__container">
    <header className="admin-page-heading"><div><p>Scheduling overview</p><h1>Monitor appointments</h1><span>Track doctor and patient appointments across your hospital.</span></div><div className="admin-heading-icon admin-heading-icon--amber"><CalendarDays size={25} /></div></header>
    <section className="admin-toolbar admin-toolbar--filters"><label className="admin-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctor or patient" /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{["Pending", "Booked", "Confirmed", "Completed", "Rejected", "Cancelled"].map((item) => <option key={item}>{item}</option>)}</select><input className="admin-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><button className="admin-reset" onClick={reset} title="Reset filters"><RotateCcw size={17} /> Reset</button></section>
    <section className="admin-table-card"><div className="admin-table-card__header"><div><h2>All appointments</h2><p>{visibleAppointments.length} of {appointments.length} appointments shown</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Appointment</th><th>Doctor</th><th>Patient</th><th>Date & time</th><th>Status</th></tr></thead><tbody>{visibleAppointments.map((appointment) => <tr key={appointment.appointmentId}><td><strong>#{appointment.appointmentId}</strong></td><td><div className="admin-person admin-person--compact"><span><Stethoscope size={17} /></span><div><strong>Dr. {appointment.doctorName}</strong><small>{appointment.specialization || "Specialist"}</small></div></div></td><td><div className="admin-person admin-person--compact"><span><UsersRound size={17} /></span><div><strong>{appointment.patientName}</strong><small>ID · {appointment.patientId}</small></div></div></td><td><strong>{formatDate(appointment.appointmentDate)}</strong><small>{appointment.appointmentTime || "Time not set"}</small></td><td><span className={statusClass(appointment.status)}>{appointment.status || "Unknown"}</span></td></tr>)}</tbody></table></div>{!visibleAppointments.length && <div className="admin-empty"><CalendarDays size={32} /><h3>No appointments found</h3><p>Try clearing or adjusting the active filters.</p></div>}</section>
  </div></main>;
};
export default MonitorAppointments;
