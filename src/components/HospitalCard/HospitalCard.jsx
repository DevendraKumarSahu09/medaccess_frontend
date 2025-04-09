import { Link } from 'react-router-dom';
import { MapPin, Award, ArrowRight } from 'lucide-react';
import './HospitalCard.css';

const HospitalCard = ({ hospital }) => {
    // Use default image if profilePhoto is not available
    const imageUrl = hospital.profilePhoto || hospital.hospitalProfilePhoto || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcd5J_YDIyLfeZCHcsBpcuN8irwbIJ_VDl0Q&s';

    // Get the hospital name from either hospitalName or name property
    const hospitalName = hospital.hospitalName || hospital.name || 'Hospital';

    // Get location from location field or try to extract city from address string
    const getDisplayLocation = () => {
        // First check if location field exists
        if (hospital.location) return hospital.location;
        
        // Otherwise try to extract city from address string
        if (hospital.address && typeof hospital.address === 'string') {
            const parts = hospital.address.split(',').map(part => part.trim());
            // City is typically the second part of an address string
            if (parts.length >= 2) return parts[1];
            return hospital.address; // Just use the whole address if can't extract
        }
        
        return 'Location not available';
    };

    const locationDisplay = getDisplayLocation();

    return (
        <div className="hospital-card">
            <div className="image-container">
                <img className="hospital-image" src={imageUrl} alt={hospitalName} />
            </div>
            <div className="hospital-info">
                <h3 className="hospital-name">{hospitalName}</h3>
                <div className="info-row">
                    <MapPin size={16} className="icon" />
                    <p className="hospital-location">{locationDisplay}</p>
                </div>
                {/* <div className="info-row">
                    <Award size={16} className="icon" />
                    <p className="hospital-specialties">{hospital.about}</p>
                </div> */}
                <Link to={`/hospitals/${hospital._id}`} className="details-btn">
                    View Details
                    <ArrowRight size={16} className="arrow-icon" />
                </Link>
            </div>
        </div>
    );
};

export default HospitalCard;
