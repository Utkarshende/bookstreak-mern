
import jwt from 'jsonwebtoken'; 
import Message from '../models/Message.js'; 
import 'dotenv/config'; 

const userSocketMap = new Map(); 
const userStatusMap = new Map(); // Track online/offline status
const typingUsers = new Map(); // Track who's typing

const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('authenticate', async (token, userName) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET); 
                const userId = decoded._id;

                userSocketMap.set(userId, socket.id);
                userStatusMap.set(userId, { online: true, userName: userName || 'Anonymous' });
                socket.userId = userId; 
                socket.userName = userName || 'Anonymous';
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
            socket.currentRoom = roomName;
            
            // Notify others that user joined
            socket.to(roomName).emit('userJoined', {
                userId: socket.userId,
                userName: socket.userName,
                message: `${socket.userName} joined the room`
            });

            console.log(`User ${socket.userId} joined room: ${roomName}`);
        });

        socket.on('sendMessage', async ({ room, content, receiverId, messageType = 'text' }) => {
            if (!socket.userId) return; 

            try {
                const newMessage = await Message.create({
                    senderId: socket.userId,
                    senderName: socket.userName,
                    receiverId: receiverId, 
                    room: room, 
                    content: content,
                    messageType: messageType,
                    reactions: []
                });

                // Emit to all users in the room (including sender)
                io.to(room).emit('receiveMessage', {
                    ...newMessage.toObject(),
                    senderName: socket.userName
                });

                // Notify receiver if direct message
                if (receiverId) {
                    const receiverSocketId = userSocketMap.get(receiverId);
                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit('newNotification', { 
                            type: 'chat', 
                            message: `New message from ${socket.userName}`
                        });
                    }
                }
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('messageError', { error: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('startTyping', ({ room, userName }) => {
            socket.to(room).emit('userTyping', {
                userId: socket.userId,
                userName: userName
            });
        });

        socket.on('stopTyping', ({ room }) => {
            socket.to(room).emit('userStoppedTyping', {
                userId: socket.userId
            });
        });

        // Emoji reaction
        socket.on('reactToMessage', ({ messageId, emoji, room }) => {
            io.to(room).emit('messageReaction', {
                messageId: messageId,
                emoji: emoji,
                userId: socket.userId,
                userName: socket.userName
            });
        });

        // Get online users in room
        socket.on('getOnlineUsers', (room) => {
            socket.emit('onlineUsers', {
                users: Array.from(userStatusMap.values()).filter(u => u.online)
            });
        });

        // Edit message
        socket.on('editMessage', async ({ messageId, newContent, room }) => {
            try {
                const updatedMessage = await Message.findByIdAndUpdate(
                    messageId,
                    { content: newContent, edited: true },
                    { new: true }
                );
                io.to(room).emit('messageEdited', updatedMessage);
            } catch (error) {
                socket.emit('messageError', { error: 'Failed to edit message' });
            }
        });

        // Delete message
        socket.on('deleteMessage', async ({ messageId, room }) => {
            try {
                await Message.findByIdAndDelete(messageId);
                io.to(room).emit('messageDeleted', { messageId });
            } catch (error) {
                socket.emit('messageError', { error: 'Failed to delete message' });
            }
        });

        socket.on('disconnect', () => {
            if (socket.userId) {
                userSocketMap.delete(socket.userId);
                userStatusMap.set(socket.userId, { online: false });
                
                if (socket.currentRoom) {
                    socket.to(socket.currentRoom).emit('userLeft', {
                        userId: socket.userId,
                        userName: socket.userName,
                        message: `${socket.userName} left the room`
                    });
                }
                
                console.log(`User ${socket.userId} disconnected.`);
            }
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

export default setupChatSocket;