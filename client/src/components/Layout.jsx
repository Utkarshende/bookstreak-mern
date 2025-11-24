import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom'; // Changed to 'react-router-dom'
import { useAuthStore } from '../stores/authStore';

const Layout = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-indigo-600 no-underline">
                        📚 BookStreak
                    </Link>
                    <nav className="flex space-x-4">
                        <Link 
                            to="/" 
                            className="text-gray-600 hover:text-indigo-600 transition duration-200"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/leaderboard" 
                            className="text-gray-600 hover:text-indigo-600 transition duration-200"
                        >
                            Leaderboard
                        </Link>
                        <Link 
                            to="/chat" 
                            className="text-gray-600 hover:text-indigo-600 transition duration-200"
                        >
                            Chat
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 font-medium">
                            Hello, {user?.name || 'Reader'}
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm px-3 py-1 border border-transparent rounded-md text-white bg-red-500 hover:bg-red-700 transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-6 py-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;