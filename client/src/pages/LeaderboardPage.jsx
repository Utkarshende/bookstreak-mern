import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/api/streaks/leaderboard');
                setLeaderboard(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError("Failed to load leaderboard data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (isLoading) {
        return <div className="loading-message">Loading Leaderboard...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (leaderboard.length === 0) {
        return <div className="empty-message">No users found on the leaderboard yet.</div>;
    }

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard-title">
                Global Streak Leaderboard
            </h1>
            <div className="table-responsive">
                <table className="leaderboard-table">
                    <thead className="table-header-group">
                        <tr>
                            <th className="table-header rank-col">Rank</th>
                            <th className="table-header reader-col">Reader</th>
                            <th className="table-header streak-col">Streak 🔥</th>
                            <th className="table-header pages-col">Total Pages 📖</th>
                            <th className="table-header points-col">Points ✨</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {leaderboard.map((user, index) => (
                            <tr key={user._id} className={`table-row ${index < 3 ? 'top-three' : ''}`}>
                                <td className="table-data rank-data text-left">
                                    {index + 1}
                                    {index === 0 && ' 🥇'}
                                    {index === 1 && ' 🥈'}
                                    {index === 2 && ' 🥉'}
                                </td>
                                <td className="table-data text-left">{user.name}</td>
                                <td className="table-data text-center">{user.streak} days</td>
                                <td className="table-data text-center">{user.totalPages}</td>
                                <td className="table-data text-center">{user.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .leaderboard-container {
                    background-color: white; /* bg-white */
                    padding: 24px; /* p-6 */
                    border-radius: 12px; /* rounded-xl */
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
                }

                .loading-message, .error-message, .empty-message {
                    text-align: center; /* text-center */
                    padding: 40px; /* py-10 */
                    font-size: 20px; /* text-xl */
                }

                .loading-message {
                    color: #4f46e5; /* text-indigo-600 */
                }

                .error-message {
                    color: #ef4444; /* text-red-500 */
                }
                
                .empty-message {
                    color: #6b7280; /* text-gray-500 */
                }

                .leaderboard-title {
                    font-size: 36px; /* text-4xl */
                    font-weight: 800; /* font-extrabold */
                    text-align: center; /* text-center */
                    color: #4338ca; /* text-indigo-700 */
                    margin-bottom: 32px; /* mb-8 */
                    margin-top: 0;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .leaderboard-table {
                    min-width: 100%; /* min-w-full */
                    border-collapse: collapse;
                    border-spacing: 0;
                    background-color: white;
                }

                .table-header-group {
                    border-bottom: 1px solid #e5e7eb; /* divide-y divide-gray-200 */
                }
                
                .table-header-group tr {
                    background-color: #f9fafb; /* bg-gray-50 */
                }

                .table-header {
                    padding: 12px 24px; /* px-6 py-3 */
                    text-align: left;
                    font-size: 12px; /* text-xs */
                    font-weight: 500; /* font-medium */
                    color: #6b7280; /* text-gray-500 */
                    text-transform: uppercase; /* uppercase */
                    letter-spacing: 0.05em; /* tracking-wider */
                    border-bottom: 1px solid #e5e7eb;
                }

                .streak-col, .pages-col, .points-col {
                    text-align: center;
                }

                .table-body {
                    background-color: white; /* bg-white */
                    border-bottom: 1px solid #e5e7eb; /* divide-y divide-gray-200 */
                }
                
                .table-body .table-row:not(:last-child) {
                     border-bottom: 1px solid #e5e7eb;
                }

                .table-data {
                    padding: 16px 24px; /* px-6 py-4 */
                    font-size: 14px; /* text-sm */
                    color: #1f2937; /* text-gray-900 */
                    white-space: nowrap; /* whitespace-nowrap */
                }

                .table-data.text-center {
                    text-align: center;
                }

                .table-row.top-three {
                    background-color: #fffbeb; /* bg-yellow-50 */
                    font-weight: 600; /* font-semibold */
                }
            `}</style>
        </div>
    );
};

export default LeaderboardPage;