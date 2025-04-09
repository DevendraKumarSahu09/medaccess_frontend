/**
 * Authentication utility functions
 */

/**
 * Get the authentication token from local storage.
 * @returns {string} The formatted auth token or empty string if none exists
 */
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

/**
 * Set the authentication token to local storage.
 * @param {string} token - The token to store
 */
export const setAuthToken = (token) => {
  if (!token) {
    localStorage.removeItem('token');
    return;
  }
  
  localStorage.setItem('token', token);
};

/**
 * Check if the user is authenticated (has a token)
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Remove auth token and user info from local storage (logout)
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
};

/**
 * Get user type from local storage
 * @returns {string} The user type (doctor, hospital, etc.)
 */
export const getUserType = () => {
  return localStorage.getItem('userType') || '';
}; 