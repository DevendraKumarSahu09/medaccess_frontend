import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Activity, ShieldPlus, Building, Award, Heart, Star } from 'lucide-react';
import './HospitalDetailsPage.css';

const HospitalDetailsPage = () => {
    const { id } = useParams();
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            try {
                const response = await axios.get(`https://medaccess-backend.onrender.com/api/users/hospitals/${id}`);
                setHospital(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching hospital details:', error);
                setLoading(false);
            }
        };

        if (id) {
            fetchHospitalDetails();
        }
    }, [id]);

    if (loading) {
        return <div className="loading-state">Loading...</div>;
    }

    if (!hospital) {
        return <div className="error-state">Hospital not found</div>;
    }

    const imageUrl = hospital.profilePhoto || hospital.hospitalProfilePhoto || 'https://plus.unsplash.com/premium_photo-1672097247893-4f8660247b1f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // Extract city and state from address string if possible
    const getLocationFromAddress = (address) => {
        if (!address) return 'Location not available';
        const parts = address.split(',').map(part => part.trim());
        // Try to get city and state (typically 2nd and 3rd parts of address)
        if (parts.length >= 3) {
            return `${parts[1]}, ${parts[2]}`;
        } else if (parts.length === 2) {
            return parts.join(', ');
        }
        return address;
    };

    const locationDisplay = hospital.location || getLocationFromAddress(hospital.address);

    return (
        <div className="hospital-page">
            <div className="hospital-hero" style={{ backgroundImage: `url(${imageUrl})` }}>
                <div className="hospital-hero__overlay">
                    <div className="hospital-hero__content">
                        <h1 className="hospital-hero__title">{hospital.hospitalName || hospital.name}</h1>
                        <div className="hospital-hero__location">
                            <MapPin className="icon" />
                            <span>{locationDisplay}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hospital-content">
                <div className="quick-info">
                    <div className="quick-info__card">
                        <Phone className="quick-info__icon" />
                        <div className="quick-info__text">
                            <h3>Contact</h3>
                            <p>{hospital.contact || hospital.phoneNumber}</p>
                        </div>
                    </div>
                    <div className="quick-info__card">
                        <Mail className="quick-info__icon" />
                        <div className="quick-info__text">
                            <h3>Email</h3>
                            <p>{hospital.email}</p>
                        </div>
                    </div>
                    <div className="quick-info__card">
                        <Globe className="quick-info__icon" />
                        <div className="quick-info__text">
                            <h3>Website</h3>
                            <a href={hospital.websiteUrl} target="_blank" rel="noopener noreferrer">
                                Visit Website
                            </a>
                        </div>
                    </div>
                    <div className="quick-info__card">
                        <Star className="quick-info__icon" />
                        <div className="quick-info__text">
                            <h3>Rating</h3>
                            <div className="hospital-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            className={`star ${i < 4 ? 'filled' : ''}`} 
                                            fill={i < 4 ? '#ffc107' : 'none'} 
                                        />
                                    ))}
                                </div>
                                <span className="rating-text">4.0/5 (Based on community feedback)</span>
                            </div>
                        </div>
                    </div>
                    <div className="quick-info__card">
                        <Heart className="quick-info__icon" />
                        <div className="quick-info__text">
                            <h3>Services & Facilities</h3>
                            <p>{hospital.departmentalServices || 
                               (hospital.specializations && hospital.specializations.length > 0 ? 
                                hospital.specializations.join(", ") : 
                                hospital.facilities && hospital.facilities.length > 0 ? 
                                hospital.facilities.join(", ") : 
                                "General healthcare services")}</p>
                        </div>
                    </div>
                </div>

                <div className="hospital-sections">
                    <section className="info-section">
                        <h2>About Us</h2>
                        <div className="info-section__content">
                            <p>{hospital.hospitalName || hospital.name} is a leading healthcare institution dedicated to providing high-quality medical care with compassion and expertise. Equipped with state-of-the-art technology and a team of experienced doctors, nurses, and specialists, we offer a wide range of medical services, including cardiology, orthopedics, neurology, oncology, and maternity care. Our hospital operates 24/7, ensuring that patients receive immediate and effective treatment, whether for routine check-ups, emergency care, or specialized procedures.

With a patient-first approach, we focus on personalized treatment, affordability, and accessibility, making quality healthcare available to all. Our commitment to excellence extends beyond treatment to research, innovation, and community health initiatives. At {hospital.hospitalName || hospital.name}, we strive to create a comfortable and safe environment where every patient receives the best possible care for a healthier future.</p>
                        </div>
                    </section>

                    <section className="info-section">
                        <h2>Specializations & Facilities</h2>
                        <div className="info-section__content">
                            <div className="specializations-container">
                                {(hospital.specializations && hospital.specializations.length > 0) ? (
                                    <div className="specializations-list">
                                        <h3><Award className="section-icon" /> Medical Specializations</h3>
                                        <ul>
                                            {hospital.specializations.map((spec, index) => (
                                                <li key={index}>{spec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                {(hospital.facilities && hospital.facilities.length > 0) ? (
                                    <div className="facilities-list">
                                        <h3><Building className="section-icon" /> Hospital Facilities</h3>
                                        <ul>
                                            {hospital.facilities.map((facility, index) => (
                                                <li key={index}>{facility}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="fallback-message">
                                        {hospital.departmentalServices || 
                                        "This hospital offers a comprehensive range of healthcare services designed to meet the medical needs of the community."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="info-section">
                        <h2>Location & Address</h2>
                        <div className="info-section__content">
                            <div className="address-card">
                                <MapPin className="address-card__icon" />
                                <address>
                                    {hospital.address || 'Address information not available'}
                                </address>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HospitalDetailsPage;
