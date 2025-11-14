import axios from 'axios';
import { useAuthStore } from '../stores/authStore'; 
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        
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


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
    
        if (status === 401) {
            console.warn("Unauthorized API call. Logging out user.");
            useAuthStore.getState().logout(); 
        }
        return Promise.reject(error);
    }
);

export default api;