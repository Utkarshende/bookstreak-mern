
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
        return <div className="text-center py-10 text-xl text-indigo-600">Loading Leaderboard...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-xl text-red-500">{error}</div>;
    }

    if (leaderboard.length === 0) {
        return <div className="text-center py-10 text-xl text-gray-500">No users found on the leaderboard yet.</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
                Global Streak Leaderboard
            </h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reader</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Streak 🔥</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pages 📖</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Points ✨</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((user, index) => (
                        <tr key={user._id} className={index < 3 ? 'bg-yellow-50 font-semibold' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                                {index + 1}
                                {index === 0 && ' 🥇'}
                                {index === 1 && ' 🥈'}
                                {index === 2 && ' 🥉'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{user.streak} days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{user.totalPages}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{user.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardPage;