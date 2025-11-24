import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; 
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import LoginPage from './Auth/LoginPage.jsx';
import RegisterPage from './Auth/RegisterPage'; 
import HomePage from './pages/HomePage'; 
import LeaderboardPage from './pages/LeaderboardPage';
import ChatPage from './pages/ChatPage';

function App() {
    
    const initializeAuth = useAuthStore(state => state.initialize);
    
   
    useEffect(() => {
        initializeAuth();
    }, []); 

    return (
        <BrowserRouter>
            <Routes>
              
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                  
                </Route>

    
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;