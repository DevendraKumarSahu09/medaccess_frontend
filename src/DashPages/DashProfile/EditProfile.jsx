import React, { useState, useEffect } from 'react';
import { AlertCircle, Mail, Phone, MapPin, Globe, Upload } from 'lucide-react';
import './EditProfile.css';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        location: '',
        registrationNumber: '',
        hospitalProfilePhoto: null,
        websiteUrl: '',
        specializations: [],
        facilities: []
    });

    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [newSpecialization, setNewSpecialization] = useState('');
    const [newFacility, setNewFacility] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://medaccess-backend.onrender.com';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the JWT token to extract userId
                const payload = token.split('.')[1]; // Extract the payload (middle part)
                const decodedPayload = JSON.parse(atob(payload)); // Decode from base64
                setUserId(decodedPayload.userId); // Set userId from decoded token
                console.log('Decoded User ID:', decodedPayload.userId);
            } catch (error) {
                console.error('Error decoding token:', error);
                setError('Invalid token format');
            }
        } else {
            setError('Token not found in localStorage');
        }
    }, []); // Run once on component mount

    useEffect(() => {
        if (!userId) return; // Don't fetch data if userId is not available

        // Fetch hospital profile data when the component mounts
        const fetchHospitalData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Fetched hospital data:', data);
                
                // The response structure is different - data is directly returned, not in a hospital property
                if (data) {
                    // Get user data from the Hospital model
                    const userType = localStorage.getItem('userType');
                    if (userType !== 'hospital') {
                        setError('This profile editor is for hospitals only');
                        setIsLoading(false);
                        return;
                    }
                    
                    // Directly use the user data from the backend
                    // We need to fetch the complete hospital data since the profile endpoint doesn't return all fields
                    const hospitalResponse = await fetch(`${API_URL}/api/users/hospitals/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    
                    if (!hospitalResponse.ok) {
                        throw new Error(`HTTP error! Status: ${hospitalResponse.status}`);
                    }
                    
                    const hospitalData = await hospitalResponse.json();
                    console.log('Complete hospital data:', hospitalData);
                    
                    setFormData({
                        name: hospitalData.name || '',
                        email: hospitalData.email || '',
                        phoneNumber: hospitalData.phoneNumber || '',
                        address: hospitalData.address || '',
                        location: hospitalData.location || '',
                        hospitalProfilePhoto: hospitalData.hospitalProfilePhoto || null,
                        websiteUrl: hospitalData.websiteUrl || '',
                        specializations: hospitalData.specializations || [],
                        facilities: hospitalData.facilities || []
                    });
                    
                    setImagePreview(hospitalData.hospitalProfilePhoto);
                } else {
                    setError('Hospital data not found in response');
                }
            } catch (error) {
                console.error('Error fetching hospital data:', error);
                setError(`Error fetching hospital data: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHospitalData();
    }, [userId, API_URL]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Clear error and success messages when user makes changes
        setError(null);
        setSuccess(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();

        reader.onloadend = () => {
            // Ensure base64 string is set correctly
            setFormData({
                ...formData,
                hospitalProfilePhoto: reader.result,  // Base64 encoded image data
            });

            setImagePreview(reader.result);  // Set preview
        };

        reader.readAsDataURL(file);  // This converts the file into base64
    };

    const handleAddSpecialization = () => {
        if (newSpecialization.trim() !== '' && !formData.specializations.includes(newSpecialization.trim())) {
            setFormData({
                ...formData,
                specializations: [...formData.specializations, newSpecialization.trim()]
            });
            setNewSpecialization('');
        }
    };

    const handleRemoveSpecialization = (index) => {
        const updatedSpecializations = [...formData.specializations];
        updatedSpecializations.splice(index, 1);
        setFormData({
            ...formData,
            specializations: updatedSpecializations
        });
    };

    const handleAddFacility = () => {
        if (newFacility.trim() !== '' && !formData.facilities.includes(newFacility.trim())) {
            setFormData({
                ...formData,
                facilities: [...formData.facilities, newFacility.trim()]
            });
            setNewFacility('');
        }
    };

    const handleRemoveFacility = (index) => {
        const updatedFacilities = [...formData.facilities];
        updatedFacilities.splice(index, 1);
        setFormData({
            ...formData,
            facilities: updatedFacilities
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Parse the address string into components
            const addressString = formData.address;
            let addressParts = addressString.split(',').map(part => part.trim());
            
            // Create a properly formatted address object
            const addressObject = {
                street: addressParts[0] || '',
                city: addressParts[1] || formData.location || '',
                state: addressParts[2] || '',
                zipCode: addressParts[3] || ''
            };
            
            // Create a copy of formData with the correct field name for the profile photo
            const updatedData = {
                ...formData,
                // Convert address object to JSON string as expected by backend
                address: JSON.stringify(addressObject),
                // Map hospitalProfilePhoto to profilePhoto if backend expects that name
                profilePhoto: formData.hospitalProfilePhoto,
            };
            
            // Remove the original field to avoid confusion
            delete updatedData.hospitalProfilePhoto;
            
            console.log('Sending update data:', updatedData);
            
            const response = await fetch(`${API_URL}/api/auth/hospital/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSuccess('Profile updated successfully!');
            console.log('Update response:', data);
            
            // Update localStorage if needed
            if (data.updatedHospital && data.updatedHospital.name) {
                localStorage.setItem('userName', data.updatedHospital.name);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message || 'An error occurred while updating the profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !formData.name) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading profile data...</p>
            </div>
        );
    }

    return (
        <div className="edit-profile-container">
            <h2>Edit Hospital Profile</h2>
            
            {error && (
                <div className="error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}
            
            {success && (
                <div className="success">
                    <span>{success}</span>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Hospital Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">
                        <Mail size={16} className="form-icon" />
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">
                        <Phone size={16} className="form-icon" />
                        Contact Number
                    </label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">
                        <MapPin size={16} className="form-icon" />
                        Full Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Complete address with street, city, state, and zip code"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location (City)</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="websiteUrl">
                        <Globe size={16} className="form-icon" />
                        Website URL
                    </label>
                    <input
                        type="url"
                        id="websiteUrl"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                        placeholder="https://www.yourhospital.com"
                    />
                </div>

                <div className="form-group">
                    <label>Specializations</label>
                    <div className="tags-container">
                        {formData.specializations.map((spec, index) => (
                            <div key={index} className="tag">
                                <span>{spec}</span>
                                <button 
                                    type="button" 
                                    className="tag-remove" 
                                    onClick={() => handleRemoveSpecialization(index)}
                                >×</button>
                            </div>
                        ))}
                    </div>
                    <div className="tag-input-container">
                        <input
                            type="text"
                            value={newSpecialization}
                            onChange={(e) => setNewSpecialization(e.target.value)}
                            placeholder="Add a specialization"
                        />
                        <button 
                            type="button" 
                            onClick={handleAddSpecialization}
                            className="tag-add"
                        >Add</button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Facilities</label>
                    <div className="tags-container">
                        {formData.facilities.map((facility, index) => (
                            <div key={index} className="tag">
                                <span>{facility}</span>
                                <button 
                                    type="button" 
                                    className="tag-remove" 
                                    onClick={() => handleRemoveFacility(index)}
                                >×</button>
                            </div>
                        ))}
                    </div>
                    <div className="tag-input-container">
                        <input
                            type="text"
                            value={newFacility}
                            onChange={(e) => setNewFacility(e.target.value)}
                            placeholder="Add a facility"
                        />
                        <button 
                            type="button" 
                            onClick={handleAddFacility}
                            className="tag-add"
                        >Add</button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="hospitalProfilePhoto">
                        <Upload size={16} className="form-icon" />
                        Profile Photo
                    </label>
                    <input
                        type="file"
                        id="hospitalProfilePhoto"
                        name="hospitalProfilePhoto"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {imagePreview && (
                        <div className="profile-photo-preview">
                            <img src={imagePreview} alt="Profile Preview" className="image-preview" />
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
