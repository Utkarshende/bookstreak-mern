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

        // Conversion to integer happens here, on submission.
        const pages = parseInt(pagesRead);
        if (isNaN(pages) || pages <= 0) {
            setMessage("Please enter a valid number of pages.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/api/log-reading', {
                userId: user._id,
                pages: pages,
            });

            const updatedUser = response.data.user;
            updateUser(updatedUser);

            setMessage(`Success! Logged ${pages} pages. Keep up the streak!`);
            // Clear the input field state
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

    return (
        <form onSubmit={handleComplete} className="quick-complete-form">
            {hasCompletedToday ? (
                <div className="completion-message success-box">
                    You have logged reading today. Fantastic!
                </div>
            ) : (
                <>
                    <div className="input-group">
                        <input
                            type="number"
                            placeholder="Pages read today"
                            value={pagesRead}
                            // Changed to the new robust handler
                            onChange={handleInputChange} 
                            className="pages-input"
                            required
                            min="1"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`log-button ${isLoading ? 'loading' : ''}`}
                        >
                            {isLoading ? 'Logging...' : 'Log Reading'}
                        </button>
                    </div>
                    {message && <p className={`message-text ${message.includes('Success') ? 'success' : 'error'}`}>{message}</p>}
                </>
            )}

            <style jsx>{`
                .quick-complete-form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px; /* Space-y-4 */
                }

                .completion-message {
                    font-weight: 600; /* Font-semibold */
                    font-size: 18px; /* Text-lg */
                    padding: 12px; /* P-3 */
                    border-radius: 8px; /* Rounded-lg */
                    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06); /* Shadow-inner */
                    width: 100%;
                    max-width: 384px; /* Max-w-sm */
                    text-align: center;
                }

                .success-box {
                    color: #059669; /* Text-green-600 */
                    background-color: #ecfdf5; /* Bg-green-50 */
                    border: 1px solid #a7f3d0;
                }

                .input-group {
                    display: flex;
                    width: 100%;
                    max-width: 384px; /* Max-w-sm */
                    gap: 8px; /* Space-x-2 */
                }

                .pages-input {
                    flex-grow: 1; /* Flex-grow */
                    padding: 8px 16px; /* Px-4 py-2 */
                    border: 1px solid #d1d5db; /* Border border-gray-300 */
                    border-radius: 4px 0 0 4px; /* Rounded-l-md */
                    outline: none;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .pages-input:focus {
                    border-color: #6366f1; /* Focus:border-indigo-500 */
                    box-shadow: 0 0 0 1px #6366f1; /* Focus:ring-indigo-500 (simplified ring effect) */
                }

                .log-button {
                    padding: 8px 16px; /* Px-4 py-2 */
                    border-radius: 0 4px 4px 0; /* Rounded-r-md */
                    color: white; /* Text-white */
                    font-weight: 500; /* Font-medium */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); /* Shadow-md */
                    background-color: #4f46e5; /* Bg-indigo-600 */
                    transition: background-color 0.15s ease-in-out; /* Transition-colors */
                    border: none;
                    cursor: pointer;
                }

                .log-button:hover:not(:disabled) {
                    background-color: #4338ca; /* Hover:bg-indigo-700 */
                }

                .log-button.loading {
                    background-color: #818cf8; /* Bg-indigo-400 */
                    cursor: not-allowed;
                }

                .log-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .message-text {
                    font-size: 14px; /* Text-sm */
                    margin-top: -8px; /* Adjust margin if needed */
                }

                .message-text.success {
                    color: #059669; /* Text-green-600 */
                }

                .message-text.error {
                    color: #ef4444; /* Text-red-500 */
                }
            `}</style>
        </form>
    );
};

export default QuickComplete;