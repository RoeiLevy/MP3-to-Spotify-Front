import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'https://api.example.com', // Replace with your API base URL
//   // You can set additional Axios configurations here (e.g., headers, timeout)
// });

// Function to handle API requests
const apiRequest = async (method, url, data = null) => {
  try {
    const response = await axios.request({
      method,
      url,
      data,
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle and throw any errors
    throw error;
  }
};

// Export API utility functions
export const apiGet = (url) => apiRequest('GET', url);
export const apiPost = (url, data) => apiRequest('POST', url, data);
export const apiPut = (url, data) => apiRequest('PUT', url, data);
export const apiDelete = (url) => apiRequest('DELETE', url);
