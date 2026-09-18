import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import "./DoctorClinicalRecords.css";

const formatDate = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Not available";
  return new Date(value).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const Detail = ({ label, value, icon }) => (
  <div className="col-md-6">
    <div className="h-100 p-3 rounded-3" style={{ background: "#f8fafc" }}>
      <small className="d-flex align-items-center gap-2 text-uppercase fw-bold text-muted mb-2" style={{ fontSize: ".7rem", letterSpacing: ".06em" }}><i className={`bi bi-${icon}`} />{label}</small>
      <p className="mb-0 text-dark" style={{ whiteSpace: "pre-wrap" }}>{value || "Not recorded"}</p>
    </div>
  </div>
);

const PatientMedicalHistory = () => {
  const { patientId } = useParams();
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recordLoading, setRecordLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPatientRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/medical-record/all-records/${patientId}`);
      setRecords(response.data || []);
    } catch (requestError) {
      console.error("Could not load medical history:", requestError);
      setError("We could not load this patient's medical history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecord = async (appointmentId) => {
    setRecordLoading(true);
    setSelectedRecord(null);
    try {
      const response = await api.get(`/medical-record/doctor/patient-record/${appointmentId}`);
      setSelectedRecord(response.data);
    } catch (requestError) {
      console.error("Could not load medical record:", requestError);
      setSelectedRecord({ error: "The full record could not be loaded." });
    } finally {
      setRecordLoading(false);
    }
  };

  useEffect(() => { fetchPatientRecords(); }, [patientId]);

  return (
    <main className="container-fluid py-4 py-lg-5 medical-history-page doctor-clinical-history" style={{ maxWidth: "1440px" }}>
      <section className="history-hero rounded-4 p-4 p-lg-5 mb-4 text-white shadow-sm">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <p className="text-white-50 text-uppercase fw-semibold small mb-2" style={{ letterSpacing: ".08em" }}>Clinical records</p>
            <h1 className="h2 fw-bold mb-2">Patient Medical History</h1>
            <p className="mb-0 text-white-50">Review previous consultations, diagnoses, and treatment plans in one place.</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-4 px-4 py-3 text-center"><div className="fs-3 fw-bold">{records.length}</div><small className="text-white-50">Medical records</small></div>
        </div>
      </section>

      {loading ? <div className="py-5 text-center text-muted"><div className="spinner-border text-success mb-3" role="status" /><p className="mb-0">Loading medical history…</p></div>
        : error ? <div className="alert alert-danger border-0 shadow-sm d-flex justify-content-between align-items-center" role="alert"><span><i className="bi bi-exclamation-circle-fill me-2" />{error}</span><button className="btn btn-outline-danger btn-sm" onClick={fetchPatientRecords}>Try again</button></div>
        : records.length === 0 ? <div className="bg-white rounded-4 shadow-sm p-5 text-center"><div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 64, height: 64, background: "#ecfdf5", color: "#0f766e" }}><i className="bi bi-clipboard2-pulse fs-2" /></div><h2 className="h5 fw-bold">No medical records yet</h2><p className="text-muted mb-0">Records from completed consultations will appear here.</p></div>
        : <div className="row g-4">{records.map((record) => <div className="col-md-6 col-xl-4" key={record.reportId}>
          <article className="card history-record-card border-0 h-100 rounded-4 overflow-hidden">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-4"><div className="d-flex align-items-center gap-3"><div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 46, height: 46, background: "#ecfdf5", color: "#0f766e" }}><i className="bi bi-file-earmark-medical-fill fs-5" /></div><div><p className="fw-bold mb-0">Consultation record</p><small className="text-muted">Report #{record.reportId}</small></div></div><span className="badge rounded-pill text-bg-light border">{formatDate(record.createdDate)}</span></div>
              <div className="mb-3"><small className="d-block text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: ".7rem", letterSpacing: ".06em" }}>Diagnosis</small><p className="mb-0 fw-medium">{record.diagnosis || "Not recorded"}</p></div>
              <div><small className="d-block text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: ".7rem", letterSpacing: ".06em" }}>Recommended test</small><p className="mb-0 text-secondary">{record.medicalTest || "No test prescribed"}</p></div>
            </div>
            <div className="card-footer bg-white border-top p-3"><button className="btn history-view-btn w-100" data-bs-toggle="modal" data-bs-target="#viewMedicalRecordModal" onClick={() => fetchPatientRecord(record.appointmentId)}><span><i className="bi bi-eye-fill me-2" />View complete record</span><i className="bi bi-arrow-right" /></button></div>
          </article>
        </div>)}</div>}

      <div className="modal fade" id="viewMedicalRecordModal" tabIndex="-1" aria-labelledby="viewMedicalRecordModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered"><div className="modal-content border-0 rounded-4 overflow-hidden">
          <div className="modal-header border-0 text-white px-4 py-3" style={{ background: "linear-gradient(120deg, #0f766e, #0f4c5c)" }}><div><h2 className="modal-title h5 fw-bold mb-1" id="viewMedicalRecordModalLabel">Medical record</h2><small className="text-white-50">Consultation details and treatment plan</small></div><button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" /></div>
          <div className="modal-body p-4 p-lg-5">{recordLoading ? <div className="py-5 text-center"><div className="spinner-border text-success" role="status" /></div> : selectedRecord?.error ? <div className="alert alert-danger mb-0">{selectedRecord.error}</div> : selectedRecord && <div className="row g-4"><Detail label="Patient" value={selectedRecord.patientName} icon="person" /><Detail label="Created" value={formatDate(selectedRecord.createdDate)} icon="calendar3" /><Detail label="Diagnosis" value={selectedRecord.diagnosis} icon="clipboard2-pulse" /><Detail label="Symptoms" value={selectedRecord.symptoms} icon="activity" /><Detail label="Medicines" value={selectedRecord.medicines} icon="capsule" /><Detail label="Dosage" value={selectedRecord.dosage} icon="clock-history" /><Detail label="Medical test" value={selectedRecord.medicalTest} icon="beaker" /><Detail label="Advice" value={selectedRecord.advice} icon="chat-square-text" /></div>}</div>
        </div></div>
      </div>
    </main>
  );
};

export default PatientMedicalHistory;
