import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { CalendarCheck, Hospital, Lock, Mail, Shield } from "lucide-react";
import { LoginContext } from "../../Context/LoginContext";
import { api } from "../../api";
import { toast } from "react-toastify";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      const role = response.data.userDto.role;
      const status = response.data.userDto.doctor?.status;

      if (role === "ROLE_Patient") {
        navigate(`/patient-dashboard`);
      } else if (role === "ROLE_Admin") {
        navigate("/admin-dashboard");
      } else if (role === "ROLE_Doctor" && status === "Approved") {
        navigate("/doctor-dashboard");
      } else {
        toast.error("Your profile is awaiting admin approval.");
        navigate("/");
      }

      login(response.data.token, response.data.userDto);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen items-center bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex min-h-[620px] flex-col justify-between bg-blue-600 p-8 text-white">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-blue-600 shadow-sm">
                  <Hospital size={16} />
                  <span className="font-bold">CAREPOINT</span>
                </div>
                <h1 className="text-4xl font-extrabold">Welcome Back!</h1>
                <p className="mt-4 text-lg text-blue-100">
                  Sign in to manage appointments, consult doctors, access your health records, and continue your healthcare journey securely.
                </p>
                <div className="mt-8 space-y-3">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <h6 className="mb-1 flex items-center gap-2 font-bold">
                      <CalendarCheck size={16} /> Easy Appointment Booking
                    </h6>
                    <p className="text-sm text-blue-100">Book appointments anytime with trusted doctors.</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <h6 className="mb-1 flex items-center gap-2 font-bold">
                      <Shield size={16} /> Secure Healthcare Portal
                    </h6>
                    <p className="text-sm text-blue-100">Your medical information stays safe and protected.</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-blue-100">Fast • Secure • Reliable Healthcare Services</p>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-extrabold text-slate-900">Sign In</h2>
              <p className="mt-2 text-slate-500">Enter your credentials to access your account.</p>
              <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <label className="block">
                  <span className="mb-2 block font-semibold text-slate-700">Email Address</span>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                    <span className="px-3 text-slate-400"><Mail size={18} /></span>
                    <input type="email" className="w-full bg-transparent px-2 py-3 outline-none" placeholder="Enter your email" {...register("email")} />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block font-semibold text-slate-700">Password</span>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                    <span className="px-3 text-slate-400"><Lock size={18} /></span>
                    <input type="password" className="w-full bg-transparent px-2 py-3 outline-none" placeholder="Enter your password" {...register("password")} />
                  </div>
                </label>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm font-semibold text-blue-600">Forgot Password?</a>
                </div>
                <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow hover:bg-blue-700">
                  Sign In
                </button>
                <p className="text-center text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link to="/registration" className="font-bold text-teal-700">Create Account</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
