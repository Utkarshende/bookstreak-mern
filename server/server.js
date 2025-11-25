import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'; 
import http from 'http';
import { Server } from 'socket.io'; 


import setupChatSocket from './sockets/chatSocket.js'; 
import authRoutes from './routes/authRoutes.js';
import readingRoutes from './routes/readingRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import streakRoutes from './routes/streakRoutes.js';


const app = express();
const PORT = process.env.PORT || 5000; 


mongoose.connect(process.env.VITE_API_URL)
.then(() => console.log('MongoDB Connected Successfully!'))
.catch(err => console.error("MongoDB connection error:", err));


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('BookStreak Backend is Running! 🚀');
});

app.use('/api/auth', authRoutes); 
app.use('/api/readings', readingRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/streaks', streakRoutes);


const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        
        origin: [
            "http://localhost:5173", 
            "http://127.0.0.1:5173",
            "http://localhost:5000", 
        ], 
        methods: ["GET", "POST"],
        credentials: true 
    }
});

setupChatSocket(io);

server.listen(PORT, () => {
     console.log(`Server running on port: ${PORT}`);
 console.log(`WebSocket server initialized.`);
});