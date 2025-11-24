import React from 'react';
import { useAuthStore } from '../stores/authStore';
import QuickComplete from '../components/QuickComplete';

// Helper component for statistics cards
const StatCard = ({ title, value, color }) => {
    // Dynamically choose color classes based on the 'color' prop
    let colorClass = '';
    switch (color) {
        case 'red':
            colorClass = 'text-red-600';
            break;
        case 'green':
            colorClass = 'text-green-600';
            break;
        case 'yellow':
            colorClass = 'text-yellow-600';
            break;
        default:
            colorClass = 'text-indigo-600';
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <h3 className="text-lg font-medium text-gray-500 mt-0 mb-0">{title}</h3>
            <p className={`mt-1 text-5xl font-bold leading-none ${colorClass}`}>{value}</p>
        </div>
    );
};


const HomePage = () => {
    const user = useAuthStore(state => state.user);

    if (!user) {
        return <div className="text-center p-10 text-gray-600 text-lg">Loading user data...</div>;
    }

    return (
        <div className="flex flex-col space-y-10 p-4 sm:p-6 lg:p-8">
            {/* Page Header Section */}
            <header className="bg-white p-8 rounded-lg shadow-xl text-center">
                <h1 className="text-4xl font-extrabold text-indigo-700 m-0">
                    Welcome back, {user.name}!
                </h1>
                <p className="mt-2 text-lg text-gray-500">Your mission: Keep the Streak Alive!</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Current Streak 🔥"
                    value={`${user.streak} days`}
                    color="red"
                />
                <StatCard
                    title="Total Pages Read 📖"
                    value={user.totalPages || 0}
                    color="green"
                />
                <StatCard
                    title="Total Points ✨"
                    value={user.points || 0}
                    color="yellow"
                />
            </div>

            {/* Daily Reading Action Section */}
            <section className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-0">
                    Daily Reading Action
                </h2>
                <QuickComplete />
            </section>
        </div>
    );
};

export default HomePage;