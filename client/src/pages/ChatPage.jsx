import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { 
    PaperAirplaneIcon, 
    WifiIcon, 
    SignalSlashIcon,
    EllipsisVerticalIcon,
    FaceSmileIcon,
    TrashIcon,
    PencilIcon
} from '@heroicons/react/24/solid';

const ChatPage = () => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const typingTimeoutRef = useRef(null);
    const { user } = useAuthStore();
    const {
        messages,
        isConnected,
        connectSocket,
        disconnectSocket,
        sendMessage,
        editMessage,
        deleteMessage,
        currentRoom,
        socket
    } = useChatStore();

    const messagesEndRef = useRef(null);

    const emojis = ['😀', '😂', '😍', '🔥', '👍', '🎉', '🚀', '💯', '❤️', '😢'];

    useEffect(() => {
        connectSocket();

        return () => {
            disconnectSocket();
        };
    }, [connectSocket, disconnectSocket]);

    // Listen for typing indicators
    useEffect(() => {
        if (!socket) return;

        socket.on('userTyping', ({ userName }) => {
            setTypingUsers(prev => {
                if (!prev.includes(userName)) {
                    return [...prev, userName];
                }
                return prev;
            });
        });

        socket.on('userStoppedTyping', () => {
            setTypingUsers(prev => prev.slice(1));
        });

        socket.on('onlineUsers', ({ users }) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('userTyping');
            socket.off('userStoppedTyping');
            socket.off('onlineUsers');
        };
    }, [socket]);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages]);

    const handleTyping = (e) => {
        const value = e.target.value;
        setInput(value);

        if (!isTyping && value.length > 0) {
            setIsTyping(true);
            socket?.emit('startTyping', { room: currentRoom, userName: user.username || user.email });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (value.length > 0) {
                socket?.emit('stopTyping', { room: currentRoom });
                setIsTyping(false);
            }
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && isConnected) {
            if (editingMessageId) {
                editMessage(editingMessageId, input.trim());
                setEditingMessageId(null);
                setEditingContent('');
            } else {
                sendMessage(input.trim());
            }
            setInput('');
            setIsTyping(false);
            socket?.emit('stopTyping', { room: currentRoom });
        }
    };

    const handleDeleteMessage = (messageId) => {
        deleteMessage(messageId);
    };

    const handleEditMessage = (messageId, content) => {
        setEditingMessageId(messageId);
        setEditingContent(content);
        setInput(content);
    };

    const handleEmojiSelect = (emoji) => {
        setInput(input + emoji);
        setShowEmojiPicker(false);
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const roomDisplayName = currentRoom ? currentRoom.replace(/_/g, ' ').toUpperCase() : 'General';
    const connectionStatusIcon = isConnected ? 
        <WifiIcon className="h-4 w-4 mr-1 text-green-300 animate-pulse" /> : 
        <SignalSlashIcon className="h-4 w-4 mr-1 text-red-300" />;

    return (
        <div className="flex gap-4">
            {/* Main Chat */}
            <div className="flex-grow flex flex-col h-[75vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Header */}
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

                {/* Messages Area */}
                <div className="flex-grow p-5 overflow-y-auto flex flex-col space-y-4 bg-gray-50/50">
                    {messages.length === 0 && (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg, index) => {
                        const isCurrentUser = msg.senderId === user._id;
                        const senderName = isCurrentUser ? 'You' : msg.senderName || msg.senderId;

                        return (
                            <div
                                key={index}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group animate-fadeIn`}
                            >
                                <div className="relative">
                                    <div className={`p-3 rounded-xl shadow-lg max-w-[85%] sm:max-w-[70%] break-words transform transition duration-300 hover:shadow-xl
                                        ${isCurrentUser 
                                            ? 'bg-teal-600 text-white rounded-tr-sm' 
                                            : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`
                                    }>
                                        <p className={`font-semibold text-xs mb-1 m-0 ${isCurrentUser ? 'text-teal-200' : 'text-teal-600'}`}>
                                            {senderName}
                                        </p>
                                        <p className="text-base m-0">{msg.content}</p>
                                        {msg.edited && <span className="text-xs opacity-70">(edited)</span>}
                                        <span className={`block text-right text-xs mt-1 ${isCurrentUser ? 'text-teal-300' : 'text-gray-500'}`}>
                                            {formatTime(msg.createdAt)}
                                        </span>
                                    </div>

                                    {/* Message Actions */}
                                    {isCurrentUser && (
                                        <div className="hidden group-hover:flex absolute right-0 top-0 gap-1 -translate-y-8">
                                            <button
                                                onClick={() => handleEditMessage(msg._id, msg.content)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                                                title="Edit"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                                title="Delete"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {typingUsers.length > 0 && (
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                            <span>{typingUsers[0]} is typing...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <footer className="p-4 border-t border-gray-200 bg-white">
                    {editingMessageId && (
                        <div className="mb-2 p-2 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-sm text-gray-600">Editing message...</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="flex space-x-3">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
                                >
                                    <FaceSmileIcon className="h-5 w-5 text-gray-700" />
                                </button>
                                
                                {/* Emoji Picker */}
                                {showEmojiPicker && (
                                    <div className="absolute bottom-14 left-0 bg-white border border-gray-200 rounded-lg p-3 grid grid-cols-5 gap-2 shadow-lg z-10">
                                        {emojis.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => handleEmojiSelect(emoji)}
                                                className="text-2xl hover:bg-gray-100 p-2 rounded transition"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <input
                                type="text"
                                value={input}
                                onChange={handleTyping}
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
                        </div>
                    </form>
                </footer>
            </div>

            {/* Sidebar - Online Users */}
            <div className="w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 hidden lg:flex flex-col">
                <div className="p-4 bg-teal-700 text-white">
                    <h3 className="font-bold text-lg">Online Users ({onlineUsers.length})</h3>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-2">
                    {onlineUsers.length === 0 ? (
                        <p className="text-gray-500 text-sm">No users online</p>
                    ) : (
                        onlineUsers.map((user, idx) => (
                            <div key={idx} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">{user.userName}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;