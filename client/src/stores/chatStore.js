import { create } from 'zustand';
import io from 'socket.io-client';
import { useAuthStore } from './authStore';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useChatStore = create((set, get) => ({
    socket: null,
    isConnected: false,
    messages: [],
    currentRoom: 'general_lounge',
    rooms: ['general_lounge', 'book_club', 'reading_tips', 'achievements'],
    notifications: [],

    connectSocket: () => {
        const { token, isAuthenticated, user } = useAuthStore.getState();

        if (!isAuthenticated || get().socket) return;
        
        const newSocket = io(BASE_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        newSocket.on('connect', () => {
            set({ isConnected: true });
            console.log('Socket connected, now authenticating...');
            
            newSocket.emit('authenticate', token, user.username || user.email); 
        });

        newSocket.on('authenticated', () => {
            console.log('Socket authenticated.');
            newSocket.emit('joinRoom', get().currentRoom);
            newSocket.emit('getOnlineUsers', get().currentRoom);
        });

        newSocket.on('disconnect', () => {
            set({ isConnected: false });
            console.log('Socket disconnected.');
        });
        
        newSocket.on('receiveMessage', (message) => {
            console.log('Received message:', message);
            set(state => ({ messages: [...state.messages, message] }));
        });

        newSocket.on('userJoined', ({ userName, message }) => {
            set(state => ({
                notifications: [...state.notifications, {
                    type: 'user_joined',
                    message: message,
                    timestamp: new Date()
                }]
            }));
        });

        newSocket.on('userLeft', ({ userName, message }) => {
            set(state => ({
                notifications: [...state.notifications, {
                    type: 'user_left',
                    message: message,
                    timestamp: new Date()
                }]
            }));
        });

        newSocket.on('messageEdited', (editedMessage) => {
            set(state => ({
                messages: state.messages.map(msg => 
                    msg._id === editedMessage._id ? editedMessage : msg
                )
            }));
        });

        newSocket.on('messageDeleted', ({ messageId }) => {
            set(state => ({
                messages: state.messages.filter(msg => msg._id !== messageId)
            }));
        });

        newSocket.on('messageReaction', ({ messageId, emoji, userName }) => {
            set(state => ({
                messages: state.messages.map(msg => {
                    if (msg._id === messageId) {
                        return {
                            ...msg,
                            reactions: [...(msg.reactions || []), { emoji, userName }]
                        };
                    }
                    return msg;
                })
            }));
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
        const { user } = useAuthStore.getState();

        if (socket && socket.connected) {
            const messageData = {
                room: currentRoom,
                content,
                receiverId,
                messageType: 'text'
            };
            
            const tempMessage = { 
                _id: Date.now(),
                senderId: user._id, 
                senderName: user.username || user.email,
                content, 
                room: currentRoom,
                messageType: 'text',
                createdAt: new Date().toISOString(),
                reactions: []
            };
            set(state => ({ messages: [...state.messages, tempMessage] }));
            
            socket.emit('sendMessage', messageData);
        }
    },

    editMessage: (messageId, newContent) => {
        const { socket, currentRoom } = get();

        if (socket && socket.connected) {
            socket.emit('editMessage', {
                messageId,
                newContent,
                room: currentRoom
            });
        }
    },

    deleteMessage: (messageId) => {
        const { socket, currentRoom } = get();

        if (socket && socket.connected) {
            socket.emit('deleteMessage', {
                messageId,
                room: currentRoom
            });
        }
    },

    switchRoom: (roomName) => {
        const { socket, currentRoom } = get();

        if (socket && socket.connected && roomName !== currentRoom) {
            socket.leave(currentRoom);
            socket.join(roomName);
            set({ 
                currentRoom: roomName,
                messages: []
            });
            socket.emit('getOnlineUsers', roomName);
        }
    },

    getNotifications: () => get().notifications,

    clearNotifications: () => set({ notifications: [] }),

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },
}));