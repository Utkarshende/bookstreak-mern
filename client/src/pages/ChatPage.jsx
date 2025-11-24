import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';

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
        connectSocket();

        return () => {
            disconnectSocket();
        };
    }, [connectSocket, disconnectSocket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    return (
        <div className="flex flex-col h-[70vh] bg-white rounded-xl shadow-2xl">
            <header className="p-4 bg-indigo-600 text-white rounded-t-xl">
                <h1 className="text-xl font-bold m-0">BookStreak Chat: {currentRoom.replace('_', ' ').toUpperCase()}</h1>
                <p className={`text-sm mt-1 ${isConnected ? 'text-green-300' : 'text-red-300'}`}>
                    Status: {isConnected ? 'Online' : 'Connecting...'}
                </p>
            </header>

            <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`p-3 rounded-lg shadow-md max-w-[80%] break-words text-gray-800 ${msg.senderId === user._id ? 'bg-indigo-100' : 'bg-gray-200'}`}>
                            <p className="font-bold text-xs mb-1 m-0">
                                {msg.senderId === user._id ? 'You' : msg.senderId}
                            </p>
                            <p className="text-sm m-0">{msg.content}</p>
                            <span className="block text-right text-xs mt-1 text-gray-500">
                                {formatTime(msg.createdAt)}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isConnected ? "Type a message..." : "Connecting to chat server..."}
                        disabled={!isConnected}
                        className="flex-grow p-3 border border-gray-300 rounded-lg outline-none transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !input.trim()}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg border-none cursor-pointer transition duration-150 ease-in-out hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatPage;