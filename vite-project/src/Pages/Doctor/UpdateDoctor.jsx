import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginContext } from "../../Context/LoginContext";
import { api } from "../../api";
import { toast } from "react-toastify";

const UpdateDoctor = () => {
  const { user } = useContext(LoginContext);
  const [preview, setPreview] = useState(
    `http://localhost:8080/doctors/get-image/${user?.doctor.docId}`,
  );
  const [image, setImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fetchDoctor = async () => {
    try {
      const response = await api.get(`doctors/${user?.doctor.docId}`);
      console.log(response.data);
      reset({
        doctorName: response.data.doctorName,
        specialization: response.data.specialization,
        qualification: response.data.qualification,
        experience: response.data.experience,
        consultationFee: response.data.consultationFee,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateDoctor = async (data) => {
    console.log(data);
    try {
      const response = await api.put(`/doctors/${user?.doctor.docId}`, data);
      console.log(response.data.docId);
      if (image) {
        const formData = new FormData();
        formData.append("doctorImage", image);

        const responseImage = await api.post(
          `/doctors/upload-image/${response.data.docId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }
      toast.success("Profile updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Changing the image
  const changeImage = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setImage(file);
    console.log(file);
    console.log(URL.createObjectURL(file));
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  return (
    <div
      className="container py-5"
      style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div
            className="card shadow-lg border-0"
            style={{ borderRadius: "18px" }}
          >
            <div
              className="card-header text-center text-white"
              style={{
                background: "linear-gradient(to right,#0f766e,#14b8a6)",
                padding: "18px",
              }}
            >
              <h3 className="mb-0">Update Doctor Profile</h3>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit(updateDoctor)}>
                {/* Doctor Image */}

                <div className="mb-4 text-center">
                  <label className="form-label fw-bold d-block mb-3">
                    Profile Photo
                  </label>

                  <img
                    src={preview}
                    alt="Doctor"
                    className="rounded-circle shadow"
                    style={{
                      width: "170px",
                      height: "170px",
                      objectFit: "cover",
                      border: "4px solid #0f766e",
                    }}
                  />

                  <div className="mt-3">
                    <label
                      htmlFor="doctorImage"
                      className="btn btn-outline-success"
                      style={{
                        borderRadius: "25px",
                        padding: "8px 20px",
                        cursor: "pointer",
                      }}
                    >
                      <i className="bi bi-camera-fill me-2"></i>
                      Change Image
                    </label>

                    <input
                      type="file"
                      id="doctorImage"
                      className="d-none"
                      onChange={changeImage}
                    />
                  </div>
                </div>
                {/* Name */}

                <div className="mb-3">
                  <label className="form-label fw-bold">Doctor Name</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    {...register("doctorName")}
                  />
                </div>

                {/* Specialization */}

                <div className="mb-3">
                  <label className="form-label fw-bold">Specialization</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Specialization"
                    {...register("specialization")}
                  />
                </div>

                {/* Qualification */}

                <div className="mb-3">
                  <label className="form-label fw-bold">Qualification</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Qualification"
                    {...register("qualification")}
                  />
                </div>

                {/* Experience */}

                <div className="mb-3">
                  <label className="form-label fw-bold">Experience</label>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Years of Experience"
                    {...register("experience")}
                  />
                </div>

                {/* Consultation Fee */}

                <div className="mb-3">
                  <label className="form-label fw-bold">Consultation Fee</label>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Consultation Fee"
                    {...register("consultationFee")}
                  />
                </div>

                {/* Buttons */}

                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="submit"
                    className="btn text-white px-4"
                    style={{
                      backgroundColor: "#0f766e",
                    }}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDoctor;
