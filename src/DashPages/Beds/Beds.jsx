import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBed, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import './Beds.css';

const Beds = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bedType: '',
    totalBeds: 0,
    occupiedBeds: 0,
    pricePerDay: 0,
    wardSectionName: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const bedTypes = ['ICU', 'General Ward', 'Private Room', 'Semi-Private Room', 'Emergency', 'Maternity', 'Pediatric', 'Psychiatric'];

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to view this page');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/beds', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBeds(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching beds:", err);
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Authentication error. Please log in again.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to load bed data. Please try again later.');
          // Fallback data
          setBeds([
            {
              _id: '1',
              bedType: 'ICU',
              totalBeds: 20,
              occupiedBeds: 15,
              availableBeds: 5,
              pricePerDay: 5000,
              wardSectionName: 'ICU Wing A'
            },
            {
              _id: '2',
              bedType: 'General Ward',
              totalBeds: 50,
              occupiedBeds: 30,
              availableBeds: 20,
              pricePerDay: 1500,
              wardSectionName: 'General Ward 1'
            },
            {
              _id: '3',
              bedType: 'Private Room',
              totalBeds: 15,
              occupiedBeds: 7,
              availableBeds: 8,
              pricePerDay: 3500,
              wardSectionName: 'Private Wing'
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBeds();
  }, [navigate]);

  const resetForm = () => {
    setFormData({
      bedType: '',
      totalBeds: 0,
      occupiedBeds: 0,
      pricePerDay: 0,
      wardSectionName: ''
    });
    setEditingId(null);
  };

  const handleShowForm = (bed = null) => {
    if (bed) {
      setFormData({
        bedType: bed.bedType,
        totalBeds: bed.totalBeds,
        occupiedBeds: bed.occupiedBeds,
        pricePerDay: bed.pricePerDay,
        wardSectionName: bed.wardSectionName || ''
      });
      setEditingId(bed._id);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'totalBeds' || name === 'occupiedBeds' || name === 'pricePerDay' 
        ? Number(value) 
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to perform this action');
      navigate('/login');
      return;
    }

    try {
      const bedData = {
        ...formData,
        availableBeds: formData.totalBeds - formData.occupiedBeds
      };
      
      let response;
      
      if (editingId) {
        // Update existing bed
        response = await axios.put(`http://localhost:5000/api/beds/${editingId}`, bedData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBeds(beds.map(bed => 
          bed._id === editingId ? { ...response.data } : bed
        ));
      } else {
        // Add new bed
        response = await axios.post('http://localhost:5000/api/beds/add', bedData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBeds([...beds, response.data]);
      }
      
      handleCloseForm();
    } catch (err) {
      console.error("Error saving bed:", err);
      setError('Failed to save bed data. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bed section?')) {
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to perform this action');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/beds/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setBeds(beds.filter(bed => bed._id !== id));
    } catch (err) {
      console.error("Error deleting bed:", err);
      setError('Failed to delete bed. Please try again.');
    }
  };

  const filteredBeds = beds.filter(bed => {
    const bedType = bed.bedType?.toLowerCase() || '';
    const wardSection = bed.wardSectionName?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return bedType.includes(query) || wardSection.includes(query);
  });

  const getOccupancyStatus = (total, occupied) => {
    const percentage = (occupied / total) * 100;
    
    if (percentage >= 90) return 'critical';
    if (percentage >= 70) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  if (error && error.includes('Authentication')) {
    return (
      <div className="auth-error-container">
        <div className="auth-error-message">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <div className="loading-spinner"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="beds-container">
      <div className="beds-header">
        <h1><FaBed /> Hospital Beds Management</h1>
        <div className="header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search beds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-bed-btn" onClick={() => handleShowForm()}>
            <FaPlus /> Add Bed Section
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading bed information...</p>
        </div>
      ) : (
        <>
          {showForm && (
            <div className="bed-form-container">
              <form onSubmit={handleSubmit} className="bed-form">
                <h3>{editingId ? 'Edit Bed Section' : 'Add New Bed Section'}</h3>
                
                <div className="form-group">
                  <label htmlFor="bedType">Bed Type</label>
                  <select 
                    id="bedType" 
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Bed Type</option>
                    {bedTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="wardSectionName">Ward/Section Name</label>
                  <input 
                    type="text" 
                    id="wardSectionName" 
                    name="wardSectionName"
                    value={formData.wardSectionName}
                    onChange={handleChange}
                    placeholder="e.g. East Wing, Ward 3"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="totalBeds">Total Beds</label>
                    <input 
                      type="number" 
                      id="totalBeds" 
                      name="totalBeds"
                      value={formData.totalBeds}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="occupiedBeds">Occupied Beds</label>
                    <input 
                      type="number" 
                      id="occupiedBeds" 
                      name="occupiedBeds"
                      value={formData.occupiedBeds}
                      onChange={handleChange}
                      min="0"
                      max={formData.totalBeds}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="pricePerDay">Price Per Day</label>
                    <input 
                      type="number" 
                      id="pricePerDay" 
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={handleCloseForm}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingId ? 'Update Bed Section' : 'Add Bed Section'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="beds-grid">
            {filteredBeds.length === 0 ? (
              <div className="no-beds-message">
                <FaBed className="empty-icon" />
                <p>No bed sections found. Add your first bed section using the button above.</p>
              </div>
            ) : (
              filteredBeds.map(bed => {
                const availableBeds = bed.totalBeds - bed.occupiedBeds;
                const occupancyStatus = getOccupancyStatus(bed.totalBeds, bed.occupiedBeds);
                
                return (
                  <div key={bed._id} className={`bed-card ${occupancyStatus}`}>
                    <div className="bed-header">
                      <h3>{bed.bedType}</h3>
                      {bed.wardSectionName && <span className="ward-name">{bed.wardSectionName}</span>}
                    </div>
                    
                    <div className="bed-details">
                      <div className="bed-status">
                        <div className="occupancy-bar">
                          <div 
                            className="occupancy-fill" 
                            style={{ width: `${(bed.occupiedBeds / bed.totalBeds) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bed-counts">
                          <span className="total-beds">Total: {bed.totalBeds}</span>
                          <span className="available-beds">Available: {availableBeds}</span>
                          <span className="occupied-beds">Occupied: {bed.occupiedBeds}</span>
                        </div>
                      </div>
                      
                      <div className="price-info">
                        <span className="price-label">Price per day:</span>
                        <span className="price-value">${bed.pricePerDay.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="bed-actions">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleShowForm(bed)}
                        title="Edit Bed Section"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(bed._id)}
                        title="Delete Bed Section"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Beds; 