import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { LoginContext } from "../../Context/LoginContext";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Clock3,
  CreditCard,
  FileText,
  Search,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";

const formatDate = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Not scheduled";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [lastConsultationDate, setLastConsultationDate] = useState(null);
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    const loadDashboard = async () => {
      const [next, summary, lastVisit] = await Promise.allSettled([
        api.get("/appointments/patient-next-appointment"),
        api.get("/appointments/patient/dashboard-cards"),
        api.get("/appointments/last-consultation-date"),
      ]);

      if (next.status === "fulfilled" && next.value.data?.appointmentDate) setNextAppointment(next.value.data);
      if (summary.status === "fulfilled") setDashboard(summary.value.data || {});
      if (lastVisit.status === "fulfilled" && lastVisit.value.data) setLastConsultationDate(lastVisit.value.data);
    };
    loadDashboard();
  }, []);

  const patientName = user?.name?.split(" ")[0] || "there";
  const actions = [
    { icon: Search, title: "Find a doctor", text: "Browse specialists", onClick: () => navigate("/patient/doctors") },
    { icon: CalendarDays, title: "Appointments", text: "View your bookings", onClick: () => navigate("/patient/my-appointments") },
    { icon: FileText, title: "Medical records", text: "View prescriptions", onClick: () => navigate("/view-medical-report") },
    { icon: CreditCard, title: "Payments", text: "Pay consultation fees", onClick: () => navigate(`/patient/make-payment/${user?.patient?.patientId || ""}`) },
  ];

  return (
    <main className="mx-auto max-w-7xl pb-6 text-slate-800">
      <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">Patient portal</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Good day, {patientName}</h1>
          <p className="mt-1 text-slate-500">Everything you need to manage your care, in one place.</p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-bold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100"
          onClick={() => navigate("/patient/doctors")}
        >
          <CalendarPlus size={18} /> Book appointment
        </button>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-700 to-cyan-800 p-6 text-white shadow-xl shadow-teal-900/15 sm:p-7">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[22px] border-white/10" />
          <div className="absolute -bottom-20 right-24 h-36 w-36 rounded-full bg-cyan-300/10" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15">
              <Stethoscope size={22} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-100">Next appointment</p>
              <h2 className="text-xl font-bold">{nextAppointment ? `Dr. ${nextAppointment.doctorName}` : "No appointment scheduled"}</h2>
            </div>
          </div>
          {nextAppointment ? (
            <div className="relative mt-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CalendarDays size={17} />
                <span>
                  <small className="block text-xs uppercase text-teal-100">Date</small>
                  {formatDate(nextAppointment.appointmentDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 size={17} />
                <span>
                  <small className="block text-xs uppercase text-teal-100">Time</small>
                  {nextAppointment.appointmentTime}
                </span>
              </div>
            </div>
          ) : (
            <p className="relative mt-6 max-w-md text-sm text-teal-100">Choose a specialist and book a consultation when you are ready.</p>
          )}
          <button
            className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-bold text-teal-800 transition hover:bg-teal-50"
            onClick={() => navigate(nextAppointment ? "/patient/my-appointments" : "/patient/doctors")}
          >
            {nextAppointment ? "View appointment" : "Find a doctor"} <ArrowRight size={17} />
          </button>
        </article>

        <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-extrabold text-slate-800">Your health summary</p>
              <span className="text-sm text-slate-400">Personal activity overview</span>
            </div>
            <UserRound className="text-teal-700" size={21} />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { icon: CalendarDays, value: dashboard?.totalAppointments || 0, label: "Appointments" },
              { icon: Users, value: dashboard?.doctorsConsulted || 0, label: "Doctors consulted" },
              { icon: Clock3, value: lastConsultationDate ? formatDate(lastConsultationDate.appointmentDate) : "—", label: "Last visit" },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="flex items-center gap-3 border-t border-slate-100 pt-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-50 text-teal-700">
                    <Icon size={18} />
                  </span>
                  <div>
                    <strong className="block text-slate-800">{metric.value}</strong>
                    <small className="text-slate-400">{metric.label}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mt-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">Quick actions</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Manage your care</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5 focus:outline-none focus:ring-4 focus:ring-teal-50"
                onClick={action.onClick}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon size={20} />
                </span>
                <span className="flex-1">
                  <strong className="block">{action.title}</strong>
                  <small className="text-slate-400">{action.text}</small>
                </span>
                <ArrowRight size={18} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700" />
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default PatientDashboard;
