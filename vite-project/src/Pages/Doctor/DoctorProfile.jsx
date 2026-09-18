import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import { toast } from "react-toastify";
import { LoginContext } from "../../Context/LoginContext";

const DoctorProfile = () => {
  const { user } = useContext(LoginContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // const response = await api.put(`/doctors/${user?.doctor.docId}`, data);
      // console.log(response.data);

      const response = await api.post(`/doctors/register/${userId}`, data);
      console.log(response);

      const formData = new FormData();
      formData.append("doctorImage", data.doctorImage[0]);

      const responseImage = await api.post(
        `/doctors/upload-image/${response.data.docId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(responseImage);

      toast.success(
        "Your profile has been submitted successfully .It is now awaiting Admin approval.You will receive an email notification once your account has been verified and approved.",
      );
      navigate(`/`);
    } catch (error) {
      console.log(userId);
      toast.error("Oops!, Something went wrong");
    }
  };

  return (
    <main
      className="min-vh-100 py-5"
      style={{
        background:
          "linear-gradient(135deg,#f8fafc 0%,#e0f2fe 50%,#dbeafe 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* LEFT PANEL */}

                <div
                  className="col-lg-4 text-white p-4 p-md-5 d-flex flex-column justify-content-between"
                  style={{
                    background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                    minHeight: "720px",
                  }}
                >
                  <div>
                    <div
                      className="d-inline-flex align-items-center bg-white rounded-pill px-3 py-2 shadow-sm mb-4"
                      style={{ color: "#0f766e" }}
                    >
                      <i className="bi bi-person-badge-fill me-2"></i>

                      <span className="fw-bold">Doctor Profile</span>
                    </div>

                    <h2 className="fw-bold mb-3">
                      Complete Your Professional Profile
                    </h2>

                    <p className="opacity-75 fs-5 mb-5">
                      Provide accurate professional details so patients can
                      easily discover and book appointments with you.
                    </p>

                    <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-light mb-4">
                      <h6 className="fw-bold">
                        <i className="bi bi-heart-pulse-fill me-2"></i>
                        Trusted Healthcare
                      </h6>

                      <small className="opacity-75">
                        Build trust with verified professional information.
                      </small>
                    </div>

                    <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-light">
                      <h6 className="fw-bold">
                        <i className="bi bi-calendar2-check-fill me-2"></i>
                        Get More Appointments
                      </h6>

                      <small className="opacity-75">
                        Complete profiles attract more patients.
                      </small>
                    </div>
                  </div>

                  <div>
                    <hr className="border-light" />

                    <p className="fw-semibold mb-1">
                      Helping doctors connect with patients.
                    </p>

                    <small className="opacity-75">
                      Fast • Secure • Professional
                    </small>
                  </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="col-lg-8 bg-white">
                  <div className="p-4 p-md-5">
                    <div className="mb-5">
                      <h2 className="fw-bold">Doctor Information</h2>

                      <p className="text-muted">
                        Fill your professional details carefully.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* Specialization */}
                      <div className="row g-4 mt-2">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Specialization
                          </label>

                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light">
                              <i className="bi bi-heart-pulse-fill"></i>
                            </span>

                            <input
                              type="text"
                              className={`form-control  fs-6${
                                errors.specialization ? "is-invalid" : ""
                              }`}
                              placeholder="e.g. Cardiologist"
                              {...register("specialization", {
                                required: "specialization is required",
                              })}
                            />
                          </div>

                          {errors.specialization && (
                            <small className="text-danger">
                              {errors.specialization.message}
                            </small>
                          )}
                        </div>

                        {/* Experience */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Experience (Years)
                          </label>

                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light">
                              <i className="bi bi-briefcase-fill"></i>
                            </span>

                            <input
                              type="number"
                              className={`form-control  fs-6 ${
                                errors.experience ? "is-invalid" : ""
                              }`}
                              placeholder="Enter years of experience"
                              {...register("experience", {
                                required: "experience is required",
                              })}
                            />
                          </div>

                          {errors.experience && (
                            <small className="text-danger">
                              {errors.experience.message}
                            </small>
                          )}
                        </div>

                        {/* Qualification */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Qualification
                          </label>

                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light">
                              <i className="bi bi-mortarboard-fill"></i>
                            </span>

                            <input
                              type="text"
                              className={`form-control  fs-6${
                                errors.qualification ? "is-invalid" : ""
                              }`}
                              placeholder="e.g. MBBS, MD"
                              {...register("qualification", {
                                required: "qualification is required",
                              })}
                            />
                          </div>

                          {errors.qualification && (
                            <small className="text-danger">
                              {errors.qualification.message}
                            </small>
                          )}
                        </div>

                        {/* Consultation Fee */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Consultation Fee (₹)
                          </label>

                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light">
                              <i className="bi bi-currency-rupee"></i>
                            </span>

                            <input
                              type="number"
                              className={`form-control fs-6${
                                errors.consultationFee ? "is-invalid" : ""
                              }`}
                              placeholder="Enter consultation fee"
                              {...register("consultationFee", {
                                required: "consultation fee is required",
                              })}
                            />
                          </div>

                          {errors.consultationFee && (
                            <small className="text-danger">
                              {errors.consultationFee.message}
                            </small>
                          )}
                        </div>

                        {/* Upload Image Code */}

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Upload a professional photo.
                          </label>
                          <input
                            className="form-control fs-6"
                            type="file"
                            id="formFile"
                            {...register("doctorImage")}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}

                      <button
                        type="submit"
                        className="btn btn-lg w-100 mt-5 text-white fw-bold shadow"
                        style={{
                          background: "#0f766e",
                          borderColor: "#0f766e",
                          padding: "14px",
                        }}
                      >
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Complete Profile
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DoctorProfile;
