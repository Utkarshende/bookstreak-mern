// client/src/stores/chatStore.js

import { create } from 'zustand';
import io from 'socket.io-client';
import { useAuthStore } from './authStore';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useChatStore = create((set, get) => ({
    socket: null,
    isConnected: false,
    messages: [],
    currentRoom: 'general_lounge', // Default room for simplicity

    // 1. Action to connect and authenticate the socket
    connectSocket: () => {
        const { token, isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated || get().socket) return;
        
        // Create the socket connection
        const newSocket = io(BASE_URL, {
            // Optional: You could pass the token here or use the custom 'authenticate' event
            // auth: { token: token } 
        });

        // Event Listeners
        newSocket.on('connect', () => {
            set({ isConnected: true });
            console.log('Socket connected, now authenticating...');
            // Send the JWT to the server for authentication
            newSocket.emit('authenticate', token); 
        });

        newSocket.on('authenticated', () => {
            console.log('Socket authenticated.');
            // After successful auth, join a default room
            newSocket.emit('joinRoom', get().currentRoom);
        });

        newSocket.on('disconnect', () => {
            set({ isConnected: false });
            console.log('Socket disconnected.');
        });
        
        // Receive messages from the server
        newSocket.on('receiveMessage', (message) => {
            console.log('Received message:', message);
            set(state => ({ messages: [...state.messages, message] }));
        });

        newSocket.on('unauthorized', (error) => {
            console.error('Socket authentication failed:', error);
            // Force logout if token is invalid
            useAuthStore.getState().logout();
            newSocket.disconnect();
        });

        set({ socket: newSocket });
    },

    // 2. Action to send a message
    sendMessage: (content, receiverId = null) => {
        const { socket, currentRoom } = get();
        const senderId = useAuthStore.getState().user._id;

        if (socket && socket.connected) {
            const messageData = {
                room: currentRoom,
                content,
                receiverId, // For 1:1 chat
            };
            
            // Optimistically add message to UI
            const tempMessage = { 
                senderId, 
                content, 
                room: currentRoom, 
                createdAt: new Date().toISOString() 
            };
            set(state => ({ messages: [...state.messages, tempMessage] }));
            
            // Emit to server
            socket.emit('sendMessage', messageData);
        }
    },

    // 3. Clean up the socket connection
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },
}));