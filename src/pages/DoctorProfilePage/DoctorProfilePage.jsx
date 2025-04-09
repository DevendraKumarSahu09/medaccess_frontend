import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { User, Mail, Phone, BriefcaseMedical } from 'lucide-react';
import './DoctorProfilePage.css';

const DoctorProfilePage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`https://medaccess-backend.onrender.com/api/doctors/${id}`);
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p>Loading doctor details...</p>;
  if (!doctor) return <p>Doctor not found.</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <User size={50} />
        <h2>Dr. {doctor.name}</h2>
      </div>
      <div className="profile-details">
        <p><Mail size={20} /> {doctor.email}</p>
        <p><Phone size={20} /> {doctor.phone}</p>
        <p><BriefcaseMedical size={20} /> <strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>Experience:</strong> {doctor.experience} years</p>
        <p><strong>Hospital:</strong> {doctor.hospital}</p>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
