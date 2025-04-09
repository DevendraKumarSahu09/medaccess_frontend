import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/pharmacy`;

export const fetchMedicines = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return [];
  }
};

export const addMedicine = async (medicineData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/add`, medicineData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding medicine:', error);
    throw error;
  }
};

export const updateMedicine = async (id, medicineData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, medicineData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
};

export const deleteMedicine = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
};

export const searchMedicines = async (query) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error searching medicines:', error);
    return [];
  }
}; 