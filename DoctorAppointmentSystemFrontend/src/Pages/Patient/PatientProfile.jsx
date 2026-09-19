import React from "react";
import {
  Building2,
  Calendar,
  Check,
  Droplet,
  HeartPulse,
  IdCard,
  Map,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { api } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

const PatientProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post(`/patient/register/${userId}`, data);
      console.log(response.data.patientId);
      toast.success("Congrates!, Your Profile is completed.");
      navigate("/patient-dashboard");
    } catch (error) {
      toast.error("Oops!, Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex min-h-[760px] flex-col justify-between bg-gradient-to-br from-teal-700 to-teal-500 p-8 text-white">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-teal-700 shadow-sm">
                  <IdCard size={16} />
                  <span className="font-bold">Patient Profile</span>
                </div>
                <h2 className="text-3xl font-extrabold">Complete Your Profile</h2>
                <p className="mt-3 text-lg text-teal-100">
                  Your profile helps doctors understand your health details and provide better treatment.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <h6 className="flex items-center gap-2 font-bold">
                      <HeartPulse size={16} /> Better Healthcare
                    </h6>
                    <small className="text-teal-100">Complete medical information improves consultation.</small>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <h6 className="flex items-center gap-2 font-bold">
                      <Shield size={16} /> Secure Information
                    </h6>
                    <small className="text-teal-100">Your profile is completely secure and private.</small>
                  </div>
                </div>
              </div>
              <div>
                <hr className="border-white/20" />
                <p className="mt-4 font-semibold">Healthcare made simple.</p>
                <small className="text-teal-100">Trusted by thousands of patients.</small>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900">Patient Information</h2>
                <p className="text-slate-500">Please fill all required details carefully.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-slate-700">Date of Birth</span>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                      <span className="px-3 text-slate-400">
                        <Calendar size={18} />
                      </span>
                      <input
                        type="date"
                        className={`w-full bg-transparent px-2 py-3 outline-none ${errors.dateOfBirth ? "text-red-600" : ""}`}
                        {...register("dateOfBirth", { required: "fill DOB" })}
                      />
                    </div>
                    {errors.dateOfBirth && (
                      <small className="text-red-600">{errors.dateOfBirth.message}</small>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-slate-700">Gender</span>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                      <span className="px-3 text-slate-400">
                        <Users size={18} />
                      </span>
                      <select
                        className="w-full bg-transparent px-2 py-3 outline-none"
                        {...register("gender", { required: "select gender" })}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.gender && <small className="text-red-600">{errors.gender.message}</small>}
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-slate-700">Blood Group</span>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                      <span className="px-3 text-slate-400">
                        <Droplet size={18} />
                      </span>
                      <select className="w-full bg-transparent px-2 py-3 outline-none" {...register("bloodGroup")}>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">Address</span>
                  <div className="flex items-start rounded-xl border border-slate-200 bg-slate-50">
                    <span className="px-3 pt-3 text-slate-400">
                      <MapPin size={18} />
                    </span>
                    <textarea
                      className="w-full bg-transparent px-2 py-3 outline-none"
                      rows={5}
                      placeholder="Enter your complete address"
                      {...register("address", { required: "Please fill the address" })}
                    />
                  </div>
                  {errors.address && <small className="text-red-600">{errors.address.message}</small>}
                </label>

                <div className="grid gap-5 sm:grid-cols-3">
                  {[
                    { label: "City", icon: Building2, name: "city", placeholder: "Enter City" },
                    { label: "State", icon: Map, name: "state", placeholder: "Enter State" },
                    { label: "Pincode", icon: MapPin, name: "pincode", placeholder: "Enter Pincode" },
                  ].map((field) => {
                    const Icon = field.icon;
                    return (
                      <label key={field.name} className="block">
                        <span className="mb-1 block text-sm font-semibold text-slate-700">{field.label}</span>
                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                          <span className="px-3 text-slate-400">
                            <Icon size={18} />
                          </span>
                          <input
                            type="text"
                            className="w-full bg-transparent px-2 py-3 outline-none"
                            placeholder={field.placeholder}
                            {...register(field.name)}
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3.5 font-bold text-white shadow hover:bg-teal-800"
                >
                  <Check size={18} />
                  Complete Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PatientProfile;
