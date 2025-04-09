
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Hospital, Stethoscope, ArrowRight } from 'lucide-react';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
    // console.log("Doctor Image URL:", doctor.profilePhoto);

    const imageUrl = doctor.profilePhoto || 'https://cdn.pixabay.com/photo/2022/09/08/03/39/doctor-7439967_1280.png';

  return (
    <div className="doctor-card">
      <div className="image-wrapper">
        <img src={imageUrl} alt={doctor.fullName} className="doctor-image" />
        <div className="doctor-specialty-badge">
          {doctor.specialization}
        </div>
      </div>

      <div className="doctor-info">
        <h2 className="doctor-name">{doctor.fullName}</h2>

        <div className="info-grid">
          <div className="info-item">
            <Stethoscope  className="info-icon" />
            <span>{doctor.specialization}</span>
          </div>

          <div className="info-item">
            <Hospital  className="info-icon" />
            <span>{doctor.experience} years experience</span>
          </div>

          {/* <div className="info-item">
            <Phone size={16} className="info-icon" />
            <span>{doctor.websiteUrl}</span>
          </div> */}
        </div>
      </div>

      <Link to={`/doctors/${doctor._id}`} className="view-profile-btn">
        <span>View Profile</span>
        <ArrowRight size={16} className="arrow-icon" />
      </Link>
    </div>
  );
};

export default DoctorCard;
