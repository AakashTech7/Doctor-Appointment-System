import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock3, ShieldCheck, Stethoscope } from "lucide-react";

const highlights = [
  { value: "50+", label: "Specialist doctors available" },
  { value: "24/7", label: "Appointment support and guidance" },
  { value: "10k+", label: "Patients served with care" },
];

const specialties = [
  {
    title: "General Medicine",
    description: "Quick consultations for fever, fatigue, infections, and regular health concerns.",
  },
  {
    title: "Cardiology",
    description: "Heart care with experienced specialists for early diagnosis and ongoing treatment.",
  },
  {
    title: "Pediatrics",
    description: "Child-friendly care for routine checkups, vaccinations, and illness management.",
  },
  {
    title: "Dermatology",
    description: "Skin, hair, and allergy consultations with personalized treatment plans.",
  },
];

const steps = [
  { number: "01", title: "Create your profile", description: "Register once and save your basic details for faster future bookings." },
  { number: "02", title: "Choose a doctor", description: "Browse specialties and connect with the right doctor for your needs." },
  { number: "03", title: "Book your slot", description: "Select a convenient time and manage appointments without waiting in queues." },
];

const benefits = [
  "Simple booking experience for patients of all ages",
  "Verified doctors and trusted medical support",
  "Faster appointments with better schedule management",
  "One place for consultation planning and follow-ups",
];

const Home = () => {
  return (
    <main className="bg-slate-50 text-slate-800">
      <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-teal-700">
            Smart healthcare, simpler appointments
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Book trusted doctors in minutes and care for your family with confidence.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            CAREPOINT helps patients discover specialists, reserve consultation slots, and avoid long waiting lines with a smoother digital experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/registration" className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800">
              Book Appointment <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              Login
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-2xl font-extrabold text-teal-700">{item.value}</h2>
                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <img src="/Images/doctor3.jpg" alt="Doctor consulting with patient" className="h-[420px] w-full object-cover" />
          </div>
          <div className="absolute left-4 top-6 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Available today</p>
            <p className="font-bold text-slate-800">12 consultation slots open</p>
          </div>
          <div className="absolute bottom-6 right-4 max-w-xs rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-lg">
            <p className="font-bold">Patient-first booking</p>
            <p className="mt-1 text-sm text-slate-300">Fast access to specialists with a calm, reliable experience.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-teal-700">Why choose us</span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Designed to make healthcare access easier</h2>
          <p className="mt-3 text-slate-600">From first-time registration to confirmed appointments, every step is built to reduce stress and save time.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { img: "/Images/Online appointment booking icon.png", title: "Easy online booking", text: "Schedule appointments quickly with a simple and guided booking process." },
            { img: "/Images/Confident team of medical professionals.png", title: "Expert medical support", text: "Find qualified doctors across important specialties for better care decisions." },
            { img: "/Images/Time management essentials icon.png", title: "Save valuable time", text: "Avoid crowded waiting rooms and manage consultations around your daily schedule." },
          ].map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <img src={feature.img} alt={feature.title} className="mx-auto h-24 w-24 object-contain" />
              <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="specialties" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-wide text-teal-700">Specialties</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Connect with the right doctor for every need</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.map((specialty) => (
              <article key={specialty.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <Stethoscope className="text-teal-700" size={22} />
                <h3 className="mt-3 text-lg font-bold">{specialty.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{specialty.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <img src="/Images/doctor5.jpg" alt="Doctor smiling in clinic" className="h-[420px] w-full rounded-3xl object-cover shadow-lg" />
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-teal-700">How it works</span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Get your appointment confirmed in three clear steps</h2>
          <div className="mt-6 space-y-4">
            {steps.map((step) => (
              <article key={step.number} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 font-extrabold text-teal-700">{step.number}</span>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <span className="text-sm font-bold uppercase tracking-wide text-teal-700">Patient trust</span>
          <h2 className="mt-2 text-3xl font-extrabold">Built for convenience, backed by care</h2>
          <p className="mt-3 text-slate-600">The homepage experience is focused on clarity, trust, and action so patients can move from searching to booking without confusion.</p>
          <div className="mt-6 space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-teal-50 text-teal-700">
                  <Check size={14} />
                </span>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-teal-800 to-teal-600 p-8 text-white shadow-lg">
          <Clock3 className="mb-4" />
          <h3 className="text-2xl font-bold">Care you can organize</h3>
          <p className="mt-3 text-teal-100">Keep doctor discovery, patient onboarding, and appointment planning in one place.</p>
          <Link to="/registration" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-teal-800">
            Create Account <ShieldCheck size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
