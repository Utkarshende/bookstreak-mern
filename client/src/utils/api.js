// client/utils/api.js

import axios from 'axios';
import { useAuthStore } from '../stores/authStore'; // Import the store directly

// Create an Axios instance
const api = axios.create({
    // FIX: Updated to use the environment variable VITE_BACKEND_URL provided by the user.
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        // Get the current state (token) from the Zustand store
        // NOTE: We use useAuthStore.getState() outside React components/hooks
        const token = useAuthStore.getState().token; 

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized errors (optional but good practice)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        
        // If we get a 401, it means the token is invalid or expired.
        if (status === 401) {
            console.warn("Unauthorized API call. Logging out user.");
            useAuthStore.getState().logout(); 
        }
        return Promise.reject(error);
    }
);

export default api;