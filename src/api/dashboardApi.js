import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://medaccess-backend.onrender.com';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// API for dashboard data
const dashboardApi = {
  // Get statistics (doctors, patients, appointments, tests)
  getStatistics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/statistics`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Get blood inventory data
  getBloodInventory: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/blood-inventory`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blood inventory:', error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/activities`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  // Get announcements
  getAnnouncements: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/announcements`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  // Generate a report
  generateReport: async (reportType) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/dashboard/report/${reportType}`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Download data
  downloadData: async (dataType, format) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/download/${dataType}/${format}`, {
        responseType: 'blob',
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading data:', error);
      throw error;
    }
  }
};

export default dashboardApi; 