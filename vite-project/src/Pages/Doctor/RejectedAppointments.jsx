import React, { useEffect, useState } from "react";
import { api } from "../../api";

const RejectedAppointments = () => {
  const [rejectedAppointments, setRejectedAppointments] = useState([]);

  const fetchRejectedAppointments = async () => {
    try {
      const response = await api.get("/appointments/rejected-appointments");
      console.log(response.data);
      setRejectedAppointments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (appointmentDate) => {
    const date = new Date(appointmentDate);
    console.log(date);
    console.log(date.toDateString());
    const day = date.toLocaleDateString("en-IN", {
      weekday: "long",
    });
    console.log(day);
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    console.log(formattedDate);
    return `${day}, ${formattedDate}`;
  };

  useEffect(() => {
    fetchRejectedAppointments();
  }, []);

  return (
    <>
      {rejectedAppointments.length > 0 ? (
        <div className="container-fluid py-4">
          <div className="card border-0 shadow-lg">
            <div
              className="card-header text-white d-flex justify-content-between align-items-center"
              style={{
                background: "#dc3545",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            >
              <h3 className="mb-0">
                <i className="bi bi-x-octagon-fill me-2"></i>
                Rejected Appointments
              </h3>

              <span className="badge bg-light text-danger fs-6">
                Total: {rejectedAppointments.length}
              </span>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead
                    style={{
                      background: "#fff5f5",
                    }}
                  >
                    <tr>
                      <th className="text-center">Patient ID</th>
                      <th className="text-center">Patient Name</th>
                      <th className="text-center">Age</th>
                      <th className="text-center">Gender</th>
                      <th className="text-center">Appointment Date</th>
                      <th className="text-center">Appointment Time</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rejectedAppointments.map((r) => {
                      return (
                        <tr key={r.patientId}>
                          <td className="text-center">{r.patientId}</td>

                          <td className="text-center">
                            <div className="fw-semibold">{r.patientName}</div>
                          </td>

                          <td className="text-center">{r.age}</td>

                          <td className="text-center">{r.gender}</td>

                          <td className="text-center">
                            {formatDate(r.appointmentDate)}
                          </td>

                          <td className="text-center">{r.appointmentTime}</td>

                          <td className="text-center">
                            <span className="badge bg-danger px-3 py-2">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <i
            className="bi bi-x-octagon"
            style={{
              fontSize: "4rem",
              color: "#dc3545",
            }}
          ></i>

          <h4 className="mt-3 text-muted">No Rejected Appointments</h4>

          <p className="text-secondary mb-0">
            Rejected appointment requests will appear here.
          </p>
        </div>
      )}
    </>
  );
};

export default RejectedAppointments;
