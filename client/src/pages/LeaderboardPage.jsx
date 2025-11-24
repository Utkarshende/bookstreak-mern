import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Clock, BookOpen, Star } from 'lucide-react';

// Component to display the Leaderboard
const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Fetch leaderboard data from the backend API
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
        return (
            <div className="text-center py-10 text-xl text-indigo-600">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mr-2"></div>
                Loading Leaderboard...
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-xl text-red-500">{error}</div>;
    }

    if (leaderboard.length === 0) {
        return <div className="text-center py-10 text-xl text-gray-500">No users found on the leaderboard yet.</div>;
    }

    // Determine medal icons based on rank
    const getMedal = (index) => {
        if (index === 0) return <span className="ml-1 text-yellow-500 font-bold">🥇</span>;
        if (index === 1) return <span className="ml-1 text-gray-400 font-bold">🥈</span>;
        if (index === 2) return <span className="ml-1 text-amber-600 font-bold">🥉</span>;
        return null;
    };

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl mx-auto max-w-6xl">
            <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
                Global Streak Leaderboard
            </h1>

            {/* Responsive table container */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reader
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <Clock className="inline w-4 h-4 mr-1 mb-0.5" /> Streak
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <BookOpen className="inline w-4 h-4 mr-1 mb-0.5" /> Total Pages
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <Star className="inline w-4 h-4 mr-1 mb-0.5" /> Points
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leaderboard.map((user, index) => (
                            <tr
                                key={user._id}
                                className={`
                                    transition duration-150 hover:bg-indigo-50
                                    ${index < 3 ? 'bg-yellow-50 font-semibold' : 'even:bg-gray-50'}
                                `}
                            >
                                {/* Rank Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center text-lg font-bold">
                                        {index + 1}
                                        {getMedal(index)}
                                    </div>
                                </td>

                                {/* Reader Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.name}
                                </td>

                                {/* Streak Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                    <span className="text-red-600 font-bold">{user.streak}</span> days
                                </td>

                                {/* Total Pages Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                    {user.totalPages}
                                </td>

                                {/* Points Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                    {user.points}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardPage;