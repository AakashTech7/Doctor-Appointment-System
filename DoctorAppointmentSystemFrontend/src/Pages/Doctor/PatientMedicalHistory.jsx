import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ClipboardList, FileText, Loader2, Pill, Search, Stethoscope, TestTube2, X } from "lucide-react";
import { api } from "../../api";

const formatDate = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Date not recorded";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
};

const Detail = ({ icon, label, value }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">{React.createElement(icon, { size: 15 })}{label}</div>
    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{value || "Not recorded"}</p>
  </div>
);

const PatientMedicalHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recordLoading, setRecordLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const openRecord = async (appointmentId) => {
    setRecordLoading(true);
    setSelectedRecord({});
    try {
      const response = await api.get(`/medical-record/doctor/patient-record/${appointmentId}`);
      setSelectedRecord(response.data || {});
    } catch (requestError) {
      console.error("Could not load medical record:", requestError);
      setSelectedRecord({ error: "The full record could not be loaded." });
    } finally {
      setRecordLoading(false);
    }
  };

  useEffect(() => { fetchPatientRecords(); }, [patientId]);

  const visibleRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) => [record.diagnosis, record.symptoms, record.medicines, record.medicalTest]
      .filter(Boolean).some((value) => String(value).toLowerCase().includes(query)));
  }, [records, searchQuery]);

  return (
    <main className="min-h-screen bg-[#f4f7f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button onClick={() => navigate("/doctor/medical-records-of-distinct-patinet")} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"><ArrowLeft size={17} />Back to patients</button>

        <header className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-teal-700 px-6 py-8 text-white shadow-xl shadow-teal-950/15 sm:px-9 sm:py-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-white/10" />
          <div className="absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-teal-300/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-teal-100"><ClipboardList size={14} />Clinical workspace</div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Patient medical history</h1><p className="mt-3 text-sm leading-6 text-teal-50 sm:text-base">Review clinical notes, diagnoses, medicines, and recommended investigations in one secure view.</p></div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-teal-700"><FileText size={23} /></span><div><p className="text-2xl font-black leading-none">{records.length}</p><p className="mt-1 text-xs font-semibold text-teal-100">Clinical record{records.length === 1 ? "" : "s"}</p></div><span className="ml-2 border-l border-white/15 pl-4 text-xs text-teal-100">Patient ID<br /><strong className="text-sm text-white">#{patientId}</strong></span></div>
          </div>
        </header>

        {loading ? <section className="grid min-h-80 place-items-center rounded-3xl border border-slate-200 bg-white"><div className="text-center"><Loader2 className="mx-auto mb-3 animate-spin text-teal-700" size={30} /><p className="font-medium text-slate-500">Loading clinical history…</p></div></section>
          : error ? <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center"><h2 className="font-bold text-rose-800">Unable to load records</h2><p className="mt-1 text-sm text-rose-700">{error}</p><button onClick={fetchPatientRecords} className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm font-bold text-white">Try again</button></section>
          : records.length === 0 ? <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-700"><ClipboardList size={31} /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-teal-700">Clinical timeline</p><h2 className="mt-2 text-xl font-black text-slate-900">No medical records yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Consultation reports will appear here once they are created for this patient.</p></section>
          : <>
            <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="font-bold text-slate-900">Consultation records</h2><p className="mt-1 text-sm text-slate-500">{visibleRecords.length} of {records.length} records displayed</p></div>
              <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 sm:max-w-sm"><Search size={18} /><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search diagnosis, medicine, test…" className="h-11 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" /></label>
            </section>
            {visibleRecords.length === 0 ? <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><Search className="mx-auto text-slate-400" size={30} /><h2 className="mt-3 font-bold text-slate-800">No matching records</h2><p className="mt-1 text-sm text-slate-500">Try another diagnosis, medicine, symptom, or test.</p></section>
              : <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleRecords.map((record) => <article key={record.reportId} className="group flex min-h-72 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-950/10"><div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700"><Stethoscope size={19} /></span><div><h3 className="font-bold text-slate-900">Consultation report</h3><p className="mt-0.5 text-xs text-slate-500">Record #{record.reportId}</p></div></div><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"><CalendarDays size={12} />{formatDate(record.createdDate)}</span></div><div className="flex-1 space-y-4 px-5 py-5"><div><p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Diagnosis</p><p className="line-clamp-2 font-semibold leading-6 text-slate-800">{record.diagnosis || "Not recorded"}</p></div><div className="rounded-xl bg-slate-50 p-3"><div className="mb-1 flex items-center gap-2 text-xs font-bold text-teal-700"><TestTube2 size={15} />Recommended test</div><p className="line-clamp-2 text-sm leading-5 text-slate-600">{record.medicalTest || "No tests prescribed"}</p></div></div><div className="border-t border-slate-100 p-4"><button onClick={() => openRecord(record.appointmentId)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"><FileText size={16} />View full record</button></div></article>)}</section>}
          </>}
      </div>

      {selectedRecord !== null && <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label="Medical record details"><section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"><header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700">Clinical record</p><h2 className="mt-1 text-lg font-black text-slate-900">Consultation details</h2></div><button onClick={() => setSelectedRecord(null)} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Close"><X size={21} /></button></header>{recordLoading ? <div className="grid min-h-72 place-items-center"><Loader2 className="animate-spin text-teal-700" size={30} /></div> : selectedRecord.error ? <div className="p-7 text-rose-700">{selectedRecord.error}</div> : <div className="p-5 sm:p-7"><div className="mb-6 flex items-center gap-3 rounded-2xl bg-teal-50 p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-700 text-white"><ClipboardList size={21} /></span><div><p className="font-bold text-slate-900">{selectedRecord.patientName || `Patient #${patientId}`}</p><p className="text-sm text-slate-500">Created {formatDate(selectedRecord.createdDate)}</p></div></div><div className="grid gap-4 sm:grid-cols-2"><Detail icon={ClipboardList} label="Diagnosis" value={selectedRecord.diagnosis} /><Detail icon={Stethoscope} label="Symptoms" value={selectedRecord.symptoms} /><Detail icon={Pill} label="Medicines" value={selectedRecord.medicines} /><Detail icon={CalendarDays} label="Dosage" value={selectedRecord.dosage} /><Detail icon={TestTube2} label="Medical test" value={selectedRecord.medicalTest} /><Detail icon={FileText} label="Advice" value={selectedRecord.advice} /></div></div>}</section></div>}
    </main>
  );
};

export default PatientMedicalHistory;
