// server/sockets/chatSocket.js (ES MODULE CORRECTED)

import jwt from 'jsonwebtoken'; // Convert to import
import Message from '../models/Message.js'; // Convert to import and add .js extension
import 'dotenv/config'; // Ensure JWT_SECRET is available

// Map to store connected users and their socket IDs (for 1:1 messaging)
const userSocketMap = new Map(); 

// Function to handle all Socket.io events
const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // --- 1. AUTHENTICATE SOCKET CONNECTION ---
        socket.on('authenticate', async (token) => {
            try {
                // Verify the JWT using the same secret as your API
                // JWT_SECRET is accessed via process.env because we imported 'dotenv/config' in server.js
                const decoded = jwt.verify(token, process.env.JWT_SECRET); 
                const userId = decoded._id;

                // Store the user ID and socket ID
                userSocketMap.set(userId, socket.id);
                socket.userId = userId; // Attach userId to the socket object

                socket.emit('authenticated', { message: 'Authentication successful.' });
                console.log(`Socket ${socket.id} authenticated as User ${userId}`);

            } catch (error) {
                console.error('Socket authentication failed:', error.message);
                socket.emit('unauthorized', { message: 'Invalid token.' });
                socket.disconnect(true);
            }
        });

        // --- 2. JOIN/CREATE CHAT ROOM ---
        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
            // Check if socket.userId is defined before logging
            console.log(`User ${socket.userId || socket.id} joined room: ${roomName}`);
        });

        // --- 3. HANDLE NEW MESSAGE ---
        socket.on('sendMessage', async ({ room, content, receiverId }) => {
            if (!socket.userId) return; // Must be authenticated

            // 1. Create a new message object for the database
            const newMessage = await Message.create({
                senderId: socket.userId,
                receiverId: receiverId, 
                room: room, 
                content: content,
            });

            // 2. Broadcast to all other clients in the room (excludes sender)
            // Note: Client handles optimistic update, so we only need to broadcast to others.
            socket.to(room).emit('receiveMessage', newMessage);

            // Optional: Send a notification to the specific receiver if they are online
            const receiverSocketId = userSocketMap.get(receiverId);
            if (receiverSocketId) {
                 io.to(receiverSocketId).emit('newNotification', { 
                     type: 'chat', 
                     message: `New message from ${socket.userId}` 
                   });
            }

        });

        // --- 4. HANDLE DISCONNECT ---
        socket.on('disconnect', () => {
            if (socket.userId) {
                userSocketMap.delete(socket.userId);
                console.log(`User ${socket.userId} disconnected.`);
            }
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

// Use export default for the main function (as intended by the import in server.js)
export default setupChatSocket;