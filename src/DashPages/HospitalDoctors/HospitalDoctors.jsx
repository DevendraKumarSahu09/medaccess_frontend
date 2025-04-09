import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, UserPlus, Users } from 'lucide-react';
import axios from 'axios';
import './HospitalDoctors.css';

const HospitalDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    specialization: '',
    experience: '',
    qualification: '',
    contactNumber: '',
    email: '',
    visitingHours: '',
    fee: '',
    availabilityStatus: 'Available',
    profilePicture: null
  });
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch doctors data
  useEffect(() => {
    fetchDoctors();
  }, []);

    const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://medaccess-backend.onrender.com/api/hospitaldoctors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      specialization: '',
      experience: '',
      qualification: '',
      contactNumber: '',
      email: '',
      visitingHours: '',
      fee: '',
      availabilityStatus: 'Available',
      profilePicture: null
    });
    setEditingDoctorId(null);
    setPreviewUrl(null);
    setErrors({});
  };

  const handleAddNewClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (files[0]) {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Name is required";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (!formData.contactNumber || !/^\d{10}$/.test(formData.contactNumber)) 
      newErrors.contactNumber = "Valid 10-digit contact number is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.visitingHours) newErrors.visitingHours = "Visiting hours are required";
    if (!formData.fee) newErrors.fee = "Fee is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        const formDataToSend = new FormData();
        
        // Append all form fields to FormData
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null) {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        let response;
        
        if (editingDoctorId) {
          // Update existing doctor
          response = await axios.put(
            `https://medaccess-backend.onrender.com/api/hospitaldoctors/${editingDoctorId}`,
            formDataToSend,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          // Update the doctors list with updated doctor
          setDoctors(doctors.map(doc => 
            doc._id === editingDoctorId ? response.data : doc
          ));
        } else {
          // Add new doctor
          response = await axios.post(
            'https://medaccess-backend.onrender.com/api/hospitaldoctors/addhdoctor',
            formDataToSend,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          // Add new doctor to the list
          setDoctors([...doctors, response.data]);
        }
        
        // Reset and close form
        setShowForm(false);
        resetForm();
        fetchDoctors(); // Refresh the data
      } catch (error) {
        console.error('Error saving doctor:', error);
        alert('Failed to save doctor. Please try again.');
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      experience: doctor.experience,
      qualification: doctor.qualification,
      contactNumber: doctor.contactNumber,
      email: doctor.email,
      visitingHours: doctor.visitingHours,
      fee: doctor.fee,
      availabilityStatus: doctor.availabilityStatus,
      profilePicture: null // Can't set the file input value for security reasons
    });
    
    setPreviewUrl(doctor.profilePicture);
    setEditingDoctorId(doctor._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://medaccess-backend.onrender.com/api/hospitaldoctors/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
        // Remove doctor from the list
      setDoctors(doctors.filter(doctor => doctor._id !== id));
      } catch (error) {
        console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
      }
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => {
    const fullName = doctor.fullName || '';
    const specialization = doctor.specialization || '';
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           specialization.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="hospital-doctors-container">
      <div className="page-header">
        <div className="title-section">
          <h1><Users className="header-icon" /> Hospital Doctors</h1>
          <p>Manage your hospital's doctors and medical staff</p>
        </div>
        
        <div className="actions-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-doctor-btn" onClick={handleAddNewClick}>
            <UserPlus size={20} />
            Add New Doctor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading doctors...</p>
        </div>
      ) : (
        <>
          {doctors.length === 0 ? (
            <div className="empty-state">
              <Users size={60} className="empty-icon" />
              <h2>No doctors added yet</h2>
              <p>Add your hospital doctors to manage them in one place</p>
              <button className="add-first-doctor-btn" onClick={handleAddNewClick}>
                <PlusCircle size={20} />
                Add Your First Doctor
              </button>
            </div>
          ) : (
            <div className="doctors-table-container">
              <table className="doctors-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Contact</th>
                    <th>Visiting Hours</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor, index) => (
                    <tr key={doctor._id || `doctor-${index}`}>
                      <td className="doctor-info">
                        <div className="doctor-avatar" style={{
                          backgroundImage: doctor.profilePicture ? 
                            `url(${doctor.profilePicture})` : 
                            'none'
                        }}>
                          {!doctor.profilePicture && (doctor.fullName ? doctor.fullName.charAt(0) : '?')}
                        </div>
                        <div className="doctor-details">
                          <h3>{doctor.fullName || 'Unnamed Doctor'}</h3>
                          <span>{doctor.qualification || ''}</span>
                        </div>
                      </td>
                      <td>{doctor.specialization || ''}</td>
                      <td>{doctor.experience ? `${doctor.experience} years` : ''}</td>
                      <td>
                        <div className="contact-info">
                          <div>{doctor.contactNumber || ''}</div>
                          <div className="doctor-email">{doctor.email || ''}</div>
                        </div>
                      </td>
                      <td>{doctor.visitingHours || ''}</td>
                      <td>
                        <span className={`status-badge ${(doctor.availabilityStatus || 'unavailable').toLowerCase()}`}>
                          {doctor.availabilityStatus || 'Unavailable'}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="edit-btn" onClick={() => handleEdit(doctor)}>
                          <Edit size={16} />
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(doctor._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Doctor Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button className="close-btn" onClick={handleFormClose}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="doctor-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="specialization">Specialization *</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={errors.specialization ? 'error' : ''}
                  />
                  {errors.specialization && <span className="error-text">{errors.specialization}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience">Experience (Years) *</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    className={errors.experience ? 'error' : ''}
                  />
                  {errors.experience && <span className="error-text">{errors.experience}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="qualification">Qualification *</label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={errors.qualification ? 'error' : ''}
                  />
                  {errors.qualification && <span className="error-text">{errors.qualification}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number *</label>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className={errors.contactNumber ? 'error' : ''}
                  />
                  {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="visitingHours">Visiting Hours *</label>
                  <input
                    type="text"
                    id="visitingHours"
                    name="visitingHours"
                    value={formData.visitingHours}
                    onChange={handleChange}
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                    className={errors.visitingHours ? 'error' : ''}
                  />
                  {errors.visitingHours && <span className="error-text">{errors.visitingHours}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="fee">Consultation Fee *</label>
                  <input
                    type="number"
                    id="fee"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    min="0"
                    className={errors.fee ? 'error' : ''}
                  />
                  {errors.fee && <span className="error-text">{errors.fee}</span>}
                    </div>
                
                <div className="form-group">
                  <label htmlFor="availabilityStatus">Availability Status *</label>
                  <select
                    id="availabilityStatus"
                    name="availabilityStatus"
                    value={formData.availabilityStatus}
                    onChange={handleChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                    </div>
                
                <div className="form-group photo-upload">
                  <label>Profile Photo</label>
                  <div className="upload-container">
                    {previewUrl && (
                      <div className="image-preview">
                        <img src={previewUrl} alt="Preview" />
                    </div>
                    )}
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    <label htmlFor="profilePicture" className="file-upload-btn">
                      {previewUrl ? 'Change Photo' : 'Upload Photo'}
                    </label>
                  </div>
                </div>
                </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleFormClose}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={submitLoading}>
                  {submitLoading ? 'Saving...' : editingDoctorId ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDoctors; 