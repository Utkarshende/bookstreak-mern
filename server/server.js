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


// 2. Setup Variables
const app = express();
const PORT = process.env.PORT || 5000; 


// 3. Database Connection
mongoose.connect(process.env.VITE_API_URL)
.then(() => console.log('MongoDB Connected Successfully!'))
.catch(err => console.error("MongoDB connection error:", err));


// 4. Middleware Setup
app.use(cors());
app.use(express.json());


// 5. Route Integrations
app.get('/', (req, res) => {
    res.send('BookStreak Backend is Running! 🚀');
});

app.use('/api/auth', authRoutes); 
app.use('/api/readings', readingRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/streaks', streakRoutes);


// 6. Socket.io Setup
const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        // FIX: This MUST include the client's origin (e.g., the React app's port)
        origin: [
            "http://localhost:5173", // The common port for the React Vite client
            "http://127.0.0.1:5173",
            "http://localhost:5000", // Included for completeness (server's own origin)
            // Add your production client domain here later
        ], 
        methods: ["GET", "POST"],
        credentials: true // Important for handling cookies/auth headers if needed
    }
});

setupChatSocket(io);


// 7. Start the Server
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`WebSocket server initialized.`);
});