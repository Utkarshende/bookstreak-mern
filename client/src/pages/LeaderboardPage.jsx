import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Clock, BookOpen, Star, Zap } from 'lucide-react'; // Added Zap for a more modern icon option

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
            <div className="text-center py-20 text-2xl text-indigo-700 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
                <Zap className="w-8 h-8 animate-spin-slow text-indigo-600 mb-4" />
                <p className='font-semibold'>Loading BookStreak Leaderboard...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-xl text-red-600 bg-red-50 rounded-lg border border-red-300 shadow-md">{error}</div>;
    }

    if (leaderboard.length === 0) {
        return <div className="text-center py-10 text-xl text-gray-500 bg-gray-50 rounded-lg shadow-md">No users found on the leaderboard yet. Start reading to claim your spot!</div>;
    }

    // Determine medal icons based on rank
    const getMedal = (index) => {
        if (index === 0) return <span className="ml-2 text-yellow-500 text-2xl drop-shadow-md transition duration-300 hover:scale-125">🥇</span>;
        if (index === 1) return <span className="ml-2 text-gray-400 text-2xl drop-shadow-md transition duration-300 hover:scale-125">🥈</span>;
        if (index === 2) return <span className="ml-2 text-amber-600 text-2xl drop-shadow-md transition duration-300 hover:scale-125">🥉</span>;
        return null;
    };
    
    // Custom utility for coloring rank background
    const getRankStyles = (index) => {
        if (index === 0) return 'bg-yellow-50/70 border-l-4 border-yellow-400 shadow-lg';
        if (index === 1) return 'bg-gray-100/70 border-l-4 border-gray-300 shadow-md';
        if (index === 2) return 'bg-amber-50/70 border-l-4 border-amber-500 shadow-md';
        return 'even:bg-gray-50 hover:bg-indigo-50/50';
    };


    return (
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-3xl mx-auto max-w-7xl border-t-8 border-indigo-600">
            <h1 className="text-5xl font-black text-center text-indigo-800 mb-2 tracking-tight">
                Global Streak Leaderboard
            </h1>
            <p className="text-lg text-center text-gray-500 mb-10">
                Top readers keeping the BookStreak alive across the globe.
            </p>

            {/* Responsive table container */}
            <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-indigo-700 text-white sticky top-0 shadow-lg">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-tl-xl w-[10%]">
                                <Trophy className="inline w-4 h-4 mr-1 mb-0.5" /> Rank
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-[40%]">
                                Reader
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                                <Clock className="inline w-4 h-4 mr-1 mb-0.5" /> Streak (Days)
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                                <BookOpen className="inline w-4 h-4 mr-1 mb-0.5" /> Total Pages
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider rounded-tr-xl">
                                <Star className="inline w-4 h-4 mr-1 mb-0.5" /> Points
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leaderboard.map((user, index) => (
                            <tr
                                key={user._id}
                                className={`
                                    transition duration-300 ease-in-out transform hover:scale-[1.005] hover:shadow-md 
                                    ${getRankStyles(index)}
                                `}
                            >
                                {/* Rank Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 font-extrabold">
                                    <div className="flex items-center">
                                        {index + 1}
                                        {getMedal(index)}
                                    </div>
                                </td>

                                {/* Reader Column */}
                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                    <span className="truncate block max-w-xs">{user.name}</span>
                                </td>

                                {/* Streak Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-base text-center">
                                    <span className={`font-black ${index < 3 ? 'text-red-700' : 'text-red-500'}`}>{user.streak || 0}</span>
                                </td>

                                {/* Total Pages Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-center font-semibold">
                                    {(user.totalPages || 0).toLocaleString()}
                                </td>

                                {/* Points Column */}
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-center font-semibold">
                                    {(user.points || 0).toLocaleString()}
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