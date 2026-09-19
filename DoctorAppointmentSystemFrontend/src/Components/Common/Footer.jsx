import React from "react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Specialties", to: "/#specialties" },
  { label: "How It Works", to: "/#process" },
  { label: "Register", to: "/registration" },
];

const supportLinks = [
  { label: "Book Appointment", to: "/registration" },
  { label: "Patient Login", to: "/login" },
  { label: "Emergency Support", to: "/" },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-teal-900 to-teal-800 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 pb-8 lg:grid-cols-[1.2fr_0.6fr_0.8fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100">
              Trusted Healthcare Access
            </span>
            <h2 className="mt-3 text-2xl font-extrabold">CAREPOINT</h2>
            <p className="mt-3 text-slate-200">
              Find specialists, schedule visits, and stay connected with care that feels simple, safe, and fast.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["24/7 Booking", "Verified Doctors", "Quick Support"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-slate-900/30 px-3 py-1 text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.to} className="text-slate-200 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-semibold">Email</p>
            <a href="mailto:care@doctorappointment.com" className="text-slate-200 hover:text-white">
              care@doctorappointment.com
            </a>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Stay Updated</h3>
            <p className="mb-3 text-slate-200">Get appointment tips, service updates, and health reminders in your inbox.</p>
            <form className="flex flex-col gap-2" onSubmit={(event) => event.preventDefault()}>
              <input
                type="email"
                className="rounded-xl border border-white/20 bg-white px-4 py-2.5 text-slate-800 outline-none"
                placeholder="Enter your email"
                aria-label="Email address"
              />
              <button type="button" className="rounded-xl bg-teal-500 px-4 py-2.5 font-bold text-white hover:bg-teal-400">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>© 2026 Doctor Appointment. Seamless care for every patient.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white">Privacy</a>
            <a href="/" className="hover:text-white">Terms</a>
            <a href="/" className="hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
