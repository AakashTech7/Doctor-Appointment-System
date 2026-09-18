import React, { useEffect, useMemo, useState } from "react";
import { Eye, MapPin, Search, UsersRound, X } from "lucide-react";
import { api } from "../../api";
import "./AdminOperations.css";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    api.get("/patient/all-patients").then(({ data }) => setPatients(data || [])).catch(() => setPatients([]));
  }, []);

  const visiblePatients = useMemo(() => patients.filter((patient) =>
    `${patient.patientName || ""} ${patient.email || ""}`.toLowerCase().includes(search.toLowerCase())), [patients, search]);

  const openPatient = async (patientId) => {
    try { const { data } = await api.get(`/patient/${patientId}`); setSelectedPatient(data); } catch { setSelectedPatient(null); }
  };

  return (
    <main className="admin-operations">
      <div className="admin-operations__container">
        <header className="admin-page-heading">
          <div><p>Patient directory</p><h1>Registered patients</h1><span>Search and review patient details from one secure directory.</span></div>
          <div className="admin-heading-icon"><UsersRound size={25} /></div>
        </header>
        <section className="admin-toolbar">
          <label className="admin-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by patient name or email" /></label>
          <span className="admin-count"><UsersRound size={16} /> {patients.length} registered patients</span>
        </section>
        <section className="admin-table-card">
          <div className="admin-table-card__header"><div><h2>Patient records</h2><p>{visiblePatients.length} results shown</p></div></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Patient</th><th>Contact</th><th>Gender</th><th>Blood group</th><th>Location</th><th aria-label="Actions" /></tr></thead>
            <tbody>{visiblePatients.map((patient) => <tr key={patient.patientId}><td><div className="admin-person"><span>{patient.patientName?.charAt(0) || "P"}</span><div><strong>{patient.patientName}</strong><small>ID · {patient.patientId}</small></div></div></td><td><strong className="admin-email">{patient.email || "—"}</strong><small>{patient.phoneNumber || "No phone number"}</small></td><td><span className="admin-chip admin-chip--blue">{patient.gender || "—"}</span></td><td><span className="admin-chip admin-chip--rose">{patient.bloodGroup || "—"}</span></td><td><span className="admin-location"><MapPin size={15} /> {patient.city || "—"}</span></td><td><button className="admin-view-button" onClick={() => openPatient(patient.patientId)}><Eye size={16} /> View</button></td></tr>)}</tbody>
          </table></div>
          {!visiblePatients.length && <div className="admin-empty"><UsersRound size={32} /><h3>No patients found</h3><p>Try changing your search to find a patient record.</p></div>}
        </section>
      </div>
      {selectedPatient && <div className="admin-modal-backdrop" role="presentation" onMouseDown={() => setSelectedPatient(null)}><section className="admin-patient-modal" role="dialog" aria-modal="true" aria-labelledby="patient-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><div className="admin-person"><span>{selectedPatient.patientName?.charAt(0) || "P"}</span><div><p>Patient record</p><h2 id="patient-title">{selectedPatient.patientName}</h2><small>ID · {selectedPatient.patientId}</small></div></div><button aria-label="Close patient details" onClick={() => setSelectedPatient(null)}><X size={20} /></button></header>
        <div className="admin-detail-grid">{[["Email", selectedPatient.email], ["Phone", selectedPatient.phoneNumber], ["Date of birth", selectedPatient.dateOfBirth], ["Gender", selectedPatient.gender], ["Blood group", selectedPatient.bloodGroup], ["City", selectedPatient.city], ["State", selectedPatient.state], ["Pincode", selectedPatient.pincode], ["Address", selectedPatient.address]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value || "—"}</strong></div>)}</div>
      </section></div>}
    </main>
  );
};
export default ManagePatients;
