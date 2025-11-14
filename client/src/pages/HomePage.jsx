// client/src/pages/HomePage.jsx

import React from 'react';
import { useAuthStore } from '../stores/authStore';
import QuickComplete from '../components/QuickComplete'; // To be created next

const HomePage = () => {
    // Get user data from the Zustand store
    const user = useAuthStore(state => state.user);

    if (!user) {
        // Should rarely happen due to Layout protection, but good practice
        return <div className="text-center py-10">Loading user data...</div>;
    }

    return (
        <div className="space-y-10">
            <header className="bg-white p-8 rounded-lg shadow-xl text-center">
                <h1 className="text-4xl font-extrabold text-indigo-700">
                    Welcome back, {user.name}!
                </h1>
                <p className="mt-2 text-lg text-gray-500">Your mission: Keep the Streak Alive!</p>
            </header>

            {/* User Stats Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Current Streak 🔥" 
                    value={`${user.streak} days`} 
                    color="text-red-600"
                />
                <StatCard 
                    title="Total Pages Read 📖" 
                    value={user.totalPages || 0} 
                    color="text-green-600"
                />
                <StatCard 
                    title="Total Points ✨" 
                    value={user.points || 0} 
                    color="text-yellow-600"
                />
            </div>

            {/* Quick Complete Action */}
            <section className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Daily Reading Action
                </h2>
                <QuickComplete />
            </section>
            
            {/* Placeholder for Current Reading Book/Session */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Your Current Reading
                </h2>
                <p className="text-gray-500">
                    *Placeholder: Here you will integrate the Book Search and display the active book.*
                </p>
            </section>
        </div>
    );
};

// Simple reusable stat component
const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className={`mt-1 text-5xl font-bold ${color}`}>{value}</p>
    </div>
);

export default HomePage;