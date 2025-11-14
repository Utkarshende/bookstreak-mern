// client/src/components/QuickComplete.jsx

import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import api from '../utils/api.js'; // Assuming path to your API utility

const QuickComplete = () => {
    // Select state and action from the store using direct selectors
    const user = useAuthStore(state => state.user);
    const updateUser = useAuthStore(state => state.updateUser); // Safe to use the action directly

    // Local component state
    const [pagesRead, setPagesRead] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Function to handle the daily reading log
    const handleComplete = async (e) => {
        e.preventDefault();

        const pages = parseInt(pagesRead);
        if (isNaN(pages) || pages <= 0) {
            setMessage("Please enter a valid number of pages.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Call the API to log the reading and update the streak/stats
            const response = await api.post('/api/user/log-reading', {
                userId: user._id, // Assumes user has an _id field
                pages: pages,
            });

            // 2. Update the Zustand store with the new user data from the backend
            const updatedUser = response.data.user;
            updateUser(updatedUser); 

            // 3. Clear form and provide success feedback
            setMessage(`Success! Logged ${pages} pages. Keep up the streak!`);
            setPagesRead('');

        } catch (error) {
            console.error("Reading log failed:", error);
            setMessage(error.response?.data?.message || 'Failed to log reading.');
        } finally {
            setIsLoading(false);
        }
    };

    // Check if the user has completed reading today
    // This relies on a 'lastReadDate' field (which the backend should populate)
    const hasCompletedToday = user.lastReadDate && (new Date(user.lastReadDate)).toDateString() === (new Date()).toDateString();

    return (
        <form onSubmit={handleComplete} className="flex flex-col items-center space-y-4">
            {hasCompletedToday ? (
                <div className="text-green-600 font-semibold text-lg p-3 bg-green-50 rounded-lg shadow-inner w-full max-w-sm">
                    You have logged reading today. Fantastic!
                </div>
            ) : (
                <>
                    <div className="flex w-full max-w-sm space-x-2">
                        <input
                            type="number"
                            placeholder="Pages read today"
                            value={pagesRead}
                            onChange={(e) => {
                                setPagesRead(e.target.value);
                                setMessage('');
                            }}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="1"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-r-md text-white font-medium shadow-md transition-colors ${
                                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isLoading ? 'Logging...' : 'Log Reading'}
                        </button>
                    </div>
                    {message && <p className={`text-sm ${message.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
                </>
            )}
        </form>
    );
};

export default QuickComplete;