import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import api from '../utils/api.js';
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

        setIsLoading(true);

        try {
            const response = await api.post('/api/readings/log-reading', {
                userId: user._id,
                pages: pages,
            });

            const updatedUser = response.data.user;
            updateUser(updatedUser);

            // Using the full message structure for clarity
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
        // Allows empty string or positive integers only
        if (value === '' || /^[1-9]\d*$/.test(value)) { 
            setPagesRead(value);
            setMessage('');
        }
    };

    // Check if the user completed a reading log today
    const hasCompletedToday = user.lastReadDate && (new Date(user.lastReadDate)).toDateString() === (new Date()).toDateString();
    
    // Determine message type for conditional styling
    const isSuccess = message.startsWith('Success');
    const isError = message && !isSuccess;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <BookOpenIcon className="h-6 w-6 text-indigo-500" />
                <span>Quick Reading Log</span>
            </h3>

            <form onSubmit={handleComplete} className="flex flex-col items-center space-y-5">
                
                {hasCompletedToday ? (
                    // Success Box for Daily Completion
                    <div className="flex items-center space-x-3 font-semibold text-lg p-4 rounded-xl w-full max-w-lg text-center text-green-700 bg-green-50 border-2 border-green-300 shadow-inner">
                        <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-green-500" />
                        <span className="flex-grow">
                            Daily streak maintained! You've logged reading today.
                        </span>
                    </div>
                ) : (
                    <>
                        {/* Input Group: Flex container for input and button */}
                        <div className="flex w-full max-w-lg space-x-3">
                            <input
                                type="number"
                                placeholder="Enter pages read (e.g., 50)"
                                value={pagesRead}
                                onChange={handleInputChange} 
                                required
                                min="1"
                                // Input styling: large padding, smooth focus transition, rounded-xl
                                className="flex-grow px-5 py-3 border-2 border-gray-300 rounded-xl text-lg outline-none transition duration-200 ease-in-out focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || pagesRead.length === 0}
                                // Button styling: professional indigo theme, shadow, hover effects, flex layout for spinner
                                className={`
                                    flex items-center justify-center space-x-2 px-6 py-3 text-lg font-semibold rounded-xl text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.01]
                                    ${isLoading || pagesRead.length === 0 
                                        ? 'bg-indigo-400 cursor-not-allowed opacity-80' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300'
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

                {/* Status Message Text (Success/Error/Validation) */}
                {message && (
                    <div className={`flex items-center space-x-2 p-3 rounded-lg w-full max-w-lg ${
                        isSuccess 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : isError 
                            ? 'bg-red-100 text-red-700 border border-red-300' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-300' // Default or validation error
                    }`}>
                        {isSuccess && <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />}
                        {isError && <XCircleIcon className="h-5 w-5 flex-shrink-0" />}
                        <p className="text-base font-medium">{message}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default QuickComplete;