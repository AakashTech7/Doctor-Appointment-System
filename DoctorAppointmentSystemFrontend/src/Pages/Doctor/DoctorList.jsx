import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, CalendarPlus, IndianRupee, Search, SlidersHorizontal, Star } from "lucide-react";
import { api } from "../../api";
import "./DoctorList.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get("/doctors");
        const doctorList = data || [];
        setDoctors(doctorList);
        setSpecializations([...new Set(doctorList.map((doctor) => doctor.specialization).filter(Boolean))]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const doctorsToShow = useMemo(
    () => selectedSpecialization === "All" ? doctors : doctors.filter((doctor) => doctor.specialization === selectedSpecialization),
    [doctors, selectedSpecialization],
  );

  return (
    <main className="doctor-list-page">
      <div className="doctor-list-page__container">
        <header className="doctor-list-page__heading">
          <p>Find your care team</p>
          <h1>Find a doctor</h1>
          <span>Browse qualified specialists and book a consultation at a time that works for you.</span>
        </header>

        <section className="doctor-filter" aria-label="Filter doctors">
          <div className="doctor-filter__icon"><SlidersHorizontal size={20} /></div>
          <div className="doctor-filter__field">
            <label htmlFor="specialization">Specialization</label>
            <select id="specialization" value={selectedSpecialization} onChange={(event) => setSelectedSpecialization(event.target.value)}>
              <option value="All">All specializations</option>
              {specializations.map((specialization) => <option key={specialization} value={specialization}>{specialization}</option>)}
            </select>
          </div>
          <div className="doctor-filter__count">{doctorsToShow.length} {doctorsToShow.length === 1 ? "doctor" : "doctors"} available</div>
          <button onClick={() => setSelectedSpecialization(selectedSpecialization)}><Search size={17} /> Search doctors</button>
        </section>

        {isLoading ? (
          <div className="doctor-list-loading" role="status"><span /><p>Loading specialists…</p></div>
        ) : doctorsToShow.length ? (
          <section className="doctor-list-grid" aria-label="Available doctors">
            {doctorsToShow.map((doctor) => (
              <article className="provider-card" key={doctor.docId}>
                <div className="provider-card__image-wrap">
                  <img src={`http://localhost:8080/doctors/get-image/${doctor.docId}`} alt={doctor.doctorName} />
                  <span className="provider-card__availability"><i /> Available today</span>
                </div>
                <div className="provider-card__body">
                  <span className="provider-card__specialty">{doctor.specialization || "Specialist"}</span>
                  <h2>{doctor.doctorName}</h2>
                  <div className="provider-card__rating"><Star size={15} fill="currentColor" /> <strong>4.8</strong> <span>· 120 reviews</span></div>
                  <div className="provider-card__details">
                    <span><BriefcaseBusiness size={17} /><b>{doctor.experience || 0} years</b> experience</span>
                    <span><IndianRupee size={17} /><b>₹{doctor.consultationFee ?? 0}</b> consultation</span>
                  </div>
                  <button className="provider-card__book" onClick={() => navigate(`/patient/book-appointment/${doctor.docId}`)}>
                    Book appointment <CalendarPlus size={17} />
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="doctor-list-empty"><Search size={34} /><h2>No doctors found</h2><p>Try choosing another specialization to see available doctors.</p></section>
        )}
      </div>
    </main>
  );
};

export default DoctorList;
