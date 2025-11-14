// client/src/App.jsx

import { useEffect } from 'react';
// CRITICAL FIX: Changed from 'react-router' to 'react-router-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
// Assuming these paths are correct relative to App.jsx location
import LoginPage from './Auth/LoginPage.jsx';
import RegisterPage from './Auth/RegisterPage'; 
import HomePage from './pages/HomePage'; 
import LeaderboardPage from './pages/LeaderboardPage';
import ChatPage from './pages/ChatPage';

function App() {
    // 1. Initialize Auth State from storage on app load
    const initializeAuth = useAuthStore(state => state.initialize);
    
    // CRITICAL FIX: Use an empty dependency array so this runs only once on mount.
    // This prevents the infinite loop caused by the state update from initializeAuth.
    useEffect(() => {
        initializeAuth();
    }, []); 

    return (
        <BrowserRouter>
            <Routes>
                {/* Protected Routes (Require Layout) */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    {/* Add other protected routes here later (e.g., /profile, /leaderboard) */}
                </Route>

                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;