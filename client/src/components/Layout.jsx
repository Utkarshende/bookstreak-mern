import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom'; 
import { useAuthStore } from '../stores/authStore';
import { BookOpenIcon, UsersIcon, ChatBubbleLeftRightIcon, ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';


const Layout = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Helper component for styled navigation links
    const NavLink = ({ to, icon: Icon, children }) => (
        <Link 
            to={to} 
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 p-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-50"
        >
            <Icon className="h-5 w-5" />
            <span className="hidden sm:inline">{children}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            {/* Header: Fixed top, shadow for depth, slightly more prominent */}
            <header className="sticky top-0 z-10 bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    
                    {/* Brand/Logo */}
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold text-indigo-700 tracking-tight transition duration-200 hover:text-indigo-800">
                        <BookOpenIcon className="h-7 w-7 text-indigo-600" />
                        <span>BookStreak</span>
                    </Link>
                    
                    {/* Main Navigation */}
                    <nav className="flex items-center space-x-1 sm:space-x-3">
                        <NavLink to="/" icon={HomeIcon}>Home</NavLink>
                        <NavLink to="/leaderboard" icon={UsersIcon}>Leaderboard</NavLink>
                        <NavLink to="/chat" icon={ChatBubbleLeftRightIcon}>Chat</NavLink>
                    </nav>
                    
                    {/* User and Logout */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <span className="hidden sm:inline text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                            Hello, <span className="font-semibold text-indigo-600">{user?.name || 'Reader'}</span>
                        </span>
                        
                        <button
                            onClick={logout}
                            // Enhanced Button Styling for modern look
                            className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-600 shadow-md 
                                        transition duration-300 ease-in-out transform hover:bg-red-700 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-red-300"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 -ml-0.5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>
            
            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;