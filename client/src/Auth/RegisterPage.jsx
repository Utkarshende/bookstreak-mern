// client/src/pages/Auth/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../utils/api';
import { useAuthStore } from '../stores/authStore';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login); // Login immediately after registration

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        // Simple client-side password check
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            setIsLoading(false);
            return;
        }

        try {
            // Call the backend API
            const response = await api.post('/api/auth/register', formData);
            
            // On success, update the global state (logging the user in automatically)
            const { token, user } = response.data;
            login(token, user); 
            
            // Redirect to the home page
            navigate('/');
            
        } catch (err) {
            // Display error message from the backend
            const errorMessage = err.response?.data?.error || 'Registration failed. Please check your network.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-indigo-600">
                    Join BookStreak
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email Address"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password (min 6 chars)"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isLoading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
                <div className="text-sm text-center">
                    <p className="text-gray-600">
                        Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;