import React, { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, Droplets, FileHeart, Loader2, MapPin, Search, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./DoctorOperations.css";

const DistinctPatientCards = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/appointments/doctor/distinct-patients")
      .then(({ data }) => setPatients(data || []))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    return patients.filter((patient) => !query || [patient.patientName, patient.city, patient.bloodGroup]
      .filter(Boolean).some((value) => String(value).toLowerCase().includes(query)));
  }, [patients, search]);

  return (
    <main className="doctor-operations medical-directory">
      <div className="doctor-operations__container">
        <header className="medical-directory__hero">
          <div className="medical-directory__hero-copy">
            <span className="medical-directory__eyebrow"><FileHeart size={15} />Clinical workspace</span>
            <h1>Patient medical history</h1>
            <p>Access completed consultation records, treatment notes, and patient medical history from one secure place.</p>
          </div>
          <div className="medical-directory__stat"><span><UsersRound size={22} /></span><div><strong>{patients.length}</strong><small>Patients with records</small></div></div>
        </header>

        <section className="medical-directory__controls">
          <label className="medical-directory__search"><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by patient, city, or blood group" aria-label="Search patients" /></label>
          <div className="medical-directory__result-count"><Activity size={17} /><span><strong>{shown.length}</strong> patient{shown.length === 1 ? "" : "s"} shown</span></div>
        </section>

        {loading ? <section className="medical-directory__empty"><Loader2 className="animate-spin" size={32} /><h2>Loading patient records</h2><p>Retrieving your completed consultation history.</p></section>
          : shown.length ? <section className="medical-directory__grid">{shown.map((patient) => <article key={patient.patientId} className="medical-directory__card">
            <div className="medical-directory__card-top"><span className="medical-directory__avatar">{patient.patientName?.charAt(0)?.toUpperCase() || "P"}</span><span className="medical-directory__id">Patient #{patient.patientId}</span></div>
            <h2>{patient.patientName || "Unnamed patient"}</h2>
            <p className="medical-directory__location"><MapPin size={15} />{patient.city || "Location not recorded"}</p>
            <div className="medical-directory__facts"><span>{patient.age || "—"}<small>Years</small></span><span>{patient.gender || "—"}<small>Gender</small></span><span><Droplets size={15} />{patient.bloodGroup || "—"}<small>Blood group</small></span></div>
            <button onClick={() => navigate(`/all-medical-records/${patient.patientId}`)}>View medical history <ArrowRight size={17} /></button>
          </article>)}</section>
          : <section className="medical-directory__empty"><UsersRound size={34} /><h2>{search ? "No matching patients" : "No patient records yet"}</h2><p>{search ? "Try a different patient name, city, or blood group." : "Patients with completed consultations will appear here."}</p></section>}
      </div>
    </main>
  );
};

export default DistinctPatientCards;
