import React, { useEffect, useState } from "react";
import { Briefcase, CalendarCheck, CalendarX, Clock, GraduationCap, IndianRupee } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import { toast } from "react-toastify";

const BookAppointment = () => {
  const [doctor, setDoctor] = useState({});
  const [slots, setSlots] = useState([]);
  const { docId } = useParams();
  const navigate = useNavigate();

  const formatDate = (slotDate) => {
    const date = new Date(slotDate);
    const day = date.toLocaleDateString("en-IN", { weekday: "long" });
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${day}, ${formattedDate}`;
  };

  const fetchDoctor = async () => {
    try {
      const response = await api.get(`/doctors/${docId}`);
      setDoctor(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllSlots = async (docId) => {
    try {
      const response = await api.get(`/slots/doctor/${docId}`);
      console.log(response.data);
      setSlots(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const bookAppointment = async (slotId) => {
    try {
      const response = await api.post(
        `/appointments/book-appointment/${slotId}`,
        toast.success("Appointment booked successfully. Waiting for doctor's approval."),
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    fetchDoctor();
    fetchAllSlots(docId);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-teal-700">Book Appointment</h2>
          <p className="mt-1 text-lg text-slate-500">Select your preferred appointment date and time.</p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="text-center">
              <div className="mx-auto h-52 w-52 overflow-hidden rounded-2xl bg-teal-50 shadow-sm">
                <img
                  src={`http://localhost:8080/doctors/get-image/${doctor.docId}`}
                  alt="Doctor"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-teal-700">{doctor.doctorName}</h3>
              <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                {doctor.specialization}
              </span>
              <hr className="my-5 border-slate-100" />
              <div className="space-y-3 text-left text-slate-700">
                <p className="flex items-start gap-2">
                  <GraduationCap size={18} className="mt-0.5 shrink-0 text-teal-700" />
                  <span>
                    <strong>Qualification:</strong>
                    <br />
                    {doctor.qualification}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Briefcase size={18} className="mt-0.5 shrink-0 text-teal-700" />
                  <span>
                    <strong>Experience:</strong>
                    <br />
                    {doctor.experience} Years
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <IndianRupee size={18} className="mt-0.5 shrink-0 text-teal-700" />
                  <span>
                    <strong>Consultation Fee:</strong>
                    <br />₹{doctor.consultationFee}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-teal-700">Available Appointment Slots</h4>
              <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <div
                      key={slot.slotId}
                      className="mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm last:mb-0"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h6 className="font-bold text-teal-700">{formatDate(slot.slotDate)}</h6>
                          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <Clock size={16} />
                            {slot.startTime} AM - {slot.endTime} AM
                          </p>
                        </div>
                        <button
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800"
                          onClick={() => bookAppointment(slot.slotId)}
                        >
                          <CalendarCheck size={16} />
                          Book
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <CalendarX size={64} className="mx-auto text-slate-400" />
                    <h4 className="mt-4 text-lg font-bold text-slate-500">No Appointment Slots Available</h4>
                    <p className="mt-1 text-slate-400">
                      The doctor hasn&apos;t added any appointment slots yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookAppointment;
