import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CircleDollarSign,
  ClipboardList,
  LogOut,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { api } from "../../api";
import { LoginContext } from "../../Context/LoginContext";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pendingStatusCount, setPendingStatusCount] = useState(0);
  const { user, logout } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      const [doctorResult, patientResult, appointmentResult] = await Promise.allSettled([
        api.get("/doctors"),
        api.get("/patient/all-patients"),
        api.get("/appointments/count-of-pending-status"),
      ]);

      if (doctorResult.status === "fulfilled") setDoctors(doctorResult.value.data || []);
      if (patientResult.status === "fulfilled") setPatients(patientResult.value.data || []);
      if (appointmentResult.status === "fulfilled") setPendingStatusCount(appointmentResult.value.data || 0);
    };

    loadDashboard();
  }, []);

  const adminName = user?.name?.split(" ")[0] || "Admin";
  const stats = [
    { label: "Total doctors", value: doctors.length, detail: "Active care providers", icon: Stethoscope, tone: "bg-teal-50 text-teal-700" },
    { label: "Registered patients", value: patients.length, detail: "Patient records on file", icon: UsersRound, tone: "bg-sky-50 text-sky-700" },
    { label: "Pending appointments", value: pendingStatusCount, detail: "Require clinical action", icon: CalendarClock, tone: "bg-amber-50 text-amber-700" },
    { label: "Platform status", value: "Live", detail: "Systems operating normally", icon: Activity, tone: "bg-emerald-50 text-emerald-700" },
  ];

  const actions = [
    { title: "Manage doctors", description: "Review providers and credentials", icon: Stethoscope, tone: "bg-teal-50 text-teal-700", path: "/admin/manage-doctors" },
    { title: "Patient directory", description: "Access registered patient records", icon: UsersRound, tone: "bg-sky-50 text-sky-700", path: "/admin/manage-patients" },
    { title: "Appointments", description: "Monitor scheduling and statuses", icon: ClipboardList, tone: "bg-amber-50 text-amber-700", path: "/admin/monitor-appointments" },
    { title: "Payment reports", description: "Review completed transactions", icon: CircleDollarSign, tone: "bg-violet-50 text-violet-700", path: "/admin/all-payment-status" },
  ];

  return (
    <main className="min-h-screen bg-[#f5f8fa] py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 px-6 py-8 text-white shadow-xl shadow-slate-900/15 sm:px-8 sm:py-10">
          <div className="absolute -right-14 -top-16 h-56 w-56 rounded-full border-[28px] border-white/10" />
          <div className="absolute bottom-0 right-28 h-24 w-24 translate-y-1/2 rounded-full bg-teal-400/20" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-100">
                <ShieldCheck size={15} /> Administration centre
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome back, {adminName}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Stay on top of your hospital operations, people, scheduling, and payments from one clear workspace.</p>
            </div>
            <button
              onClick={() => { logout?.(); navigate("/"); }}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 md:self-auto"
            >
              <LogOut size={17} /> Sign out
            </button>
          </div>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Hospital overview">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                  </div>
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${stat.tone}`}><Icon size={21} /></span>
                </div>
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-400">{stat.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-9">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">Operations</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Manage your hospital</h2>
            </div>
            <p className="text-sm text-slate-500">Choose an area to continue</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5 focus:outline-none focus:ring-4 focus:ring-teal-50"
                >
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${action.tone}`}><Icon size={21} /></span>
                  <h3 className="mt-5 font-extrabold text-slate-900">{action.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{action.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-teal-700">Open section <ArrowRight className="transition group-hover:translate-x-0.5" size={16} /></span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
