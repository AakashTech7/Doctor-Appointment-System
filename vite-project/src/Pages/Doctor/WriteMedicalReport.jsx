import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const WriteMedicalReport = () => {
  const { appointmentId } = useParams();
  
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const response = await api.post(`/medical-record/add-record/${appointmentId}`, data);
      console.log(response.data);
      toast.success("Medical Record Added Successfully!!!");
      navigate("/doctor/today's-schedule");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);

    }
  };

  const fillDummyData = () => {
    setValue("diagnosis", "Acute bronchitis with mild respiratory infection. Patient presents with persistent cough and chest congestion.");
    setValue("symptoms", "Persistent dry cough for 5 days, mild fever (99.5°F), chest tightness, fatigue, occasional shortness of breath, loss of appetite.");
    setValue("medicines", "1. Amoxicillin 500mg - twice daily for 7 days\n2. Paracetamol 500mg - as needed for fever\n3. Cough syrup - 10ml twice daily\n4. Vitamin C supplements - once daily");
    setValue("dosage", "Amoxicillin: Take with food, complete full course\nParacetamol: Maximum 4 tablets per day\nCough syrup: Take after meals\nVitamin C: Take in the morning");
    setValue("medicalTest", "Complete blood count (CBC), Chest X-ray, Sputum culture if symptoms persist beyond 7 days");
    setValue("advice", "Rest and avoid physical exertion for 3-5 days. Drink plenty of warm fluids. Avoid cold drinks and exposure to dust/smoke. Use a humidifier in the room. Follow up after 7 days or if symptoms worsen.");
    toast.success("Dummy data filled successfully!");
  };

  return (
    <div
      className="container py-5"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4">
            <div
              className="card-header text-white text-center py-3"
              style={{
                background: "#0f766e",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <h3 className="mb-0">
                <i className="bi bi-file-earmark-medical me-2"></i>
                Medical Report & Prescription
              </h3>
            </div>

            <form
              className="card-body p-4"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div className="mb-4">
                <label className="form-label fw-semibold">Diagnosis</label>

                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Enter Diagnosis..."
                  {...register("diagnosis", { required: "Enter Diagnosis" })}
                ></textarea>
              </div>
              {errors.diagnosis && (
                <small className="text-danger">
                  {errors.diagnosis.message}
                </small>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">Symptoms</label>

                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Enter Symptoms..."
                  {...register("symptoms", { required: "Enter Symptoms" })}
                ></textarea>
              </div>
              {errors.name && (
                <small className="text-danger">{errors.symptoms.message}</small>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">Medicines</label>

                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Enter Medicines..."
                  {...register("medicines", { required: "Enter Medicines" })}
                ></textarea>
              </div>
              {errors.medicines && (
                <small className="text-danger">
                  {errors.medicines.message}
                </small>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">Dosage</label>

                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Enter Dosage..."
                  {...register("dosage", { required: "Enter Dosage" })}
                ></textarea>
              </div>
              {errors.dosage && (
                <small className="text-danger">{errors.dosage.message}</small>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">Medical Tests</label>

                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Medical Test..."
                  {...register("medicalTest")}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Advice</label>

                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Enter Advice..."
                  {...register("advice", { required: "Enter advice" })}
                ></textarea>
              </div>
              {errors.advice && (
                <small className="text-danger">{errors.advice.message}</small>
              )}

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2 me-3"
                  onClick={fillDummyData}
                >
                  <i className="bi bi-magic me-2"></i>
                  Fill Dummy Data
                </button>
                <button
                  type="submit"
                  className="btn text-white px-5 py-2"
                  style={{
                    background: "#0f766e",
                    fontSize: "18px",
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteMedicalReport;
