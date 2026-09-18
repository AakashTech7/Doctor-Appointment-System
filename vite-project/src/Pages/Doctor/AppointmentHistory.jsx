import React, { useEffect, useState } from "react";
import { Clock3, Search, UsersRound } from "lucide-react";
import { api } from "../../api";
import "./DoctorOperations.css";
const dateLabel = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const AppointmentHistory = () => {
 const [history, setHistory] = useState([]); const [search, setSearch] = useState("");
 const load = async () => { try { const { data } = await api.get("/appointments/appointment-history"); setHistory(data || []); } catch { setHistory([]); } };
 useEffect(() => { load(); }, []);
 useEffect(() => { const timer = setTimeout(async () => { if (!search) return load(); try { const { data } = await api.get(`/appointments/search?patientName=${encodeURIComponent(search)}`); setHistory(data || []); } catch { setHistory([]); } }, 250); return () => clearTimeout(timer); }, [search]);
 return <main className="doctor-operations"><div className="doctor-operations__container"><header className="doctor-ops-heading"><div><p>Consultation archive</p><h1>Appointment history</h1><span>Review completed consultations and patient visit details.</span></div><div className="doctor-ops-heading__icon"><Clock3 size={25} /></div></header><section className="doctor-ops-toolbar"><label><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient by name" /></label><span><UsersRound size={16} /> {history.length} completed visits</span></section><section className="doctor-ops-panel"><div className="doctor-table-wrap"><table className="doctor-ops-table"><thead><tr><th>Patient</th><th>Age & gender</th><th>Appointment date</th><th>Time</th><th>Status</th></tr></thead><tbody>{history.map((visit) => <tr key={visit.appointmentId || `${visit.patientId}-${visit.appointmentDate}`}><td><div className="doctor-patient"><span>{visit.patientName?.charAt(0) || "P"}</span><div><strong>{visit.patientName}</strong><small>ID · {visit.patientId}</small></div></div></td><td>{visit.age || "—"} years <small>{visit.gender || "—"}</small></td><td><strong>{dateLabel(visit.appointmentDate)}</strong></td><td>{visit.appointmentTime || "—"}</td><td><span className="doctor-history-status">{visit.status || "Completed"}</span></td></tr>)}</tbody></table></div>{!history.length && <div className="doctor-ops-empty"><Search size={34} /><h3>No appointments found</h3><p>Completed appointments matching your search will appear here.</p></div>}</section></div></main>;
};
export default AppointmentHistory;
