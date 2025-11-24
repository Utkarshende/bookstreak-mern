import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../stores/authStore';
// Import a hero icon for a professional touch
import { UserPlusIcon } from '@heroicons/react/20/solid';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
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
            const response = await api.post('/api/auth/register', formData);
            
            const { token, user } = response.data;
            login(token, user); 
            
            navigate('/');
            
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transform transition duration-500 hover:shadow-3xl">
                <div className="p-8 sm:p-10 flex flex-col gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-indigo-50 rounded-full">
                             {/* Icon for a professional brand touch */}
                            <UserPlusIcon className="h-6 w-6 text-indigo-600" /> 
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Create Your BookStreak Account
                        </h2>
                        <p className="text-sm text-gray-500">
                            Start tracking your reading journey today.
                        </p>
                    </div>

                    {/* Form Section */}
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        
                        {/* Name Input with Floating Label */}
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                placeholder=" "
                                onChange={handleChange}
                                className="peer w-full h-10 px-3 pt-4 pb-2 text-gray-900 placeholder-transparent border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
                            />
                            <label 
                                htmlFor="name"
                                className="absolute left-3 top-2 text-xs text-gray-500 transition-all duration-300 transform peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 cursor-text"
                            >
                                Full Name
                            </label>
                        </div>

                        {/* Email Input with Floating Label */}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                placeholder=" "
                                onChange={handleChange}
                                className="peer w-full h-10 px-3 pt-4 pb-2 text-gray-900 placeholder-transparent border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
                            />
                            <label 
                                htmlFor="email"
                                className="absolute left-3 top-2 text-xs text-gray-500 transition-all duration-300 transform peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 cursor-text"
                            >
                                Email Address
                            </label>
                        </div>
                        
                        {/* Password Input with Floating Label */}
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                placeholder=" "
                                onChange={handleChange}
                                className="peer w-full h-10 px-3 pt-4 pb-2 text-gray-900 placeholder-transparent border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
                            />
                            <label 
                                htmlFor="password"
                                className="absolute left-3 top-2 text-xs text-gray-500 transition-all duration-300 transform peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 cursor-text"
                            >
                                Password (min 6 chars)
                            </label>
                        </div>
                        
                        {/* Error Message */}
                        {error && <p className="text-sm text-red-600 -mt-2">{error}</p>}
                        
                        {/* Submit Button with Loading State */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full flex justify-center py-3 px-4 rounded-lg text-base font-semibold text-white 
                                shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01]
                                ${
                                    isLoading 
                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                                }
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="text-sm text-center pt-2">
                        <p className="text-gray-600">
                            Already have an account? 
                            <Link to="/login" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;