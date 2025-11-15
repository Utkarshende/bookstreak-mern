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
        <div className="chat-container">
            <header className="chat-header">
                <h1 className="chat-title">BookStreak Chat: {currentRoom.replace('_', ' ').toUpperCase()}</h1>
                <p className={`chat-status ${isConnected ? 'online' : 'connecting'}`}>
                    Status: {isConnected ? 'Online' : 'Connecting...'}
                </p>
            </header>

            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-row ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`message-bubble ${msg.senderId === user._id ? 'sent-bubble' : 'received-bubble'}`}>
                            <p className="message-sender">
                                {msg.senderId === user._id ? 'You' : msg.senderId}
                            </p>
                            <p className="message-content">{msg.content}</p>
                            <span className="message-time">
                                {formatTime(msg.createdAt)}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <footer className="chat-footer">
                <form onSubmit={handleSubmit} className="message-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isConnected ? "Type a message..." : "Connecting to chat server..."}
                        disabled={!isConnected}
                        className="message-input"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !input.trim()}
                        className="send-button"
                    >
                        Send
                    </button>
                </form>
            </footer>

            <style jsx>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 70vh; /* h-[70vh] */
                    background-color: white; /* bg-white */
                    border-radius: 12px; /* rounded-xl */
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
                }

                .chat-header {
                    padding: 16px; /* p-4 */
                    background-color: #4f46e5; /* bg-indigo-600 */
                    color: white; /* text-white */
                    border-top-left-radius: 12px; /* rounded-t-xl */
                    border-top-right-radius: 12px;
                }

                .chat-title {
                    font-size: 20px; /* text-xl */
                    font-weight: bold; /* font-bold */
                    margin: 0;
                }

                .chat-status {
                    font-size: 14px; /* text-sm */
                    margin-top: 4px;
                }

                .chat-status.online {
                    color: #a7f3d0; /* text-green-300 */
                }

                .chat-status.connecting {
                    color: #fca5a5; /* text-red-300 */
                }

                .messages-area {
                    flex-grow: 1; /* flex-grow */
                    padding: 16px; /* p-4 */
                    overflow-y: auto; /* overflow-y-auto */
                    display: flex;
                    flex-direction: column;
                    gap: 16px; /* space-y-4 */
                }

                .message-row {
                    display: flex;
                }

                .message-row.justify-end {
                    justify-content: flex-end;
                }

                .message-row.justify-start {
                    justify-content: flex-start;
                }

                .message-bubble {
                    padding: 12px; /* p-3 */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-md */
                    max-width: 80%; /* Combined max-w classes */
                    color: #1f2937; /* text-gray-800 */
                    word-wrap: break-word;
                }

                .sent-bubble {
                    background-color: #e0e7ff; /* bg-indigo-100 */
                }

                .received-bubble {
                    background-color: #e5e7eb; /* bg-gray-200 */
                }

                .message-sender {
                    font-weight: bold; /* font-bold */
                    font-size: 12px; /* text-xs */
                    margin-bottom: 4px; /* mb-1 */
                    margin-top: 0;
                }

                .message-content {
                    font-size: 14px; /* text-sm */
                    margin: 0;
                }

                .message-time {
                    display: block; /* block */
                    text-align: right; /* text-right */
                    font-size: 12px; /* text-xs */
                    margin-top: 4px; /* mt-1 */
                    color: #6b7280; /* text-gray-500 */
                }

                .chat-footer {
                    padding: 16px; /* p-4 */
                    border-top: 1px solid #e5e7eb; /* border-t border-gray-200 */
                }

                .message-form {
                    display: flex;
                    gap: 12px; /* space-x-3 */
                }

                .message-input {
                    flex-grow: 1; /* flex-grow */
                    padding: 12px; /* p-3 */
                    border: 1px solid #d1d5db; /* border border-gray-300 */
                    border-radius: 8px; /* rounded-lg */
                    outline: none;
                    transition: border-color 0.15s ease-in-out;
                }

                .message-input:focus {
                    border-color: #6366f1; /* focus:border-indigo-500 */
                    box-shadow: 0 0 0 1px #6366f1; /* focus:ring-indigo-500 (simplified ring effect) */
                }

                .message-input:disabled {
                    background-color: #f3f4f6; /* disabled:bg-gray-100 */
                    cursor: not-allowed;
                }

                .send-button {
                    padding: 12px 24px; /* px-6 py-3 */
                    background-color: #4f46e5; /* bg-indigo-600 */
                    color: white; /* text-white */
                    font-weight: 600; /* font-semibold */
                    border-radius: 8px; /* rounded-lg */
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.15s ease-in-out;
                }

                .send-button:hover:not(:disabled) {
                    background-color: #4338ca; /* hover:bg-indigo-700 */
                }

                .send-button:disabled {
                    background-color: #9ca3af; /* disabled:bg-gray-400 */
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default ChatPage;