import React, { useEffect } from "react";
import { Check, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { api } from "../../api";
import { toast } from "react-toastify";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

const UpdatePatientProfile = () => {
  const { register, handleSubmit, reset } = useForm();

  const fetchPatientDetails = async () => {
    try {
      const response = await api.get(`/patient`);
      console.log(response.data);
      reset({
        dateOfBirth: response.data.dateOfBirth,
        gender: response.data.gender,
        bloodGroup: response.data.bloodGroup,
        address: response.data.address,
        city: response.data.city,
        state: response.data.state,
        pincode: response.data.pincode,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updatePatient = async (data) => {
    try {
      const response = await api.put(`/patient/update-patient`, data);
      console.log(response.data);
      toast.success("Profile updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-4 text-center text-white">
            <h3 className="flex items-center justify-center gap-2 text-xl font-bold">
              <User size={22} />
              Update Patient Profile
            </h3>
          </div>

          <form className="space-y-5 p-6" onSubmit={handleSubmit(updatePatient)}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Date of Birth</span>
                <input type="date" className={inputClass} {...register("dateOfBirth")} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Gender</span>
                <select className={inputClass} {...register("gender")}>
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block sm:col-span-2 sm:max-w-xs">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Blood Group</span>
                <select className={inputClass} {...register("bloodGroup")}>
                  <option>Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Address</span>
              <textarea rows={3} className={inputClass} placeholder="Enter Address" {...register("address")} />
            </label>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">City</span>
                <input type="text" className={inputClass} placeholder="Enter City" {...register("city")} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">State</span>
                <input type="text" className={inputClass} placeholder="Enter State" {...register("state")} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Pincode</span>
                <input type="text" className={inputClass} placeholder="Enter Pincode" {...register("pincode")} />
              </label>
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-8 py-3 text-lg font-semibold text-white hover:bg-teal-800"
              >
                <Check size={18} />
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdatePatientProfile;
