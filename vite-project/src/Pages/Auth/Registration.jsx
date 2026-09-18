import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Hospital, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { api } from "../../api";
import { toast } from "react-toastify";

const fieldClass = (invalid) =>
  `w-full rounded-r-xl border ${invalid ? "border-red-400" : "border-slate-200"} bg-white px-3 py-3 outline-none focus:border-blue-500`;

const Registration = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/users/register", data);
      toast.success("Registration done successfully");
      const userId = response.data.id;
      if (data.role === "ROLE_Patient") navigate(`/patient-profile/${userId}`);
      if (data.role === "ROLE_Doctor") navigate(`/doctor-profile/${userId}`);
    } catch (error) {
      toast.error("Oops! Something went wrong...");
    }
  };

  const checkEmail = async (value) => {
    try {
      const response = await api.get(`/users/check-email?email=${value}`);
      return response.data ? "Email already exists" : true;
    } catch (error) {
      return true;
    }
  };

  const password = watch("password");

  return (
    <main className="flex min-h-screen items-center bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex min-h-[720px] flex-col justify-between bg-blue-600 p-8 text-white">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-blue-600">
                  <Hospital size={16} />
                  <span className="font-bold">Doctor Appointment</span>
                </div>
                <h1 className="text-4xl font-extrabold">Create Account</h1>
                <p className="mt-4 text-lg text-blue-100">
                  Join our healthcare platform to book appointments, consult doctors, manage profiles and access medical services securely.
                </p>
              </div>
              <p className="text-sm text-blue-100">Trusted by Patients & Doctors</p>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-extrabold">Create Your Account</h2>
              <p className="mt-2 text-slate-500">Fill in the information below to get started.</p>
              <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <label className="block">
                  <span className="mb-2 block font-semibold">Full Name</span>
                  <div className="flex">
                    <span className="grid place-items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-400"><User size={18} /></span>
                    <input className={fieldClass(errors.name)} placeholder="Enter your full name" {...register("name", { required: "name is required", minLength: { value: 2, message: "full name must be at least 2 character" }, maxLength: { value: 60, message: "maximum 60 characters allow" } })} />
                  </div>
                  {errors.name && <small className="text-red-600">{errors.name.message}</small>}
                </label>

                <label className="block">
                  <span className="mb-2 block font-semibold">Email Address</span>
                  <div className="flex">
                    <span className="grid place-items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-400"><Mail size={18} /></span>
                    <input type="email" className={fieldClass(errors.email)} placeholder="Enter your email" {...register("email", { required: "email is required", pattern: { value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, message: "Please enter a valid email address" }, validate: { checkEmail } })} />
                  </div>
                  {errors.email && <small className="text-red-600">{errors.email.message}</small>}
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-semibold">Password</span>
                    <div className="flex">
                      <span className="grid place-items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-400"><Lock size={18} /></span>
                      <input type="password" className={fieldClass(errors.password)} placeholder="Create password" {...register("password", { required: "password is required", pattern: { value: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/, message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" } })} />
                    </div>
                    {errors.password && <small className="text-red-600">{errors.password.message}</small>}
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-semibold">Confirm Password</span>
                    <div className="flex">
                      <span className="grid place-items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-400"><Lock size={18} /></span>
                      <input type="password" className={fieldClass(errors.confirmPassword)} placeholder="Confirm password" {...register("confirmPassword", { required: "confirm password is required", validate: (value) => value === password || "password and confirm password is not matching" })} />
                    </div>
                    {errors.confirmPassword && <small className="text-red-600">{errors.confirmPassword.message}</small>}
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block font-semibold">Phone Number</span>
                  <div className="flex">
                    <span className="grid place-items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-400"><Phone size={18} /></span>
                    <input type="tel" className={fieldClass(errors.phNo)} placeholder="Enter your phone number" {...register("phNo", { required: "provide a phone number", minLength: { value: 10, message: "number cannot be less than 10 digit" }, maxLength: { value: 10, message: "number cannot exceeds after 10 digit" } })} />
                  </div>
                  {errors.phNo && <small className="text-red-600">{errors.phNo.message}</small>}
                </label>

                <label className="block">
                  <span className="mb-2 block font-semibold">Select Role</span>
                  <div className="flex">
                    <span className="grid place-items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-400"><UserPlus size={18} /></span>
                    <select className={fieldClass(errors.role)} {...register("role", { required: "Please select your role" })}>
                      <option value="">Choose your role</option>
                      <option value="ROLE_Patient">Patient</option>
                      <option value="ROLE_Doctor">Doctor</option>
                    </select>
                  </div>
                  {errors.role && <small className="text-red-600">{errors.role.message}</small>}
                </label>

                <button type="submit" className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">
                  Create Account
                </button>
                <p className="text-center text-slate-500">
                  Already have an account? <Link to="/login" className="font-bold text-blue-600">Login Here</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Registration;
