import React from 'react';
// FIX: Added explicit file extensions (.js/.jsx) to internal imports to resolve potential module resolution errors in the environment.
import { useAuthStore } from '../stores/authStore.js'; 
import QuickComplete from '../components/QuickComplete.jsx';
import { FireIcon, BookOpenIcon as BookSolidIcon, SparklesIcon } from '@heroicons/react/24/solid';

// Helper component for statistics cards with enhanced styling and hover effects
const StatCard = ({ title, value, color, icon: Icon }) => {
    // Dynamically choose color classes based on the 'color' prop
    let colorClasses = {
        icon: 'text-indigo-600',
        value: 'text-indigo-700',
        border: 'border-indigo-500',
        bg: 'bg-indigo-50',
        ring: 'ring-indigo-300'
    };
    
    switch (color) {
        case 'red':
            colorClasses.icon = 'text-red-500';
            colorClasses.value = 'text-red-700';
            colorClasses.border = 'border-red-500';
            colorClasses.bg = 'bg-red-50';
            colorClasses.ring = 'ring-red-300';
            break;
        case 'green':
            colorClasses.icon = 'text-teal-500'; // Using teal for better visual
            colorClasses.value = 'text-teal-700';
            colorClasses.border = 'border-teal-500';
            colorClasses.bg = 'bg-teal-50';
            colorClasses.ring = 'ring-teal-300';
            break;
        case 'yellow':
            colorClasses.icon = 'text-amber-500'; // Using amber for rich yellow
            colorClasses.value = 'text-amber-700';
            colorClasses.border = 'border-amber-500';
            colorClasses.bg = 'bg-amber-50';
            colorClasses.ring = 'ring-amber-300';
            break;
        default:
            // Default is indigo, set above
            break;
    }

    return (
        // Card container with a staggered load-in animation, enhanced border, and dynamic hover effects
        <div className={`p-6 rounded-2xl shadow-xl border-l-8 ${colorClasses.border} ${colorClasses.bg} 
                         transition duration-500 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl hover:${colorClasses.ring} hover:ring-8 hover:z-10 animate-stat-card-pop`}>
            
            <div className="flex items-center space-x-4 mb-3">
                {/* Icon with a subtle rotation/scale on hover */}
                <Icon className={`h-8 w-8 ${colorClasses.icon} transform transition duration-500 hover:rotate-6 hover:scale-110`} />
                <h3 className="text-md uppercase tracking-widest font-bold text-gray-500">{title}</h3>
            </div>
            
            {/* Large, bold value */}
            <p className={`mt-2 text-6xl font-extrabold leading-none ${colorClasses.value}`}>{value}</p>
        </div>
    );
};


const HomePage = () => {
    const user = useAuthStore(state => state.user);

    if (!user) {
        return <div className="text-center p-10 text-gray-600 text-lg">Loading user data...</div>;
    }

    // Determine if today is a streak day to choose the header color
    const today = new Date().toDateString();
    const lastReadDate = user.lastReadDate ? new Date(user.lastReadDate).toDateString() : null;
    const isStreakActive = user.streak > 0 && (lastReadDate === today);


    return (
        // Main container with a subtle overall background
        <div className="flex flex-col space-y-12 p-4 md:p-8 bg-gray-100 min-h-screen">
            
            {/* Page Header Section: Gradient background and dynamic colors based on streak status */}
            <header className={`p-8 rounded-3xl shadow-3xl text-center overflow-hidden relative 
                                border-b-8 ${isStreakActive ? 'border-green-500' : 'border-indigo-600'} 
                                bg-gradient-to-r from-white via-indigo-50 to-white animate-gradient-shift`}>
                
                <h1 className="text-6xl font-black text-gray-800 m-0 tracking-tight transition duration-500 transform hover:scale-[1.01]">
                    Welcome back, 
                    <span className={`inline-block ${isStreakActive ? 'text-green-600' : 'text-indigo-600'} transition duration-500 transform hover:rotate-1`}>
                        {user.name}!
                    </span>
                </h1>
                
                <p className="mt-4 text-xl text-gray-600 font-light">
                    {/* Dynamic motivational message */}
                    {isStreakActive 
                        ? <span className="text-green-700 font-medium animate-pulse">Your reading streak is HOT! 🔥</span>
                        : "Ready to turn the page on a new day? Keep the streak alive!"
                    }
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-0 md:px-4">
                {/* Stat Cards use the StatCard component with enhanced colors and animations */}
                <StatCard
                    title="Current Streak"
                    value={`${user.streak || 0} days`}
                    color="red"
                    icon={FireIcon}
                />
                <StatCard
                    title="Total Pages Read"
                    value={user.totalPages || 0}
                    color="green" // Maps to Teal color set in StatCard logic
                    icon={BookSolidIcon}
                />
                <StatCard
                    title="Total Points"
                    value={user.points || 0}
                    color="yellow" // Maps to Amber color set in StatCard logic
                    icon={SparklesIcon}
                />
            </div>

            {/* Daily Reading Action Section */}
            <section className="mt-12 flex justify-center">
                {/* The QuickComplete component sits centered in the middle of the screen */}
                <div className="w-full max-w-2xl"> 
                    <QuickComplete />
                </div>
            </section>
            
            {/* Custom Styles and Keyframes for complex animations */}
            <style jsx>{`
                /* Custom Keyframe for Gradient Shift on Header */
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-shift {
                    background-size: 400% 400%;
                    animation: gradient-shift 15s ease infinite;
                }
                
                /* Custom Keyframe for Stat Card Pop (Subtle load-in effect) */
                @keyframes stat-card-pop {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-stat-card-pop {
                    animation: stat-card-pop 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    /* Stagger animation using nth-child */
                    /* NOTE: In a true React environment with separate files, these nth-child selectors might need adjustments or be managed with dynamic inline styles if the components weren't direct children. */
                    .grid-cols-1 > &:nth-child(1), .sm:grid-cols-2 > &:nth-child(1), .lg:grid-cols-3 > &:nth-child(1) { animation-delay: 0.1s; }
                    .grid-cols-1 > &:nth-child(2), .sm:grid-cols-2 > &:nth-child(2), .lg:grid-cols-3 > &:nth-child(2) { animation-delay: 0.2s; }
                    .grid-cols-1 > &:nth-child(3), .sm:grid-cols-2 > &:nth-child(3), .lg:grid-cols-3 > &:nth-child(3) { animation-delay: 0.3s; }
                }

                /* Custom large shadow for the header */
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 100px 0px rgba(99, 102, 241, 0.3);
                }
            `}</style>
        </div>
    );
};

export default HomePage;