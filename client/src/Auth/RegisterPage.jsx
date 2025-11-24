import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../stores/authStore';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // Using a custom hook for state management (Zustand/Context)
    const login = useAuthStore(state => state.login); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        // Frontend validation for password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            setIsLoading(false);
            return;
        }

        try {
            // API call to the register endpoint
            const response = await api.post('/api/auth/register', formData);
            
            const { token, user } = response.data;
            // Update global state with token and user info
            login(token, user); 
            
            // Redirect to the home page on successful registration
            navigate('/');
            
        } catch (err) {
            // Extract error message from the response or use a default
            const errorMessage = err.response?.data?.error || 'Registration failed. Please check your network.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Removed the 'styles' object as we are now using Tailwind CSS classes directly

    return (
        // Container: flex center, min-h-screen, light gray background, padding
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-5 box-border">
            {/* Card: max-width, padding, flex column, gap, white background, rounded, shadow */}
            <div className="w-full max-w-md p-10 flex flex-col gap-8 bg-white rounded-xl shadow-xl">
                {/* Title: 3xl font size, bold, center text, indigo color */}
                <h2 className="text-3xl font-bold text-center text-indigo-600">
                    Join BookStreak
                </h2>
                {/* Form: margin-top, flex column, vertical gap */}
                <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Full Name"
                        onChange={handleChange}
                        // Input: full width, padding, border, rounded, focus ring/border, transition
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email Address"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password (min 6 chars)"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                    
                    {/* Error message: small text, red color */}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        // Button base styles
                        className={`
                            w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                            transition duration-300 ease-in-out ${
                                // Conditional styles for loading vs. primary state
                                isLoading 
                                ? 'bg-indigo-300 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }
                        `}
                    >
                        {isLoading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
                {/* Link Container: small text, center text, gray color */}
                <div className="text-sm text-center text-gray-600">
                    <p>
                        Already have an account? 
                        {/* Link: medium font weight, indigo color, hover color */}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;