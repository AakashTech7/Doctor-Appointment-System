import React, { useContext, useEffect, useState } from "react";
import { CalendarX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { LoginContext } from "../../Context/LoginContext";

const statusBadge = (status) => {
  const map = {
    Pending: "bg-yellow-100 text-yellow-700",
    Booked: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Cancelled: "bg-slate-100 text-slate-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
};

const MyAllAppointments = () => {
  const [patientAppointments, setPatientAppointments] = useState([]);
  const { user } = useContext(LoginContext);
  const navigate = useNavigate();

  const getAllAppointmentsOfPatient = async () => {
    try {
      const response = await api.get(`/appointments/patient/${user?.patient.patientId}`);
      console.log(response.data);
      setPatientAppointments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAppointmentsOfPatient();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-teal-700">My Appointments</h2>
          <p className="mt-1 text-lg text-slate-500">View and manage all your booked appointments.</p>
        </header>

        {patientAppointments.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h4 className="font-bold text-teal-700">Appointment History</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Doctor</th>
                    <th className="px-4 py-3 font-semibold">Specialization</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Time</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientAppointments.map((appointment) => (
                    <tr key={appointment.appointmentId}>
                      <td className="px-5 py-4 font-bold text-slate-800">{appointment.doctorName}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {appointment.specialization}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700">{appointment.appointmentDate}</td>
                      <td className="px-4 py-4 text-slate-700">{appointment.appointmentTime}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(appointment.status)}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {appointment.status === "Pending" ? (
                          <button className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                            Cancel
                          </button>
                        ) : (
                          <button
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-400"
                            disabled
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {appointment.status === "Rejected" ? (
                          <span className="text-slate-400">N/A</span>
                        ) : appointment.paymentStatus === "Paid" ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Paid
                          </span>
                        ) : (
                          <button
                            className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 hover:bg-yellow-200"
                            onClick={() =>
                              navigate(`/patient/make-payment/${user?.patient.patientId}`)
                            }
                          >
                            Pending
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <CalendarX size={64} className="mx-auto text-slate-400" />
            <h4 className="mt-4 text-xl font-bold text-slate-500">No Appointments Found</h4>
            <p className="mt-2 text-slate-400">
              You haven&apos;t booked any appointments yet.
              <br />
              Book an appointment to view it here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyAllAppointments;
