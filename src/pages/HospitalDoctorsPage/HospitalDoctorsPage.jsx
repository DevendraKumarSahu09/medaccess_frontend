import React, { useState, useEffect } from 'react';
import { FaUserMd, FaSearch, FaHospital, FaFilter } from 'react-icons/fa';
import './HospitalDoctorsPage.css';

const HospitalDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch hospital doctors data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hospitals - use public endpoint
        const hospitalsResponse = await fetch('http://localhost:5000/api/dashboard/public/hospitals');
        if (!hospitalsResponse.ok) {
          throw new Error('Failed to fetch hospitals');
        }
        const hospitalsData = await hospitalsResponse.json();
        setHospitals(hospitalsData);
        
        // Fetch doctors - use public endpoint
        const doctorsResponse = await fetch('http://localhost:5000/api/dashboard/public/doctors');
        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);
        
        // Extract unique specializations
        const uniqueSpecializations = [...new Set(doctorsData.map(doctor => doctor.specialization))].filter(Boolean);
        setSpecializations(uniqueSpecializations.sort());
        
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load doctors information. Please try again later.');
        
        // Fallback data for hospitals
        setHospitals([
          { _id: '1', name: 'MedAccess General Hospital', location: 'Downtown Medical District' },
          { _id: '2', name: 'City Memorial Hospital', location: 'Central Avenue, North Side' },
          { _id: '3', name: 'Westside Medical Center', location: 'West District, Health Avenue' }
        ]);
        
        // Fallback data for doctors
        const fallbackDoctors = [
          {
            _id: '1',
            fullName: 'Dr. Sarah Johnson',
            specialization: 'Cardiology',
            hospitalId: '1',
            hospitalName: 'MedAccess General Hospital',
            experience: 8,
            qualification: 'MD, FACC',
            availabilityStatus: 'Available',
            profilePicture: 'https://cdn.pixabay.com/photo/2017/01/31/22/32/doctor-2027768_1280.png'
          },
          {
            _id: '2',
            fullName: 'Dr. Michael Chen',
            specialization: 'Neurology',
            hospitalId: '2',
            hospitalName: 'City Memorial Hospital',
            experience: 12,
            qualification: 'MD, PhD',
            availabilityStatus: 'Unavailable',
            profilePicture: 'https://cdn.pixabay.com/photo/2020/11/03/15/31/doctor-5710177_1280.png'
          },
          {
            _id: '3',
            fullName: 'Dr. Emily Rodriguez',
            specialization: 'Pediatrics',
            hospitalId: '3',
            hospitalName: 'Westside Medical Center',
            experience: 6,
            qualification: 'MD, FAAP',
            availabilityStatus: 'Available',
            profilePicture: 'https://cdn.pixabay.com/photo/2022/09/08/03/39/doctor-7439967_1280.png'
          },
          {
            _id: '4',
            fullName: 'Dr. James Wilson',
            specialization: 'Orthopedics',
            hospitalId: '1',
            hospitalName: 'MedAccess General Hospital',
            experience: 15,
            qualification: 'MD, FAAOS',
            availabilityStatus: 'Available',
            profilePicture: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/nurse-2141808_1280.png'
          },
          {
            _id: '5',
            fullName: 'Dr. Lisa Patel',
            specialization: 'Dermatology',
            hospitalId: '2',
            hospitalName: 'City Memorial Hospital',
            experience: 9,
            qualification: 'MD, FAAD',
            availabilityStatus: 'Available',
            profilePicture: 'https://cdn.pixabay.com/photo/2022/09/08/03/54/doctor-7439987_1280.png'
          }
        ];
        
        setDoctors(fallbackDoctors);
        
        // Extract unique specializations from fallback data
        const uniqueSpecializations = [...new Set(fallbackDoctors.map(doctor => doctor.specialization))].filter(Boolean);
        setSpecializations(uniqueSpecializations.sort());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHospitalSelect = (hospital) => {
    if (selectedHospital && selectedHospital._id === hospital._id) {
      setSelectedHospital(null); // Unselect if already selected
    } else {
      setSelectedHospital(hospital);
    }
  };

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value);
  };

  const handleResetFilters = () => {
    setSelectedHospital(null);
    setSelectedSpecialization('');
    setSearchQuery('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filter doctors based on search query, selected hospital, and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase());
                         
    const matchesHospital = selectedHospital ? doctor.hospitalId === selectedHospital._id : true;
    
    const matchesSpecialization = selectedSpecialization ? 
                                 doctor.specialization === selectedSpecialization : true;
                                 
    return matchesSearch && matchesHospital && matchesSpecialization;
  });

  return (
    <div className="hospital-doctors-page">
      <div className="doctors-header">
        <h1><FaUserMd /> Hospital Doctors</h1>
        <div className="header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search doctors by name, specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="filter-toggle-btn" onClick={toggleFilters}>
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className={`filters-container ${showFilters ? 'show' : ''}`}>
        <div className="filters-content">
          <div className="filter-section">
            <h3>Filter by Specialization</h3>
            <select
              value={selectedSpecialization}
              onChange={handleSpecializationChange}
              className="specialization-select"
            >
              <option value="">All Specializations</option>
              {specializations.map((specialization, index) => (
                <option key={index} value={specialization}>
                  {specialization}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-section">
            <h3>Filter by Hospital</h3>
            <p className="filter-hint">Select a hospital below to filter doctors</p>
            <div className="hospital-filters">
              {hospitals.map(hospital => (
                <div 
                  key={hospital._id} 
                  className={`hospital-filter-item ${selectedHospital?._id === hospital._id ? 'selected' : ''}`}
                  onClick={() => handleHospitalSelect(hospital)}
                >
                  <FaHospital className="hospital-icon" />
                  <div className="hospital-filter-details">
                    <span className="hospital-name">{hospital.name}</span>
                    <span className="hospital-location">{hospital.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="reset-filters-btn" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading doctors information...</p>
        </div>
      ) : (
        <div className="doctors-results">
          <div className="results-header">
            <h2>
              {selectedHospital 
                ? `Doctors at ${selectedHospital.name}` 
                : selectedSpecialization 
                  ? `${selectedSpecialization} Specialists` 
                  : 'All Hospital Doctors'}
            </h2>
            <span className="results-count">{filteredDoctors.length} doctors found</span>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="no-results">
              <FaUserMd className="no-results-icon" />
              <p>No doctors match your search criteria. Try adjusting your filters.</p>
              {(selectedHospital || selectedSpecialization || searchQuery) && (
                <button className="reset-filters-btn" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map(doctor => (
                <div key={doctor._id} className="doctor-card">
                  <div className="doctor-photo">
                    <img 
                      src={doctor.profilePicture || 'https://cdn.pixabay.com/photo/2022/09/08/03/39/doctor-7439967_1280.png'} 
                      alt={doctor.fullName} 
                    />
                    <span className={`status-badge ${doctor.availabilityStatus === 'Available' ? 'available' : 'unavailable'}`}>
                      {doctor.availabilityStatus}
                    </span>
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.fullName}</h3>
                    <p className="doctor-specialization">{doctor.specialization}</p>
                    <p className="doctor-hospital">
                      <FaHospital className="hospital-icon" />
                      {doctor.hospitalName}
                    </p>
                    <div className="doctor-details">
                      <div className="detail-row">
                        <span className="detail-label">Experience:</span>
                        <span>{doctor.experience} years</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Qualification:</span>
                        <span>{doctor.qualification}</span>
                      </div>
                    </div>
                    <div className="doctor-actions">
                      <a href={`/doctors/${doctor._id}`} className="view-profile-btn">
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalDoctorsPage; 