import React, { useEffect, useState } from 'react';
import './BedsPage.css';

const BedsPage = () => {
    const [bedsData, setBedsData] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data from the backend API using fetch
    useEffect(() => {
        // Fetch bed data from the API endpoint
        fetch('http://localhost:5000/api/beds/bedspage', {
            method: 'GET', // GET request to fetch data
        })
            .then((response) => response.json()) // Parse response as JSON
            .then((data) => {
                setBedsData(data); // Set the fetched data to the state
            })
            .catch((err) => {
                setError('Error fetching bed details');
                console.error(err); // Log the error to the console
            });
    }, []);

    // Handle clicking a hospital card to display its bed details
    const handleHospitalClick = (hospitalId) => {
        const hospital = bedsData.find((hospital) => hospital._id === hospitalId);
        setSelectedHospital(hospital); // Set the selected hospital's bed data
        setIsModalOpen(true); // Open the modal
        // Disable scrolling on the body when modal is open
        document.body.style.overflow = 'hidden';
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        // Re-enable scrolling when modal is closed
        document.body.style.overflow = 'auto';
    };

    // Close modal if user clicks outside the content
    const handleModalBackdropClick = (e) => {
        if (e.target.classList.contains('bed-modal-backdrop')) {
            closeModal();
        }
    };

    // Close modal when escape key is pressed
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleEscapeKey);
        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
            // Re-enable scrolling when component unmounts
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    // Handle error and loading states
    if (error) return <div className="bed-page-wrapper error-message">{error}</div>;

    if (!bedsData.length) return <div className="bed-page-wrapper loading-state">Loading bed details...</div>;

    return (
        <div className="bed-page-wrapper beds-page">
            <h1>Hospital Bed Details</h1>
            
            <div className="bed-filter-info">
                <p>Click on a hospital card to view detailed bed information</p>
            </div>
            
            <div className="hospital-cards-container">
                {bedsData.map((hospital) => (
                    <div
                        key={hospital._id}
                        className="hospital-card"
                        onClick={() => handleHospitalClick(hospital._id)} // On card click, show bed details
                    >
                        {/* <div className="card-badge">{hospital.hospitalName}</div> */}
                        <img
                            src={hospital.hospitalProfilePhoto}
                            alt={`${hospital.hospitalName} Profile`}
                            className="hospital-photo"
                        />
                        <h3>{hospital.hospitalName}</h3>
                        <div className="hospital-card-stats">
                            <div className="stat">
                                <span className="stat-value">{hospital.beds.reduce((total, bed) => total + bed.totalBeds, 0)}</span>
                                <span className="stat-label">Total Beds</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{hospital.beds.reduce((total, bed) => total + bed.availableBeds, 0)}</span>
                                <span className="stat-label">Available</span>
                            </div>
                        </div>
                        <button className="view-details-btn">View Details</button>
                    </div>
                ))}
            </div>

            {/* Modal for bed details */}
            {isModalOpen && selectedHospital && (
                <div className="bed-modal-backdrop" onClick={handleModalBackdropClick}>
                    <div className="bed-modal">
                        <div className="bed-modal-header">
                            <div className="hospital-modal-info">
                                <img 
                                    src={selectedHospital.hospitalProfilePhoto} 
                                    alt={selectedHospital.hospitalName} 
                                    className="modal-hospital-logo"
                                />
                                <div>
                                    <h2>{selectedHospital.hospitalName}</h2>
                                    <p>Bed Availability Information</p>
                                </div>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}>×</button>
                        </div>
                        
                        <div className="bed-modal-body">
                            <div className="bed-summary">
                                <div className="summary-item total">
                                    <div className="summary-value">
                                        {selectedHospital.beds.reduce((total, bed) => total + bed.totalBeds, 0)}
                                    </div>
                                    <div className="summary-label">Total Beds</div>
                                </div>
                                <div className="summary-item available">
                                    <div className="summary-value">
                                        {selectedHospital.beds.reduce((total, bed) => total + bed.availableBeds, 0)}
                                    </div>
                                    <div className="summary-label">Available</div>
                                </div>
                                <div className="summary-item occupied">
                                    <div className="summary-value">
                                        {selectedHospital.beds.reduce((total, bed) => total + bed.occupiedBeds, 0)}
                                    </div>
                                    <div className="summary-label">Occupied</div>
                                </div>
                            </div>
                            
                            <h3 className="bed-section-title">Available Bed Types</h3>
                            
                            <div className="bed-cards-grid">
                                {selectedHospital.beds.map((bed, index) => (
                                    <div key={index} className="bed-type-card">
                                        <div className="bed-type-header">
                                            <h4>{bed.bedType}</h4>
                                            <div className="price-tag">₹{bed.pricePerDay}/day</div>
                                        </div>
                                        
                                        <div className="bed-availability-indicator">
                                            <div 
                                                className="availability-bar" 
                                                style={{
                                                    width: `${(bed.availableBeds / bed.totalBeds) * 100}%`,
                                                    backgroundColor: bed.availableBeds < 3 ? '#ef4444' : 
                                                                    bed.availableBeds < 5 ? '#f97316' : '#10b981'
                                                }}
                                            ></div>
                                        </div>
                                        
                                        <div className="bed-stats">
                                            <div className="bed-stat">
                                                <span className="stat-number">{bed.totalBeds}</span>
                                                <span className="stat-label">Total</span>
                                            </div>
                                            <div className="bed-stat available">
                                                <span className="stat-number">{bed.availableBeds}</span>
                                                <span className="stat-label">Available</span>
                                            </div>
                                            <div className="bed-stat occupied">
                                                <span className="stat-number">{bed.occupiedBeds}</span>
                                                <span className="stat-label">Occupied</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bed-details-note">
                                <p>Note: Bed availability is updated in real-time. For reservations, please contact the hospital directly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BedsPage;
