import React, { useState, useEffect } from 'react';
import { AlertCircle, Mail, Phone, MapPin, Globe, Upload } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    licenseNumber: '',
    specialization: '',
    experience: '',
    aboutYourself: '',
    profilePhoto: '',
    websiteUrl: '',
    clinicName: '',
    clinicTimings: '',
    daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    profilePhotoFile: null,
  });

  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode the JWT token to extract userId
      const payload = token.split('.')[1]; // Extract the payload (middle part)
      const decodedPayload = JSON.parse(atob(payload)); // Decode from base64
      setUserId(decodedPayload.userId); // Set userId from decoded token
      console.log('Decoded User ID:', decodedPayload.userId);
    } else {
      setError('Token not found in localStorage');
    }
  }, []); // Run once on component mount

  useEffect(() => {
    if (!userId) return; // Don't fetch data if userId is not available

    // Fetch doctor profile data when the component mounts
    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`https://medaccess-backend.onrender.com/api/auth/doctor/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Send token in headers
          },
        });

        const data = await response.json();
        if (response.ok) {
          // Process the days available array from the server
          let processedDays = [];
          
          if (data.daysAvailable && Array.isArray(data.daysAvailable)) {
            // Flatten the array and process any entries containing "and"
            processedDays = data.daysAvailable.flatMap(day => {
              if (typeof day === 'string' && (day.includes(',') || day.includes('and'))) {
                return day
                  .replace(/ and /g, ',')
                  .replace(/,and /g, ',')
                  .replace(/ and/g, ',')
                  .split(/,\s*/)
                  .map(d => d.trim());
              }
              return day;
            });
            
            // Filter out empty strings and duplicates
            processedDays = Array.from(new Set(
              processedDays.filter(day => day && day.trim() !== '')
                .map(day => day.trim())
            ));
          }
          
          // If no days available, use default days
          if (!processedDays.length) {
            processedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          }
          
          console.log('Processed days from server:', processedDays);
          
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            contact: data.contact || '',
            streetAddress: data.clinicAddress?.street || '',
            city: data.clinicAddress?.city || '',
            state: data.clinicAddress?.state || '',
            zipCode: data.clinicAddress?.zipCode || '',
            licenseNumber: data.licenseNumber || '',
            specialization: data.specialization || '',
            experience: data.experience || '',
            aboutYourself: data.aboutYourself || '',
            profilePhoto: data.profilePhoto || '',
            websiteUrl: data.websiteUrl || '',
            clinicName: data.clinicName || '',
            clinicTimings: data.clinicTimings || '',
            daysAvailable: processedDays,
            profilePhotoFile: null,
          });
          setImagePreview(data.profilePhoto);  // Display current profile photo if available
        } else {
          setError(data.message || 'Failed to fetch data');
        }
      } catch (error) {
        setError('Error fetching doctor data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [userId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add handler for checkbox changes (days available)
  const handleDayChange = (day) => {
    const currentDays = [...formData.daysAvailable];
    
    if (currentDays.includes(day)) {
      // Remove day if already selected
      const updatedDays = currentDays.filter(d => d !== day);
      setFormData({
        ...formData,
        daysAvailable: updatedDays
      });
    } else {
      // Add day if not selected
      setFormData({
        ...formData,
        daysAvailable: [...currentDays, day]
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the actual file object for FormData
    setFormData({
      ...formData,
      profilePhotoFile: file // Store the file object
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    // Create a structured address object from individual form fields
    const clinicAddress = {
      street: formData.streetAddress || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || ''
    };

    // Ensure daysAvailable is a clean array of day names
    let processedDays = [...formData.daysAvailable];
    
    // Clean up the array of days (remove duplicates and ensure each is a proper day)
    const validDays = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];
    
    // Filter out invalid days and remove duplicates
    processedDays = Array.from(new Set(
      processedDays.filter(day => validDays.includes(day))
    ));
    
    // Ensure at least one day is selected
    if (processedDays.length === 0) {
      processedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }

    try {
      // Make sure experience is a number
      const experienceValue = formData.experience ? 
        (typeof formData.experience === 'string' ? parseInt(formData.experience, 10) : formData.experience) : 0;

      // Check if there's a new file
      const hasNewFile = !!formData.profilePhotoFile;
      
      // Add the missing required fields with default values if not set
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.contact || '', // Send directly as phoneNumber (what the backend expects)
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        experience: experienceValue,
        aboutYourself: formData.aboutYourself || '',
        websiteUrl: formData.websiteUrl || '',
        clinicName: formData.clinicName || '',
        clinicTimings: formData.clinicTimings,
        clinicAddress,
        daysAvailable: processedDays,
        qualification: formData.specialization || 'General Medicine',
      };

      // Log what's being sent to help debug
      console.log("Preparing data:", dataToSend);

      // Prepare request based on whether we have a file or not
      let response;
      
      if (hasNewFile) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();
        
        // Add all text fields one by one to control exactly what's being sent
        formDataToSend.append('fullName', dataToSend.fullName);
        formDataToSend.append('email', dataToSend.email);
        formDataToSend.append('phoneNumber', dataToSend.phoneNumber);
        formDataToSend.append('licenseNumber', dataToSend.licenseNumber);
        formDataToSend.append('specialization', dataToSend.specialization);
        formDataToSend.append('experience', dataToSend.experience);
        formDataToSend.append('aboutYourself', dataToSend.aboutYourself);
        formDataToSend.append('websiteUrl', dataToSend.websiteUrl);
        formDataToSend.append('clinicName', dataToSend.clinicName);
        formDataToSend.append('clinicTimings', dataToSend.clinicTimings);
        formDataToSend.append('qualification', dataToSend.qualification);
        
        // Convert objects to JSON strings
        formDataToSend.append('clinicAddress', JSON.stringify(dataToSend.clinicAddress));
        formDataToSend.append('daysAvailable', JSON.stringify(dataToSend.daysAvailable));
        
        // Add the file
        formDataToSend.append('profilePhoto', formData.profilePhotoFile);
        
        console.log("Sending form data with keys:", Array.from(formDataToSend.keys()));
        try {
          response = await fetch(`https://medaccess-backend.onrender.com/api/auth/doctor/update/${userId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formDataToSend,
          });
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          throw fetchError;
        }
      } else {
        console.log("Sending JSON data:", dataToSend);
        // Use JSON if no file
        try {
          response = await fetch(`https://medaccess-backend.onrender.com/api/auth/doctor/update/${userId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          throw fetchError;
        }
      }
      
      const data = await response.json();
      console.log("Server response:", data);
      
      if (response.ok) {
        alert('Profile updated successfully!');
        // Reload the page to show updated data
        window.location.reload();
      } else {
        console.error('Update error response:', data);
        setError(data.message || data.error || 'Error updating profile');
      }
    } catch (error) {
      console.error('Update exception:', error);
      setError('An error occurred while updating the profile');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
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
          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="Street"
          />
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
          />
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
          />
        </div>

        <div className="form-group">
          <label htmlFor="licenseNumber">License Number</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialization">Specialization</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="aboutYourself">About Yourself</label>
          <textarea
            id="aboutYourself"
            name="aboutYourself"
            value={formData.aboutYourself}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="websiteUrl">Website URL</label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="clinicName">Clinic Name</label>
          <input
            type="text"
            id="clinicName"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="clinicTimings">Clinic Timings</label>
          <input
            type="text"
            id="clinicTimings"
            name="clinicTimings"
            value={formData.clinicTimings}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Days Available</label>
          <div className="days-selection-info">
            Please select the days when you're available at your clinic.
          </div>
          <div className="days-checkboxes">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  checked={formData.daysAvailable.includes(day)}
                  onChange={() => handleDayChange(day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
          <div className="days-selection-footer">
            {formData.daysAvailable.length > 0 ? (
              <div className="selected-days">
                <strong>Selected:</strong> {formData.daysAvailable.join(', ')}
              </div>
            ) : (
              <div className="days-warning">Please select at least one day</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="profilePhoto">Profile Photo</label>
          <input
            type="file"
            id="profilePhoto"
            name="profilePhoto"
            onChange={handleFileChange}
          />
          {imagePreview && <img src={imagePreview} alt="Profile Preview" className="profile-photo-preview" />}
        </div>

        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;
