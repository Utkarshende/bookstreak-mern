import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom'; 
import { useAuthStore } from '../stores/authStore'; 
import { BookOpenIcon, UsersIcon, ChatBubbleLeftRightIcon, ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';


const Layout = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const NavLink = ({ to, icon: Icon, children }) => (
        <Link 
            to={to} 
            className="flex items-center space-x-2 text-gray-300 hover:text-teal-400 p-2 rounded-xl transition duration-300 ease-in-out hover:bg-gray-700 
                       transform hover:scale-105 active:scale-95"
        >
            <Icon className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">{children}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-900 font-sans antialiased text-gray-100 
                    bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
            
            <header className="sticky top-0 z-10 bg-gray-800 shadow-xl border-b border-gray-700 animate-header-slide-down">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold text-teal-400 tracking-tight transition duration-200 hover:text-teal-300">
                        <BookOpenIcon className="h-7 w-7 text-teal-500 animate-pulse-slow" />
                        <span>BookStreak</span>
                    </Link>
                    
                    <nav className="flex items-center space-x-1 sm:space-x-3">
                        <NavLink to="/" icon={HomeIcon}>Home</NavLink>
                        <NavLink to="/leaderboard" icon={UsersIcon}>Leaderboard</NavLink>
                        <NavLink to="/chat" icon={ChatBubbleLeftRightIcon}>Chat</NavLink>
                    </nav>
                    
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <span className="hidden sm:inline text-sm text-gray-300 font-medium bg-gray-700 px-3 py-1.5 rounded-full border border-gray-600 shadow-inner">
                            Welcome, <span className="font-semibold text-teal-400">{user?.name || 'Reader'}</span>
                        </span>
                        
                        <button
                            onClick={logout}
                            className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-600 shadow-md 
                                     transition duration-300 ease-in-out transform hover:bg-red-700 hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-70"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 -ml-0.5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="p-6 md:p-10 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-fade-in-up">
                    <Outlet />
                </div>
            </main>

            <style jsx>{`
                /* Simple pulse for the brand icon */
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.9; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite ease-in-out;
                }
                
                /* Slide down for the header */
                @keyframes header-slide-down {
                    0% { opacity: 0; transform: translateY(-100%); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-header-slide-down {
                    animation: header-slide-down 0.5s ease-out;
                }

                /* Fade in and slight lift for the main content card */
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out 0.4s both; /* Delayed start after header */
                }
            `}</style>
        </div>
    );
};

export default Layout;