import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import api from '../utils/api.js';

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

            setMessage(`Success! Logged ${pages} pages. Keep up the streak!`);
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
        if (value === '' || /^\d+$/.test(value)) {
            setPagesRead(value);
            setMessage('');
        }
    };

    const hasCompletedToday = user.lastReadDate && (new Date(user.lastReadDate)).toDateString() === (new Date()).toDateString();
    
    // Determine message type for conditional styling
    const isSuccess = message.includes('Success');

    return (
        <form onSubmit={handleComplete} className="flex flex-col items-center space-y-4">
            {hasCompletedToday ? (
                // Success Box: Green background, text, border, shadow-inner, centered
                <div className="font-semibold text-lg p-3 rounded-lg shadow-inner w-full max-w-sm text-center text-green-600 bg-green-50 border border-green-300">
                    You have logged reading today. Fantastic!
                </div>
            ) : (
                <>
                    {/* Input Group: Flex container for input and button */}
                    <div className="flex w-full max-w-sm space-x-2">
                        <input
                            type="number"
                            placeholder="Pages read today"
                            value={pagesRead}
                            onChange={handleInputChange} 
                            required
                            min="1"
                            // Input styling: flex-grow, padding, border, rounded-left, focus effects
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md outline-none transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            // Button styling: padding, rounded-right, shadow, conditional background/cursor
                            className={`
                                px-4 py-2 rounded-r-md text-white font-medium shadow-md transition duration-150 ease-in-out
                                ${isLoading 
                                    ? 'bg-indigo-400 cursor-not-allowed opacity-60' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                                }
                            `}
                        >
                            {isLoading ? 'Logging...' : 'Log Reading'}
                        </button>
                    </div>
                    {/* Message Text: Conditional color based on success/error */}
                    {message && (
                        <p className={`text-sm ${isSuccess ? 'text-green-600' : 'text-red-500'} mt-[-8px]`}>
                            {message}
                        </p>
                    )}
                </>
            )}
        </form>
    );
};

export default QuickComplete;