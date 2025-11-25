import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../stores/authStore';
import { BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline'; // Updated icons for a book/magic theme

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
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

        try {
            const response = await api.post('/api/auth/login', formData);
            
            const { token, user } = response.data;
            login(token, user); 
            
            navigate('/');
            
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials and network.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 1. Immersive Background: Dark slate/gray with a subtle gradient (Bookworm's Library)
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 
                    /* Subtle Animated Background Effect (Simulated) */
                    bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
            {/* 2. Card Style: Darker, rich container with a subtle shadow glow */}
            <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden 
                        /* Interactive Hover: Slight lift for 'discovery' feel */
                        transform transition duration-500 hover:shadow-teal-500/30 hover:shadow-xl hover:translate-y-[-2px]">
                <div className="p-8 sm:p-10 flex flex-col gap-8">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-3">
                        {/* 3. Icon: Book-themed icon with the accent color */}
                        <div className="p-3 bg-teal-500/10 rounded-full border border-teal-500 animate-pulse-slow">
                            <BookOpenIcon className="h-8 w-8 text-teal-500" /> 
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-100 tracking-tight">
                            Unlock Your BookStreak
                        </h2>
                        <p className="text-sm text-gray-400">
                            The next chapter awaits. Please sign in to continue your reading journey.
                        </p>
                    </div>

                    {/* Form Section */}
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        
                        {/* Email Input */}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                placeholder=" "
                                onChange={handleChange}
                                // Input Styling: Dark background, light text, focus ring is the accent color
                                className="peer w-full h-12 px-3 pt-4 pb-2 bg-gray-700 text-gray-100 placeholder-transparent border border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-300 ease-in-out"
                            />
                            <label 
                                htmlFor="email"
                                // Label Styling: Light text, smaller, moves to the top on focus/fill
                                className="absolute left-3 top-3 text-sm text-gray-400 transition-all duration-300 transform 
                                           peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-400 cursor-text"
                            >
                                Reader's Email
                            </label>
                        </div>
                        
                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                placeholder=" "
                                onChange={handleChange}
                                // Input Styling: Dark background, light text, focus ring is the accent color
                                className="peer w-full h-12 px-3 pt-4 pb-2 bg-gray-700 text-gray-100 placeholder-transparent border border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-300 ease-in-out"
                            />
                            <label 
                                htmlFor="password"
                                className="absolute left-3 top-3 text-sm text-gray-400 transition-all duration-300 transform 
                                           peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-400 cursor-text"
                            >
                                Secret Word (Password)
                            </label>
                        </div>
                        
                        {/* Error Message */}
                        {error && <p className="text-sm text-red-500 -mt-2 bg-gray-700/50 p-2 rounded">{error}</p>}
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full flex justify-center py-3 px-4 rounded-lg text-base font-bold 
                                shadow-lg transition duration-300 ease-in-out transform 
                                ${
                                    isLoading 
                                    // Loading state: Muted accent color
                                    ? 'bg-teal-400 cursor-not-allowed text-gray-800' 
                                    // Default state: Primary accent color, hover adds a subtle glow and lift
                                    : 'bg-teal-500 text-gray-900 hover:bg-teal-400 hover:shadow-teal-500/50 hover:shadow-2xl hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50'
                                }
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Turning the page...
                                </>
                            ) : (
                                <>
                                    Sign In <SparklesIcon className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="text-sm text-center pt-2">
                        <p className="text-gray-400">
                            Don't have an account? 
                            <Link 
                                to="/register" 
                                className="ml-1 font-semibold text-teal-400 hover:text-teal-300 transition duration-200"
                            >
                                Start Your Saga (Sign Up)
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;