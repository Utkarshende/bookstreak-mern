import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore'; 
import api from '../utils/api';
import { CheckCircleIcon, BookOpenIcon, XCircleIcon } from '@heroicons/react/24/solid';

const QuickComplete = () => {
    const user = useAuthStore(state => state.user);
    const updateUser = useAuthStore(state => state.updateUser);

    const [pagesRead, setPagesRead] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleComplete = async (e) => {
        e.preventDefault();

        const pages = parseInt(pagesRead);
        if (isNaN(pages) || pages <= 0) {
            setMessage("Please enter a valid number of pages.");
            return;
        }
        if (pages > 20) {
            alert("You cannot add more than 20 pages at once.");
            setMessage("Maximum allowed is 20 pages per log.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/api/readings/log-reading', {
                userId: user._id,
                pagesRead: pages, // Ensure correct field name for backend
            });

            const updatedUser = response.data.user;
            updateUser(updatedUser);

            setMessage(`Success! Logged ${pages} pages.`);
            setPagesRead(''); 

        } catch (error) {
            console.error("Reading log failed:", error);
            setMessage(error.response?.data?.message || 'Failed to log reading.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[1-9]\d*$/.test(value)) { 
            setPagesRead(value);
            setMessage('');
        }
    };

    const hasCompletedToday = user.lastReadDate && (new Date(user.lastReadDate)).toDateString() === (new Date()).toDateString();
    
    const isSuccess = message.startsWith('Success');
    const isError = message && !isSuccess;

    return (
        <div className="p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 animate-fade-in-down">
            <h3 className="text-2xl font-extrabold text-gray-100 mb-6 flex items-center justify-center space-x-3 border-b border-gray-700 pb-3">
                <BookOpenIcon className="h-7 w-7 text-teal-400 animate-pulse-slow-icon" />
                <span>Quick Reading Log</span>
            </h3>

            <form onSubmit={handleComplete} className="flex flex-col items-center space-y-6">
                
                {hasCompletedToday ? (
                    <div className="flex items-center space-x-3 font-semibold text-lg p-4 rounded-xl w-full max-w-lg text-center text-green-300 bg-green-900/50 border-2 border-green-700 shadow-inner transition duration-300 transform hover:scale-[1.01]">
                        <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-green-400" />
                        <span className="flex-grow">
                            Daily streak maintained! You've logged reading today.
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="flex w-full max-w-xl space-x-4">
                            <input
                                type="number"
                                placeholder="Enter pages read (e.g., 50)"
                                value={pagesRead}
                                onChange={handleInputChange} 
                                required
                                min="1"
                                className="flex-grow px-5 py-3 border-2 border-gray-600 bg-gray-700 text-gray-100 rounded-xl text-lg outline-none transition duration-200 ease-in-out focus:border-teal-400 focus:ring-2 focus:ring-teal-700 placeholder:text-gray-400 shadow-md"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || pagesRead.length === 0}
                                className={`
                                    flex items-center justify-center space-x-2 px-6 py-3 text-lg font-semibold rounded-xl text-white shadow-xl transition duration-300 ease-in-out transform active:scale-[0.98]
                                    ${isLoading || pagesRead.length === 0 
                                        ? 'bg-teal-700/50 cursor-not-allowed opacity-70' 
                                        : 'bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-400 hover:shadow-teal-500/50'
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Logging...</span>
                                    </>
                                ) : (
                                    'Log Reading'
                                )}
                            </button>
                        </div>
                    </>
                )}

                {message && (
                    <div className={`flex items-center space-x-2 p-3 rounded-xl w-full max-w-xl text-base font-medium shadow-md ${
                        isSuccess 
                        ? 'bg-green-800/50 text-green-300 border border-green-700' 
                        : isError 
                            ? 'bg-red-800/50 text-red-300 border border-red-700' 
                            : 'bg-yellow-800/50 text-yellow-300 border border-yellow-700' // Default or validation error
                    }`}>
                        {isSuccess && <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-400" />}
                        {isError && <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-400" />}
                        <p>{message}</p>
                    </div>
                )}
            </form>

            <style jsx>{`
                /* Subtle, slower pulse for the icon to differentiate from header */
                @keyframes pulse-slow-icon {
                    0%, 100% { opacity: 0.8; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.03); }
                }
                .animate-pulse-slow-icon {
                    animation: pulse-slow-icon 4s infinite ease-in-out;
                }
                
                /* Fade in from the top for the component */
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default QuickComplete;