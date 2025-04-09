import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    User,
    Stethoscope,
    Calendar,
    Clock,
    Phone,
    Globe,
    MapPin,
    Building,
    AlertCircle
} from 'lucide-react';
import './DoctorDetailsPage.css';

const DoctorDetailsPage = () => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/users/doctors/${id}`);
                setDoctor(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
                setError('Failed to load doctor information. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetails();
    }, [id]);

    if (loading) {
        return <div className="loading-state">Loading doctor information...</div>;
    }

    if (error || !doctor) {
        return (
            <div className="error-state">
                <AlertCircle size={48} />
                <p>{error || 'Doctor information not found'}</p>
            </div>
        );
    }

    const imageUrl = doctor.profilePhoto || doctor.profilePicture || 'https://cdn.pixabay.com/photo/2022/09/08/03/39/doctor-7439967_1280.png';

    // Get hospital information from different possible structures
    const hospitalName = doctor.affiliateHospital 
        ? (typeof doctor.affiliateHospital === 'object' ? doctor.affiliateHospital.name : doctor.affiliateHospital)
        : doctor.hospitalName || 'Not affiliated';

    // Format clinic address if available
    const formattedAddress = doctor.clinicAddress
        ? `${doctor.clinicAddress.street || ''}, ${doctor.clinicAddress.city || ''}, ${doctor.clinicAddress.state || ''} ${doctor.clinicAddress.zipCode || ''}`
        : doctor.address || 'No address available';

    return (
        <div className="doctor-details-page">
            <div className="doctor-profile-header">
                <div className="profile-image-container">
                    <img src={imageUrl} alt={doctor.fullName} className="doctor-profile-image" />
                </div>
                <div className="profile-header-content">
                    <h1>{doctor.fullName}</h1>
                    <div className="specialization-badge">
                        <Stethoscope size={20} />
                        {doctor.specialization}
                    </div>
                    <div className="experience-badge">
                        {doctor.experience} Years of Experience
                    </div>
                </div>
            </div>

            <div className="doctor-details-grid">
                <div className="info-card">
                    <h2>About Doctor</h2>
                    <p>{doctor.aboutYourself || "No information available"}</p>
                </div>

                <div className="info-card">
                    <h2>Professional Information</h2>
                    <div className="info-list">
                        <div className="info-item">
                            <Building className="info-icon" />
                            <div className="info-content">
                                <h3>Hospital Affiliation</h3>
                                <p>{hospitalName}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Clock className="info-icon" />
                            <div className="info-content">
                                <h3>Clinic Timings</h3>
                                <p>{doctor.clinicTimings || doctor.visitingHours || "Not specified"}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Globe className="info-icon" />
                            <div className="info-content">
                                <h3>Website</h3>
                                {doctor.websiteUrl ? (
                                    <a href={doctor.websiteUrl} target="_blank" rel="noopener noreferrer">
                                        {doctor.websiteUrl}
                                    </a>
                                ) : (
                                    <p>Not provided</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <h2>Contact Information</h2>
                    <div className="info-list">
                        <div className="info-item">
                            <Phone className="info-icon" />
                            <div className="info-content">
                                <h3>Contact Number</h3>
                                <p>{doctor.phoneNumber || doctor.contactNumber || "Not available"}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <MapPin className="info-icon" />
                            <div className="info-content">
                                <h3>Clinic Address</h3>
                                <p>{formattedAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetailsPage;
