import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TodaySchedule = () => {
  const [todaySchedule, setTodaySchedule] = useState([]);
  const navigate = useNavigate();

  const fetchTodaysSchedule = async () => {
    try {
      const response = await api.get("/appointments/today-schedule");
      setTodaySchedule(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (appointmentDate) => {
    const date = new Date(appointmentDate);
    const day = date.toLocaleDateString("en-IN", {
      weekday: "long",
    });
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${day}, ${formattedDate}`;
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const response = await api.put(`/appointments/complete/${appointmentId}`);
      console.log(response.data);
      toast.success("Appointment is Completed");
      fetchTodaysSchedule();
      navigate("/doctor-dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodaysSchedule();
  }, []);

  return (
    <div className="container py-4">
      <h3
        className="fw-bold mb-4"
        style={{
          color: "#0f766e",
        }}
      >
        Today's Schedule
      </h3>

      {todaySchedule.length > 0 ? (
        todaySchedule.map((ts) => {
          return (
            <div
              key={ts.appointmentId}
              className="card border-0 shadow-lg mt-2"
              style={{
                borderRadius: "12px",
              }}
            >
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5
                      className="fw-bold mb-2"
                      style={{
                        color: "#0f766e",
                      }}
                    >
                      Patient Name: {ts.patientName}
                    </h5>

                    <p className="mb-1 text-muted">
                      <strong>Age:</strong> {ts.age}
                    </p>

                    <p className="mb-1 text-muted">
                      <strong>Gender:</strong> {ts.gender}
                    </p>

                    <p className="mb-1 text-muted">
                      <i className="bi bi-calendar-event me-2"></i>
                      {formatDate(ts.appointmentDate)}
                    </p>

                    <p className="mb-0 text-muted">
                      <i className="bi bi-clock me-2"></i>
                      {ts.appointmentTime}
                    </p>
                  </div>

                  <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex  flex-column">
                    <button
                      className="btn btn-success px-3 py-2 w-50"
                      style={{
                        background: "#198754",
                        fontSize: "14px",
                      }}
                      onClick={() => completeAppointment(ts.appointmentId)}
                    >
                      COMPLETE
                    </button>
                    <button
                      className="btn btn-success px-3 py-2 w-50 mt-2"
                      style={{
                        background: "#198754",
                        fontSize: "14px",
                      }}
                      onClick={() =>
                        navigate(`/write-medical-report/${ts.appointmentId}`)
                      }
                    >
                      Write Medical Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-5">
          <i
            className="bi bi-calendar-x"
            style={{ fontSize: "4rem", color: "#6c757d" }}
          ></i>

          <h4 className="mt-3 text-muted">No Appointments Scheduled Today</h4>

          <p className="text-secondary">
            Once you accept patient appointments, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;
