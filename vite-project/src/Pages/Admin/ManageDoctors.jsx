import React, { useEffect, useState } from "react";
import { api } from "../../api";

const ManageDoctors = () => {
  const [pendingDoctor, setPendingDoctor] = useState([]);
  const [pendingDoctorDetails, setPendingDoctorDetails] = useState({});

  const fetchPendingStatusDoctor = async () => {
    try {
      const response = await api.get("/doctors/pending-status-doctor");
      console.log(response.data);
      setPendingDoctor(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingDoctorDetails = async (docId) => {
    try {
      const response = await api.get(`/doctors/${docId}`);
      console.log(response.data);
      setPendingDoctorDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveDoctor = async (docId) => {
    try {
      const response = await api.put(`/admin/approve-doctor/${docId}`);
      console.log(response);
      fetchPendingStatusDoctor();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectDoctor = async (docId) => {
    try {
      const response = await api.put(`/admin/reject-doctor/${docId}`);
      console.log(response);
      fetchPendingStatusDoctor();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPendingStatusDoctor();
  }, []);

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "#f4f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      {pendingDoctor.length > 0 ? (
        <>
          {" "}
          <div
            className="card border-0 shadow rounded-4 mb-4"
            style={{
              background: "linear-gradient(135deg,#0f766e,#14b8a6)",
            }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h2 className="text-white fw-bold">
                    Doctor Approval Requests
                  </h2>

                  <p
                    className="text-white mb-0"
                    style={{
                      opacity: ".9",
                    }}
                  >
                    Review newly registered doctors before allowing them into
                    the system.
                  </p>
                </div>

                <div className="col-lg-4 text-end">
                  <span
                    className="badge rounded-pill px-4 py-3"
                    style={{
                      background: "#fff",
                      color: "#0f766e",
                      fontSize: "15px",
                    }}
                  >
                    Pending : {pendingDoctor.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Search */}
          <div className="card border-0 shadow rounded-4 mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <h5 className="fw-bold mb-0">Registered Doctors</h5>
                </div>

                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Search Doctor..."
                  />
                </div>
              </div>
            </div>
          </div>
          {/* ========================= TABLE ========================= */}
          <div className="card border-0 shadow rounded-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead
                    style={{
                      background: "#0f766e",
                    }}
                  >
                    <tr>
                      <th className="text-dark ps-4 py-3">Doctor</th>

                      <th className="text-dark py-3">Specialization</th>

                      <th className="text-dark py-3">Qualification</th>

                      <th className="text-dark py-3">Experience</th>

                      <th className="text-dark py-3">Status</th>

                      <th className="text-dark text-center py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pendingDoctor.map((pd) => {
                      return (
                        <tr>
                          <td className="ps-4 text-center">
                            <div className="d-flex align-items-center">
                              <img
                                src={`http://localhost:8080/doctors/get-image/${pd.docId}`}
                                alt=""
                                className="rounded-circle"
                                style={{
                                  width: "55px",
                                  height: "55px",
                                }}
                              />

                              <div className="ms-3">
                                <h6 className="fw-bold mb-0">
                                  Dr. {pd.doctorName}
                                </h6>

                                <small className="text-muted">
                                  ahmed@gmail.com
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="badge bg-info fs-6">
                              {pd.specialization}
                            </span>
                          </td>

                          <td>{pd.qualification}</td>

                          <td>{pd.experience} Years</td>

                          <td>
                            <span className="badge bg-warning text-dark fs-6">
                              {pd.status}
                            </span>
                          </td>

                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#doctorApprovalModal"
                              onClick={() =>
                                fetchPendingDoctorDetails(pd.docId)
                              }
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* ========================= DOCTOR DETAILS MODAL ========================= */}
          <div className="modal fade" id="doctorApprovalModal" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 rounded-4 shadow">
                {/* Header */}

                <div
                  className="modal-header border-0 text-white"
                  style={{ background: "#0f766e" }}
                >
                  <h4 className="modal-title fw-bold">Doctor Verification</h4>

                  <button
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                  ></button>
                </div>

                {/* Body */}

                <div className="modal-body p-4">
                  <div className="row g-4 align-items-center">
                    {/* Left */}

                    <div className="col-12 col-lg-4 text-center">
                      <img
                        src={`http://localhost:8080/doctors/get-image/${pendingDoctorDetails.docId}`}
                        alt=""
                        className="rounded-circle shadow img-fluid"
                        style={{
                          width: "170px",
                          height: "170px",
                          objectFit: "cover",
                        }}
                      />

                      <h4 className="fw-bold mt-3">
                        Dr. {pendingDoctorDetails?.doctorName}
                      </h4>

                      <span className="badge bg-warning fs-6 px-3 py-2">
                        {pendingDoctorDetails?.status}
                      </span>
                    </div>

                    {/* Right */}

                    <div className="col-12 col-lg-8">
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label className="fw-semibold text-muted mb-1">
                            Qualification
                          </label>

                          <div className="form-control">
                            {pendingDoctorDetails?.qualification}
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="fw-semibold text-muted mb-1">
                            Experience
                          </label>

                          <div className="form-control">
                            {" "}
                            {pendingDoctorDetails?.experience} Years
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="fw-semibold text-muted mb-1">
                            Specialization
                          </label>

                          <div className="form-control">
                            {pendingDoctorDetails?.specialization}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}

                <div className="modal-footer border-0 justify-content-center justify-content-md-end">
                  <button
                    className="btn btn-danger rounded-pill px-4 mb-2 mb-md-0"
                    onClick={() => rejectDoctor(pendingDoctorDetails.docId)}
                  >
                    <i className="bi bi-x-circle-fill me-2"></i>
                    Reject
                  </button>

                  <button
                    className="btn text-white rounded-pill px-4"
                    style={{ background: "#0f766e" }}
                    onClick={() => approveDoctor(pendingDoctorDetails.docId)}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Approve Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "70vh" }}
        >
          <div
            className="card border-0 shadow rounded-4 text-center p-5"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <div className="mb-4">
              <i
                className="bi bi-patch-check-fill"
                style={{
                  fontSize: "70px",
                  color: "#0f766e",
                }}
              ></i>
            </div>

            <h3 className="fw-bold mb-3">No Pending Approval Requests</h3>

            <p className="text-muted mb-4">
              Great! All doctor registration requests have been reviewed. There
              are currently no doctors waiting for approval.
            </p>

            <button
              className="btn text-white px-4"
              style={{
                background: "#0f766e",
                borderRadius: "10px",
              }}
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              All Requests Completed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
