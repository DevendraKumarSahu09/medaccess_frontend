import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Hospital, Mail, Phone, MapPin } from 'lucide-react';
import './HospitalProfilePage.css';

const HospitalProfilePage = () => {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hospitals/${id}`);
        setHospital(response.data);
      } catch (error) {
        console.error('Error fetching hospital data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  if (loading) return <p>Loading hospital details...</p>;
  if (!hospital) return <p>Hospital not found.</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Hospital size={50} />
        <h2>{hospital.name}</h2>
      </div>
      <div className="profile-details">
        <p><Mail size={20} /> {hospital.email}</p>
        <p><Phone size={20} /> {hospital.phone}</p>
        <p><MapPin size={20} /> {hospital.address}</p>
        <p><strong>Available Beds:</strong> {hospital.availableBeds}</p>
        <p><strong>Specialties:</strong> {hospital.specialties.join(', ')}</p>
      </div>
    </div>
  );
};

export default HospitalProfilePage;
