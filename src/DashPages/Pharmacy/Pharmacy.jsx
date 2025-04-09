import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaPills, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './Pharmacy.css';
import axios from 'axios';

const Pharmacy = () => {
  const [pharmacy, setPharmacy] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPharmacyForm, setShowPharmacyForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMedication, setCurrentMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    operatingHours: {
      open: '09:00',
      close: '18:00'
    }
  });
  const [medicationData, setMedicationData] = useState({
    name: '',
    category: '',
    price: '',
    dosage: '',
    inStock: true,
    description: '',
    brand: '',
    quantity: '',
    expiryDate: ''
  });

  // Fetch pharmacy and medications data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get auth token
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You need to be logged in to access this page');
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        
        try {
          // Fetch pharmacy data
          const pharmacyResponse = await axios.get('http://localhost:5000/api/pharmacy', config);
          
          if (pharmacyResponse.data.success) {
            setPharmacy(pharmacyResponse.data.data);
            setFormData({
              name: pharmacyResponse.data.data.name || '',
              address: pharmacyResponse.data.data.address || '',
              contact: pharmacyResponse.data.data.contact || '',
              operatingHours: pharmacyResponse.data.data.operatingHours || {
                open: '09:00',
                close: '18:00'
              }
            });
          }
          
          // Fetch medications
          const medicationsResponse = await axios.get('http://localhost:5000/api/pharmacy/medications', config);
          
          if (medicationsResponse.data.success) {
            setMedications(medicationsResponse.data.data || []);
          }
        } catch (fetchErr) {
          console.error("API Error:", fetchErr);
          
          if (fetchErr.response && fetchErr.response.status === 404) {
            // No pharmacy found yet, that's okay
            setPharmacy(null);
          } else {
            setError('Failed to load pharmacy data. Please try again.');
          }
        }
      } catch (err) {
        console.error("General Error:", err);
        setError('Failed to process pharmacy data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle pharmacy form input changes
  const handlePharmacyInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'openTime' || name === 'closeTime') {
      setFormData({
        ...formData,
        operatingHours: {
          ...formData.operatingHours,
          [name === 'openTime' ? 'open' : 'close']: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle medication form input changes
  const handleMedicationInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setMedicationData({
      ...medicationData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Submit pharmacy form
  const handlePharmacySubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      // Basic validation
      if (!formData.name || !formData.address || !formData.contact) {
        setError('Please fill in all required fields');
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to create a pharmacy');
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Show loading state
      setLoading(true);
      
      console.log("Sending pharmacy creation request with token:", token);
      console.log("Form data:", formData);
      
      const response = await axios.post(
        'http://localhost:5000/api/pharmacy/create',
        formData,
        config
      );
      
      if (response.data.success) {
        setPharmacy(response.data.data);
        setShowPharmacyForm(false);
        setError(null);
        
        // Show success message
        alert('Pharmacy created successfully!');
      }
    } catch (err) {
      console.error("Error creating pharmacy:", err);
      
      if (err.response) {
        console.error("Error response:", err.response.data);
        setError(err.response.data.message || 'Failed to create pharmacy. Please try again.');
      } else {
        setError('Failed to create pharmacy. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit medication form
  const handleMedicationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      let response;
      
      if (currentMedication) {
        // Update existing medication
        response = await axios.put(
          `http://localhost:5000/api/pharmacy/medications/${currentMedication._id}`,
          medicationData,
          config
        );
      } else {
        // Add new medication
        response = await axios.post(
          'http://localhost:5000/api/pharmacy/medications/add',
          medicationData,
          config
        );
      }
      
      if (response.data.success) {
        // Refresh medications list
        const medicationsResponse = await axios.get(
          'http://localhost:5000/api/pharmacy/medications',
          config
        );
        
        if (medicationsResponse.data.success) {
          setMedications(medicationsResponse.data.data || []);
        }
        
        // Reset form
        setMedicationData({
          name: '',
          category: '',
          price: '',
          dosage: '',
          inStock: true,
          description: '',
          brand: '',
          quantity: '',
          expiryDate: ''
        });
        
        setCurrentMedication(null);
        setShowMedicationForm(false);
        setError(null);
      }
    } catch (err) {
      console.error("Error with medication:", err);
      if (err.response && err.response.data) {
        console.error("Error response:", err.response.data);
        setError(err.response.data.message || 'Failed to save medication. Please try again.');
      } else {
      setError('Failed to save medication. Please try again.');
      }
    }
  };

  // Delete medication
  const handleDeleteMedication = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.delete(
        `http://localhost:5000/api/pharmacy/medications/${id}`,
        config
      );
      
      if (response.data.success) {
        // Remove from state
        setMedications(medications.filter(med => med._id !== id));
      }
    } catch (err) {
      console.error("Error deleting medication:", err);
      if (err.response && err.response.data) {
        console.error("Error response:", err.response.data);
        setError(err.response.data.message || 'Failed to delete medication. Please try again.');
      } else {
      setError('Failed to delete medication. Please try again.');
      }
    }
  };

  // Edit medication (populate form with medication data)
  const handleEditMedication = (medication) => {
    setCurrentMedication(medication);
    setMedicationData({
      name: medication.name || '',
      category: medication.category || '',
      price: medication.price || '',
      dosage: medication.dosage || '',
      inStock: medication.inStock !== undefined ? medication.inStock : true,
      description: medication.description || '',
      brand: medication.brand || '',
      quantity: medication.quantity || '',
      expiryDate: medication.expiryDate ? new Date(medication.expiryDate).toISOString().split('T')[0] : ''
    });
    setShowMedicationForm(true);
  };

  // Filter medications based on search query
  const filteredMedications = medications.filter(medication => {
    const name = medication.name?.toLowerCase() || '';
    const category = medication.category?.toLowerCase() || '';
    const brand = medication.brand?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || category.includes(query) || brand.includes(query);
  });

  // Render loading state
  if (loading) {
    return (
      <div className="pharmacy-dashboard loading-container">
        <div className="loading-spinner"></div>
        <p>Loading pharmacy data...</p>
      </div>
    );
  }

  return (
    <div className="pharmacy-dashboard">
      <div className="dashboard-header">
        <h1><FaPills /> Pharmacy Management</h1>
        <div className="header-actions">
          {pharmacy ? (
            <button 
              className="primary-button"
              onClick={() => setShowPharmacyForm(true)}
            >
              <FaEdit /> Edit Pharmacy
            </button>
          ) : (
            <button 
              className="primary-button"
              onClick={() => setShowPharmacyForm(true)}
            >
              <FaPlus /> Create Pharmacy
            </button>
          )}
          
          {pharmacy && (
            <button 
              className="secondary-button"
              onClick={() => setShowMedicationForm(true)}
            >
              <FaPlus /> Add Medication
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <div className="error-content">
            <p>{error}</p>
            <button className="close-error" onClick={() => setError(null)}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
      
      {showPharmacyForm && (
        <div className="form-container">
          <div className="form-header">
            <h2>{pharmacy ? 'Edit Pharmacy' : 'Create New Pharmacy'}</h2>
            <button 
              className="close-form"
              onClick={() => setShowPharmacyForm(false)}
            >
              <FaTimes />
            </button>
          </div>
          
          <form onSubmit={handlePharmacySubmit}>
            <div className="form-group">
              <label htmlFor="name">Pharmacy Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter pharmacy name"
                value={formData.name}
                onChange={handlePharmacyInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter pharmacy address"
                value={formData.address}
                onChange={handlePharmacyInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact">Contact Number</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="Enter contact number"
                value={formData.contact}
                onChange={handlePharmacyInputChange}
                required
                pattern="[0-9]+"
                title="Please enter a valid phone number (numbers only)"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="openTime">Opening Time</label>
                <input
                  type="time"
                  id="openTime"
                  name="openTime"
                  value={formData.operatingHours.open}
                  onChange={handlePharmacyInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="closeTime">Closing Time</label>
                <input
                  type="time"
                  id="closeTime"
                  name="closeTime"
                  value={formData.operatingHours.close}
                  onChange={handlePharmacyInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowPharmacyForm(false)}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : (pharmacy ? 'Update Pharmacy' : 'Create Pharmacy')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pharmacy Details Card */}
      {pharmacy && !showPharmacyForm && (
        <div className="pharmacy-details-card">
          <div className="card-header">
            <h2>{pharmacy.name}</h2>
          </div>
          <div className="card-body">
            <div className="detail-row">
              <span className="detail-label">Hospital:</span>
              <span>{pharmacy.hospital}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span>{pharmacy.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Contact:</span>
              <span>{pharmacy.contact}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Hours:</span>
              <span>
                {pharmacy.operatingHours ? 
                  `${pharmacy.operatingHours.open} - ${pharmacy.operatingHours.close}` : 
                  'Not specified'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Medications Section */}
      {pharmacy && (
        <div className="medications-section">
          <div className="section-header">
            <h2>Medications</h2>
            <div className="header-actions">
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search medications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="primary-button"
                onClick={() => {
                  setCurrentMedication(null);
                  setMedicationData({
                    name: '',
                    category: '',
                    price: '',
                    dosage: '',
                    inStock: true,
                    description: '',
                    brand: '',
                    quantity: '',
                    expiryDate: ''
                  });
                  setShowMedicationForm(true);
                }}
              >
                <FaPlus /> Add Medication
              </button>
            </div>
          </div>

          {/* Medication Form */}
          {showMedicationForm && (
            <div className="form-container">
              <h3>{currentMedication ? 'Edit Medication' : 'Add Medication'}</h3>
              <form onSubmit={handleMedicationSubmit}>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={medicationData.name}
                      onChange={handleMedicationInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={medicationData.category}
                      onChange={handleMedicationInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={medicationData.price}
                      onChange={handleMedicationInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label>Dosage</label>
                    <input
                      type="text"
                      name="dosage"
                      value={medicationData.dosage}
                      onChange={handleMedicationInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={medicationData.brand}
                      onChange={handleMedicationInputChange}
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={medicationData.quantity}
                      onChange={handleMedicationInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={medicationData.expiryDate}
                      onChange={handleMedicationInputChange}
                    />
                  </div>
                  
                  <div className="form-group half checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={medicationData.inStock}
                        onChange={handleMedicationInputChange}
                      />
                      In Stock
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={medicationData.description}
                    onChange={handleMedicationInputChange}
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    {currentMedication ? 'Update Medication' : 'Add Medication'}
                  </button>
                  <button 
                    type="button" 
                    className="secondary-button"
                    onClick={() => setShowMedicationForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Medications Table */}
          {filteredMedications.length > 0 ? (
            <div className="table-container">
              <table className="medications-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Dosage</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map(medication => (
                    <tr key={medication._id}>
                      <td>{medication.name}</td>
                      <td>{medication.category}</td>
                      <td>{medication.dosage}</td>
                      <td>${parseFloat(medication.price).toFixed(2)}</td>
                      <td>
                        <span className={`status-pill ${medication.inStock ? 'available' : 'unavailable'}`}>
                          {medication.inStock ? 
                            <><FaCheck /> In Stock</> : 
                            <><FaTimes /> Out of Stock</>}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="icon-button edit"
                          onClick={() => handleEditMedication(medication)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="icon-button delete"
                          onClick={() => handleDeleteMedication(medication._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FaPills className="empty-icon" />
              <p>No medications found. Click "Add Medication" to add your first medication.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
