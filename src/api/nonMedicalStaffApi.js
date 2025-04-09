import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/nonmedicalstaff`;

export const fetchNonMedicalStaff = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
};

export const addNonMedicalStaff = async (staffData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/add`, staffData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    // Don't log validation errors (400 status code)
    if (error.response?.status !== 400) {
      console.error('Error adding staff:', error);
    }
    throw error;
  }
};

export const updateNonMedicalStaff = async (staffId, staffData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/update/${staffId}`, staffData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    // Don't log validation errors (400 status code)
    if (error.response?.status !== 400) {
      console.error('Error updating staff:', error);
    }
    throw error;
  }
};

export const deleteNonMedicalStaff = async (staffId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/delete/${staffId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
}; 