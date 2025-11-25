import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { PaperAirplaneIcon, WifiIcon, SignalSlashIcon } from '@heroicons/react/24/solid';

// VITAL FIX: Define the absolute URL of the deployed backend service where Socket.IO is running.
// The frontend must explicitly connect to the separate backend service (your Node/Express server).
//
// === ACTION REQUIRED ===
// REPLACE THE FOLLOWING STRING WITH THE EXTERNAL URL OF YOUR BOOKSTREAK BACKEND:
// E.g., "https://bookstreak-mern-backend.onrender.com"
const SOCKET_SERVER_URL = "https://bookstreak-mern-api.onrender.com"; 


const ChatPage = () => {
    const [input, setInput] = useState('');
    const { user } = useAuthStore();
    const {
        messages,
        isConnected,
        connectSocket,
        disconnectSocket,
        sendMessage,
        currentRoom
    } = useChatStore();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        // FIX: We pass the absolute URL to the connection function.
        // This ensures the client connects to the correct deployed backend service.
        connectSocket(SOCKET_SERVER_URL);

        return () => {
            disconnectSocket();
        };
    }, [connectSocket, disconnectSocket]); // Dependency array should include connectSocket/disconnectSocket, which are stable functions from the store

    useEffect(() => {
        if (messages.length > 0) {
             setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
             }, 100);
        }
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && isConnected) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const roomDisplayName = currentRoom ? currentRoom.replace(/_/g, ' ').toUpperCase() : 'General';
    const connectionStatusIcon = isConnected ? 
        <WifiIcon className="h-4 w-4 mr-1 text-green-300 animate-pulse" /> : 
        <SignalSlashIcon className="h-4 w-4 mr-1 text-red-300" />;

    return (
        <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <header className="p-4 bg-teal-700 text-white rounded-t-2xl shadow-xl">
                <h1 className="text-2xl font-extrabold m-0 tracking-wide">
                    BookStreak Chat
                </h1>
                <div className='flex items-center justify-between'>
                    <p className="text-base mt-1 font-medium">
                        Room: <span className='font-semibold'>{roomDisplayName}</span>
                    </p>
                    <p className={`text-sm mt-1 flex items-center transition duration-500`}>
                        {connectionStatusIcon}
                        <span>Status: {isConnected ? 'Online' : 'Connecting...'}</span>
                    </p>
                </div>
            </header>

            <div className="flex-grow p-5 overflow-y-auto flex flex-col space-y-4 bg-gray-50/50">
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.senderId === user._id;
                    const senderName = isCurrentUser ? 'You' : msg.senderName || msg.senderId;

                    return (
                        <div
                            key={index}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                        >
                            <div className={`p-3 rounded-xl shadow-lg max-w-[85%] sm:max-w-[70%] break-words transform transition duration-300 hover:shadow-xl
                                ${isCurrentUser 
                                    ? 'bg-teal-600 text-white rounded-tr-sm' 
                                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`
                            }>
                                <p className={`font-semibold text-xs mb-1 m-0 ${isCurrentUser ? 'text-teal-200' : 'text-teal-600'}`}>
                                    {senderName}
                                </p>
                                <p className="text-base m-0">{msg.content}</p>
                                <span className={`block text-right text-xs mt-1 ${isCurrentUser ? 'text-teal-300' : 'text-gray-500'}`}>
                                    {formatTime(msg.createdAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isConnected ? "Share your reading thoughts..." : "Connecting to chat server..."}
                        disabled={!isConnected}
                        className="text-black flex-grow px-5 py-3 border-2 border-gray-300 rounded-xl text-base outline-none transition duration-200 ease-in-out focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !input.trim()}
                        className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl shadow-lg 
                                   transition duration-200 ease-in-out transform hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98] 
                                   disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <PaperAirplaneIcon className="h-5 w-5 transform -rotate-45" />
                        <span className='hidden sm:inline'>Send</span>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatPage;