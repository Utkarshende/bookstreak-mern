
import jwt from 'jsonwebtoken'; 
import Message from '../models/Message.js'; 
import 'dotenv/config'; 

const userSocketMap = new Map(); 

const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('authenticate', async (token) => {
            try {
                
                const decoded = jwt.verify(token, process.env.JWT_SECRET); 
                const userId = decoded._id;

                userSocketMap.set(userId, socket.id);
                socket.userId = userId; 
                socket.emit('authenticated', { message: 'Authentication successful.' });
                console.log(`Socket ${socket.id} authenticated as User ${userId}`);

            } catch (error) {
                console.error('Socket authentication failed:', error.message);
                socket.emit('unauthorized', { message: 'Invalid token.' });
                socket.disconnect(true);
            }
        });

        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
            console.log(`User ${socket.userId || socket.id} joined room: ${roomName}`);
        });

        socket.on('sendMessage', async ({ room, content, receiverId }) => {
            if (!socket.userId) return; 

            const newMessage = await Message.create({
                senderId: socket.userId,
                receiverId: receiverId, 
                room: room, 
                content: content,
            });

            
            socket.to(room).emit('receiveMessage', newMessage);

            const receiverSocketId = userSocketMap.get(receiverId);
            if (receiverSocketId) {
                 io.to(receiverSocketId).emit('newNotification', { 
                     type: 'chat', 
                     message: `New message from ${socket.userId}` 
                   });
            }

        });

        socket.on('disconnect', () => {
            if (socket.userId) {
                userSocketMap.delete(socket.userId);
                console.log(`User ${socket.userId} disconnected.`);
            }
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

export default setupChatSocket;