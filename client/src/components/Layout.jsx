// client/src/components/Layout.jsx

import React from 'react';
import { Outlet, Navigate, Link } from 'react-router';
import { useAuthStore } from '../stores/authStore';

const Layout = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                    <Link to="/" className="text-xl font-bold text-indigo-600">
                        📚 BookStreak
                    </Link>
                    <nav className="space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
                        <Link to="/leaderboard" className="text-gray-600 hover:text-indigo-600">Leaderboard</Link>
                        <Link to="/chat" className="text-gray-600 hover:text-indigo-600">Chat</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 font-medium">
                            Hello, {user?.name || 'Reader'}
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm px-3 py-1 border border-transparent rounded-md text-white bg-red-500 hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Renders the child route components (e.g., HomePage) */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;