import { create } from 'zustand';
import io from 'socket.io-client';
import { useAuthStore } from './authStore';

// Removed the reliance on BASE_URL here, as the URL will now be passed 
// explicitly from the component (ChatPage.jsx) which holds the correct absolute URL.

export const useChatStore = create((set, get) => ({
    socket: null,
    isConnected: false,
    messages: [],
    currentRoom: 'general_lounge', 

   
    // FIX: connectSocket now accepts the 'url' parameter passed from the component
    connectSocket: (url) => {
        const { token, isAuthenticated } = useAuthStore.getState();

        // Do not connect if already connected or if user is not authenticated
        if (!isAuthenticated || get().socket) return;
        
       
        // Use the provided 'url' for the Socket.IO connection
        const newSocket = io(url, {
            transports: ['websocket', 'polling'], // Recommended for deployment
            withCredentials: true, // Assuming your server requires this
        });

      
        newSocket.on('connect', () => {
            set({ isConnected: true });
            console.log('Socket connected, now authenticating...');
            
            newSocket.emit('authenticate', token); 
        });

        newSocket.on('authenticated', () => {
            console.log('Socket authenticated.');
            
            newSocket.emit('joinRoom', get().currentRoom);
        });

        newSocket.on('disconnect', () => {
            set({ isConnected: false });
            console.log('Socket disconnected.');
        });
        
        
        newSocket.on('receiveMessage', (message) => {
            console.log('Received message:', message);
            set(state => ({ messages: [...state.messages, message] }));
        });

        newSocket.on('unauthorized', (error) => {
            console.error('Socket authentication failed:', error);
           
            useAuthStore.getState().logout();
            newSocket.disconnect();
        });

        set({ socket: newSocket });
    },

    sendMessage: (content, receiverId = null) => {
        const { socket, currentRoom } = get();
        const senderId = useAuthStore.getState().user._id;

        if (socket && socket.connected) {
            const messageData = {
                room: currentRoom,
                content,
                receiverId, 
            };
            
            
            const tempMessage = { 
                senderId, 
                content, 
                room: currentRoom, 
                createdAt: new Date().toISOString() 
            };
            set(state => ({ messages: [...state.messages, tempMessage] }));
            
           
            socket.emit('sendMessage', messageData);
        }
    },

    
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },
}));