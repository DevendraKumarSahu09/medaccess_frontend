import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSyncAlt, FaDownload, FaTint } from 'react-icons/fa';
import axios from 'axios';
import './BloodBank.css';

const BloodBank = () => {
  const [bloodInventory, setBloodInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'A+',
    units: 0,
    notes: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const getStatusClass = (units) => {
    if (units <= 3) return "critical";
    if (units <= 7) return "low";
    return "normal";
  };
  
  const getStatusText = (units) => {
    if (units <= 3) return "Critical";
    if (units <= 7) return "Low";
    return "Normal";
  };

  useEffect(() => {
    const fetchBloodInventory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to view this page');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/dashboard/blood-inventory', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBloodInventory(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blood inventory:", err);
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Authentication error. Please log in again.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to load blood inventory. Please try again later.');
          // Use fallback data if API fails
          setBloodInventory([
            { type: 'A+', units: 12 },
            { type: 'A-', units: 5 },
            { type: 'B+', units: 8 },
            { type: 'B-', units: 3 },
            { type: 'AB+', units: 2 },
            { type: 'AB-', units: 1 },
            { type: 'O+', units: 15 },
            { type: 'O-', units: 6 }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBloodInventory();
  }, [navigate]);

  const resetForm = () => {
    setFormData({
      type: 'A+',
      units: 0,
      notes: ''
    });
    setEditingIndex(null);
  };

  const handleShowForm = (index = null) => {
    if (index !== null) {
      const blood = bloodInventory[index];
      setFormData({
        type: blood.type,
        units: blood.units,
        notes: blood.notes || ''
      });
      setEditingIndex(index);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For now, we're just updating the state locally
    // In a real application, you would send this to your API endpoint
    
    if (editingIndex !== null) {
      // Update existing blood inventory item
      const updatedInventory = [...bloodInventory];
      updatedInventory[editingIndex] = {
        ...updatedInventory[editingIndex],
        units: Number(formData.units),
        notes: formData.notes
      };
      setBloodInventory(updatedInventory);
    } else {
      // Add new blood inventory item
      // Check if blood type already exists
      const existingIndex = bloodInventory.findIndex(item => item.type === formData.type);
      
      if (existingIndex >= 0) {
        // Update existing type
        const updatedInventory = [...bloodInventory];
        updatedInventory[existingIndex] = {
          ...updatedInventory[existingIndex],
          units: Number(formData.units),
          notes: formData.notes
        };
        setBloodInventory(updatedInventory);
      } else {
        // Add new type
        setBloodInventory([
          ...bloodInventory,
          {
            type: formData.type,
            units: Number(formData.units),
            notes: formData.notes
          }
        ]);
      }
    }
    
    setShowForm(false);
    resetForm();
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Blood Type,Units,Status\n"
      + bloodInventory.map(item => 
          `${item.type},${item.units},${getStatusText(item.units)}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `blood-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="blood-bank-container">
      <div className="blood-bank-header">
        <h1><FaTint /> Blood Bank Management</h1>
        <div className="header-actions">
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            <FaSyncAlt /> Refresh
          </button>
          <button className="export-btn" onClick={exportToCSV}>
            <FaDownload /> Export
          </button>
          <button className="add-blood-btn" onClick={() => handleShowForm()}>
            <FaPlus /> Update Inventory
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blood inventory...</p>
        </div>
      ) : (
        <>
          {showForm && (
            <div className="blood-form-container">
              <form onSubmit={handleSubmit} className="blood-form">
                <h3>{editingIndex !== null ? 'Update Blood Units' : 'Add/Update Blood Units'}</h3>
                
                <div className="form-group">
                  <label htmlFor="bloodType">Blood Type</label>
                  <select 
                    id="bloodType" 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    disabled={editingIndex !== null}
                  >
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="units">Units Available</label>
                  <input 
                    type="number" 
                    id="units" 
                    value={formData.units}
                    onChange={(e) => setFormData({...formData, units: e.target.value})}
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea 
                    id="notes" 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="blood-inventory-grid">
            {bloodInventory.length === 0 ? (
              <div className="no-inventory-message">
                <FaTint className="empty-icon" />
                <p>No blood inventory found. Add inventory using the button above.</p>
              </div>
            ) : (
              bloodInventory.map((item, index) => (
                <div 
                  key={item.type} 
                  className={`blood-inventory-card ${getStatusClass(item.units)}`}
                  onClick={() => handleShowForm(index)}
                >
                  <div className="blood-type">{item.type}</div>
                  <div className="blood-units">{item.units} units</div>
                  <div className="blood-status">{getStatusText(item.units)}</div>
                  {item.notes && <div className="blood-notes">{item.notes}</div>}
                </div>
              ))
            )}
          </div>

          <div className="blood-inventory-status-info">
            <div className="status-item normal">
              <span className="status-dot"></span>
              <span>Normal (8+ units)</span>
            </div>
            <div className="status-item low">
              <span className="status-dot"></span>
              <span>Low (4-7 units)</span>
            </div>
            <div className="status-item critical">
              <span className="status-dot"></span>
              <span>Critical (0-3 units)</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BloodBank; 