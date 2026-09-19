import React, { useEffect, useState } from "react";
import { api } from "../../api";

const ManageDoctors = () => {
  const [pendingDoctor, setPendingDoctor] = useState([]);
  const [pendingDoctorDetails, setPendingDoctorDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = pendingDoctor.filter((doctor) =>
    [doctor.doctorName, doctor.specialization, doctor.qualification]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      {pendingDoctor.length > 0 ? (
        <>
          <div
            className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
            style={{
              background: "linear-gradient(120deg, #0f766e 0%, #0d9488 55%, #2dd4bf 100%)",
            }}
          >
            <div className="card-body p-4 p-lg-5 position-relative">
              <div className="row align-items-center g-4 position-relative">
                <div className="col-lg-8">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-white bg-opacity-20" style={{ width: "48px", height: "48px" }}>
                      <i className="bi bi-person-check-fill text-white fs-4"></i>
                    </span>
                    <div>
                      <p className="text-uppercase text-white-50 fw-semibold small mb-1" style={{ letterSpacing: ".12em" }}>Credential review</p>
                      <h2 className="text-white fw-bold mb-0">Doctor Approval Requests</h2>
                    </div>
                  </div>
                  <p className="text-white mb-0" style={{ opacity: ".9", maxWidth: "620px" }}>
                    Review professional credentials and approve the providers ready to join your care network.
                  </p>
                </div>
                <div className="col-lg-4">
                  <div className="bg-white bg-opacity-95 rounded-4 p-3 p-md-4 text-lg-start shadow-sm">
                    <p className="text-muted text-uppercase fw-bold small mb-1" style={{ letterSpacing: ".08em" }}>Awaiting review</p>
                    <div className="d-flex align-items-baseline gap-2">
                      <span className="display-6 fw-bold" style={{ color: "#0f766e" }}>{pendingDoctor.length}</span>
                      <span className="text-muted">doctor{pendingDoctor.length === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3 p-md-4">
              <div className="row align-items-center g-3">
                <div className="col-lg-5">
                  <h5 className="fw-bold text-dark mb-1">Pending provider applications</h5>
                  <p className="text-muted small mb-0">Open a profile to check credentials before making a decision.</p>
                </div>
                <div className="col-lg-7">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-3"><i className="bi bi-search text-muted"></i></span>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="form-control border-start-0 rounded-end-pill py-2"
                      placeholder="Search by doctor, specialty, or qualification"
                      aria-label="Search pending doctor applications"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: "#f0fdfa" }}>
                    <tr>
                      <th className="text-uppercase small text-muted ps-4 py-3" style={{ letterSpacing: ".06em" }}>Doctor</th>
                      <th className="text-uppercase small text-muted py-3" style={{ letterSpacing: ".06em" }}>Specialization</th>
                      <th className="text-uppercase small text-muted py-3" style={{ letterSpacing: ".06em" }}>Qualification</th>
                      <th className="text-uppercase small text-muted py-3" style={{ letterSpacing: ".06em" }}>Experience</th>
                      <th className="text-uppercase small text-muted py-3" style={{ letterSpacing: ".06em" }}>Status</th>
                      <th className="text-uppercase small text-muted text-center py-3 pe-4" style={{ letterSpacing: ".06em" }}>Review</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDoctors.map((pd) => {
                      return (
                        <tr key={pd.docId}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                              <img
                                src={`http://localhost:8080/doctors/get-image/${pd.docId}`}
                                alt={`Dr. ${pd.doctorName}`}
                                className="rounded-circle border border-2 border-white shadow-sm"
                                style={{
                                  width: "55px",
                                  height: "55px",
                                  objectFit: "cover",
                                }}
                              />

                              <div className="ms-3">
                                <h6 className="fw-bold mb-0">
                                  Dr. {pd.doctorName}
                                </h6>

                                <small className="text-muted">Application #{pd.docId}</small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="badge rounded-pill fw-semibold px-3 py-2" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                              {pd.specialization}
                            </span>
                          </td>

                          <td className="text-secondary">{pd.qualification}</td>

                          <td className="text-secondary">{pd.experience} years</td>

                          <td>
                            <span className="badge rounded-pill px-3 py-2" style={{ background: "#fef3c7", color: "#92400e" }}>
                              {pd.status}
                            </span>
                          </td>

                          <td className="text-center pe-4">
                            <button
                              className="btn btn-sm rounded-pill px-3 fw-semibold"
                              style={{ borderColor: "#0f766e", color: "#0f766e" }}
                              data-bs-toggle="modal"
                              data-bs-target="#doctorApprovalModal"
                              onClick={() =>
                                fetchPendingDoctorDetails(pd.docId)
                              }
                            >
                              <i className="bi bi-shield-check me-2"></i>Review
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredDoctors.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <i className="bi bi-search fs-3 text-muted d-block mb-2"></i>
                          <span className="fw-semibold d-block">No matching applications</span>
                          <small className="text-muted">Try a different doctor name, specialty, or qualification.</small>
                        </td>
                      </tr>
                    )}
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
