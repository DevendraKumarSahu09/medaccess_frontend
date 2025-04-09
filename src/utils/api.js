import axios from 'axios';
import { getAuthToken } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://medaccess-backend.onrender.com';

/**
 * Makes an authenticated API request with the proper headers
 * @param {string} method - The HTTP method (get, post, put, delete)
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {object} data - The request payload (for POST/PUT requests)
 * @param {object} config - Additional axios config options
 * @returns {Promise} - The axios response promise
 */
export const apiRequest = async (method, endpoint, data = null, config = {}) => {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  // Prepare headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    ...config.headers,
    'Authorization': getAuthToken()
  };

  try {
    const requestConfig = {
      ...config,
      headers,
      method,
      url
    };

    if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
      requestConfig.data = data;
    }

    const response = await axios(requestConfig);
    return response.data;
  } catch (error) {
    // Handle common errors
    if (error.response) {
      // The request was made, but the server responded with an error
      console.error(`API Error (${method} ${endpoint}):`, error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Could dispatch a logout action here or redirect to login
        console.error('Authentication failed');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    
    throw error;
  }
};

// Convenience methods
export const get = (endpoint, config = {}) => apiRequest('get', endpoint, null, config);
export const post = (endpoint, data, config = {}) => apiRequest('post', endpoint, data, config);
export const put = (endpoint, data, config = {}) => apiRequest('put', endpoint, data, config);
export const del = (endpoint, config = {}) => apiRequest('delete', endpoint, null, config);

export default {
  get,
  post,
  put,
  delete: del
}; 