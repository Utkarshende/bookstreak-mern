import React from 'react';
import { useAuthStore } from '../stores/authStore';
import QuickComplete from '../components/QuickComplete';
import { FireIcon, BookOpenIcon as BookSolidIcon, SparklesIcon } from '@heroicons/react/24/solid';

// Helper component for statistics cards
const StatCard = ({ title, value, color, icon: Icon }) => {
    // Dynamically choose color classes based on the 'color' prop
    let colorClasses = {
        icon: 'text-indigo-600',
        value: 'text-indigo-700',
        border: 'border-indigo-500',
    };
    
    switch (color) {
        case 'red':
            colorClasses.icon = 'text-red-500';
            colorClasses.value = 'text-red-700';
            colorClasses.border = 'border-red-500';
            break;
        case 'green':
            colorClasses.icon = 'text-green-500';
            colorClasses.value = 'text-green-700';
            colorClasses.border = 'border-green-500';
            break;
        case 'yellow':
            colorClasses.icon = 'text-yellow-500';
            colorClasses.value = 'text-yellow-700';
            colorClasses.border = 'border-yellow-500';
            break;
        default:
            // Default is indigo, set above
            break;
    }

    return (
        <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colorClasses.border} 
                        transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl`}>
            
            <div className="flex items-center space-x-3 mb-2">
                <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
                <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-500">{title}</h3>
            </div>
            
            <p className={`mt-1 text-5xl font-extrabold leading-tight ${colorClasses.value}`}>{value}</p>
        </div>
    );
};


const HomePage = () => {
    const user = useAuthStore(state => state.user);

    if (!user) {
        return <div className="text-center p-10 text-gray-600 text-lg">Loading user data...</div>;
    }

    return (
        <div className="flex flex-col space-y-10">
            {/* Page Header Section */}
            <header className="bg-white p-8 rounded-2xl shadow-2xl text-center border-b-4 border-indigo-600">
                <h1 className="text-5xl font-extrabold text-indigo-800 m-0 tracking-tight animate-fadeIn">
                    Welcome back, <span className="text-indigo-600">{user.name}!</span>
                </h1>
                <p className="mt-3 text-xl text-gray-600 font-light">
                    Ready to turn the page on a new day? Keep the streak alive!
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                    title="Current Streak"
                    value={`${user.streak || 0} days`}
                    color="red"
                    icon={FireIcon}
                />
                <StatCard
                    title="Total Pages Read"
                    value={user.totalPages || 0}
                    color="green"
                    icon={BookSolidIcon}
                />
                <StatCard
                    title="Total Points"
                    value={user.points || 0}
                    color="yellow"
                    icon={SparklesIcon}
                />
            </div>

            {/* Daily Reading Action Section */}
            <section className="mt-10">
                <QuickComplete />
            </section>
        </div>
    );
};

export default HomePage;