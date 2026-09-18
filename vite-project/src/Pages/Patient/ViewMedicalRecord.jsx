import React, { useContext, useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { api } from "../../api";
import { LoginContext } from "../../Context/LoginContext";
import Modal from "../../Components/UI/Modal";

const ViewMedicalRecord = () => {
  const [medicalRecord, setMedicalRecord] = useState([]);
  const [patientRecord, setPatientRecord] = useState({});
  const [searchDoctor, setSearchDoctor] = useState("");
  const [filteredDoctor, setFilteredDoctor] = useState([]);
  const [showRecord, setShowRecord] = useState(false);

  const { user } = useContext(LoginContext);

  const fetchMedicalRecord = async () => {
    try {
      const response = await api.get(`/medical-record/all-records/${user.patient?.patientId}`);
      console.log(response.data);
      setMedicalRecord(response.data);
      setFilteredDoctor(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPatientRecord = async (appointmentId) => {
    try {
      const response = await api.get(`/medical-record/patient/${appointmentId}`);
      console.log(response.data);
      setPatientRecord(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    const day = date.toLocaleDateString("en-IN", { weekday: "long" });
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${day}, ${formattedDate}`;
  };

  const searchedDoctor = (doctorName) => {
    const filteredRecord = medicalRecord.filter((record) =>
      record.doctorName.toLowerCase().includes(doctorName.toLowerCase()),
    );
    setFilteredDoctor(filteredRecord);
  };

  const openRecord = (appointmentId) => {
    fetchPatientRecord(appointmentId);
    setShowRecord(true);
  };

  useEffect(() => {
    fetchMedicalRecord();
  }, []);

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-teal-700">My Medical Records</h2>
          <p className="mt-1 text-slate-500">View all your previous medical reports.</p>
        </header>

        <div className="mx-auto mb-8 max-w-xl">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className={`${inputClass} pl-11`}
              placeholder="Search By Doctor..."
              value={searchDoctor}
              onChange={(e) => {
                setSearchDoctor(e.target.value);
                searchedDoctor(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDoctor.map((r) => (
            <article
              key={r.reportId}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex-1 p-5">
                <h5 className="font-bold text-teal-700">Report #{r.reportId}</h5>
                <hr className="my-3 border-slate-100" />
                <p className="mb-2 text-sm">
                  <strong className="text-slate-700">Doctor</strong>
                  <br />
                  Dr. {r.doctorName}
                </p>
                <p className="mb-2 text-sm">
                  <strong className="text-slate-700">Diagnosis</strong>
                  <br />
                  {r.diagnosis}
                </p>
                <p className="mb-2 text-sm">
                  <strong className="text-slate-700">Medical Test</strong>
                  <br />
                  {r.medicalTest}
                </p>
                <p className="mb-0 text-sm">
                  <strong className="text-slate-700">Date</strong>
                  <br />
                  {formatDate(r.createdDate)}
                </p>
              </div>
              <div className="border-t border-slate-100 p-4">
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800"
                  onClick={() => openRecord(r.appointmentId)}
                >
                  <Eye size={16} />
                  View Record
                </button>
              </div>
            </article>
          ))}
        </div>

        <Modal open={showRecord} onClose={() => setShowRecord(false)} title="Medical Record" wide>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Doctor</span>
              <input className={inputClass} value={patientRecord.doctorName || ""} readOnly />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Date</span>
              <input
                className={inputClass}
                value={patientRecord.createdDate ? formatDate(patientRecord.createdDate) : ""}
                readOnly
              />
            </label>
          </div>
          {[
            { label: "Diagnosis", key: "diagnosis", rows: 2 },
            { label: "Symptoms", key: "symptoms", rows: 3 },
            { label: "Medicines", key: "medicines", rows: 3 },
            { label: "Dosage", key: "dosage", rows: 3 },
            { label: "Advice", key: "advice", rows: 3 },
          ].map((field) => (
            <label key={field.key} className="mt-4 block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">{field.label}</span>
              <textarea
                className={inputClass}
                rows={field.rows}
                value={patientRecord[field.key] || ""}
                readOnly
              />
            </label>
          ))}
          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Medical Test</span>
            <input className={inputClass} value={patientRecord.medicalTest || ""} readOnly />
          </label>
        </Modal>
      </div>
    </main>
  );
};

export default ViewMedicalRecord;
