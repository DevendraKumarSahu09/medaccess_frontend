import React, { useEffect, useState } from 'react';
import { FaPills, FaSearch, FaHospital, FaPhone, FaMapMarkerAlt, FaBriefcaseMedical } from 'react-icons/fa';
import './PharmacyPage.css';

const PharmacyPage = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [medicationsLoading, setMedicationsLoading] = useState(false);

  useEffect(() => {
    // Fetch pharmacy data from the backend
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        // Updated endpoint to use public route
        const response = await fetch('http://localhost:5000/api/dashboard/public/pharmacies');
        if (!response.ok) {
          throw new Error('Failed to fetch pharmacy data');
        }
        const data = await response.json();
        setPharmacies(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching pharmacy data:", err);
        setError('Failed to load pharmacies. Please try again later.');
        // Fallback data
        setPharmacies([
          {
            _id: '1',
            name: 'MedAccess Central Pharmacy',
            hospital: 'MedAccess General Hospital',
            address: '123 Health Street, Medical District',
            contact: '555-123-4567'
          },
          {
            _id: '2',
            name: 'City Hospital Pharmacy',
            hospital: 'City General Hospital',
            address: '456 Care Avenue, Downtown',
            contact: '555-987-6543'
          },
          {
            _id: '3',
            name: 'Westside Medical Center Pharmacy',
            hospital: 'Westside Medical Center',
            address: '789 Wellness Blvd, West District',
            contact: '555-345-6789'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  useEffect(() => {
    // Fetch medications when a pharmacy is selected
    const fetchMedications = async () => {
      if (!selectedPharmacy) return;
      
      try {
        setMedicationsLoading(true);
        // Updated endpoint to use public route
        const response = await fetch(`http://localhost:5000/api/dashboard/public/pharmacies/${selectedPharmacy._id}/medications`);
        if (!response.ok) {
          throw new Error('Failed to fetch medications');
        }
        const data = await response.json();
        setMedications(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching medications:", err);
        setError('Failed to load medications. Please try again later.');
        // Fallback data
        setMedications([
          {
            name: 'Amoxicillin',
            category: 'Antibiotic',
            price: 15.99,
            inStock: true,
            dosage: '500mg',
            description: 'Used to treat a variety of bacterial infections.'
          },
          {
            name: 'Lisinopril',
            category: 'Blood Pressure',
            price: 12.50,
            inStock: true,
            dosage: '10mg',
            description: 'Used to treat high blood pressure and heart failure.'
          },
          {
            name: 'Metformin',
            category: 'Diabetes',
            price: 8.75,
            inStock: true,
            dosage: '500mg',
            description: 'Used to treat type 2 diabetes.'
          },
          {
            name: 'Atorvastatin',
            category: 'Cholesterol',
            price: 22.99,
            inStock: false,
            dosage: '20mg',
            description: 'Used to lower cholesterol and triglycerides in the blood.'
          }
        ]);
      } finally {
        setMedicationsLoading(false);
      }
    };

    fetchMedications();
  }, [selectedPharmacy]);

  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const name = pharmacy.name?.toLowerCase() || '';
    const hospital = pharmacy.hospital?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || hospital.includes(query);
  });

  const filteredMedications = medications.filter(medication => {
    const name = medication.name?.toLowerCase() || '';
    const category = medication.category?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || category.includes(query);
  });

  return (
    <div className="pharmacy-page">
      <div className="pharmacy-header">
        <h1><FaPills /> Hospital Pharmacies</h1>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search pharmacies or medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && !selectedPharmacy ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading pharmacies...</p>
        </div>
      ) : (
        <div className="pharmacy-content">
          <div className="pharmacy-list">
            <h2><FaHospital /> Hospital Pharmacies</h2>
            {filteredPharmacies.length === 0 ? (
              <p className="no-results">No pharmacies match your search.</p>
            ) : (
              <div className="pharmacy-cards">
                {filteredPharmacies.map(pharmacy => (
                  <div 
                    key={pharmacy._id} 
                    className={`pharmacy-card ${selectedPharmacy?._id === pharmacy._id ? 'selected' : ''}`}
                    onClick={() => handlePharmacySelect(pharmacy)}
                  >
                    <h3>{pharmacy.name || 'Unnamed Pharmacy'}</h3>
                    <p><FaHospital className="info-icon" /> {pharmacy.hospital || 'Unknown Hospital'}</p>
                    <p><FaMapMarkerAlt className="info-icon" /> {pharmacy.address || 'Address not available'}</p>
                    <p><FaPhone className="info-icon" /> {pharmacy.contact || 'Contact not available'}</p>
                    <button className="view-meds-btn">
                      <FaBriefcaseMedical /> View Medications
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPharmacy && (
            <div className="medications-section">
              <h2>Medications at {selectedPharmacy.name}</h2>
              
              {medicationsLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading medications...</p>
                </div>
              ) : filteredMedications.length === 0 ? (
                <p className="no-results">No medications match your search.</p>
              ) : (
                <div className="medications-grid">
                  {filteredMedications.map((medication, index) => (
                    <div key={medication._id || index} className="medication-card">
                      <div className="medication-header">
                        <h3>{medication.name || 'Unnamed Medication'}</h3>
                        <span className={`stock-status ${medication.inStock ? 'in-stock' : 'out-of-stock'}`}>
                          {medication.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="medication-details">
                        <p><strong>Category:</strong> {medication.category || 'Uncategorized'}</p>
                        <p><strong>Dosage:</strong> {medication.dosage || 'Not specified'}</p>
                        {medication.price !== undefined && (
                          <p><strong>Price:</strong> ${typeof medication.price === 'number' ? medication.price.toFixed(2) : medication.price}</p>
                        )}
                        {medication.description && (
                          <p className="medication-description">{medication.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PharmacyPage; 