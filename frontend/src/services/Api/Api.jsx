// src/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: "https://react-dashboard-5odm.onrender.com/api", // Your base API URL
    timeout: 1000, // Optional: Set a timeout for requests
    headers: {
        'Content-Type': 'application/json', // Optional: Set default headers
    },
});

// Optional: You can add interceptors for request/response handling
api.interceptors.request.use(config => {
    // Do something before request is sent
    return config;
}, error => {
    // Handle request error
    return Promise.reject(error);
});

api.interceptors.response.use(response => {
    // Do something with response data
    return response;
}, error => {
    // Handle response error
    return Promise.reject(error);
});

export default api;