import express from "express";
import http from "http";
import { Server } from "socket.io";
import connect from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoute.js"
import eventRoutes from "./routes/eventRoute.js"

const app = express();
const PORT = 8000;

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Store active guest counts for each event
const eventGuestCounts = new Map();

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle guest user joining an event
    socket.on('joinEvent', async ({ userId, eventId }) => {
        try {
            // Add user to event room
            socket.join(`event_${eventId}`);

            // Increment guest count for this event
            const currentCount = eventGuestCounts.get(eventId) || 0;
            eventGuestCounts.set(eventId, currentCount + 1);

            // Emit updated count to all users in this event room
            io.to(`event_${eventId}`).emit('guestCountUpdate', {
                eventId,
                guestCount: eventGuestCounts.get(eventId)
            });
        } catch (error) {
            console.error('Error in joinEvent:', error);
        }
    });

    // Handle guest user leaving
    socket.on('leaveEvent', ({ eventId }) => {
        if (eventId) {
            socket.leave(`event_${eventId}`);
            const currentCount = eventGuestCounts.get(eventId) || 0;
            if (currentCount > 0) {
                eventGuestCounts.set(eventId, currentCount - 1);
                io.to(`event_${eventId}`).emit('guestCountUpdate', {
                    eventId,
                    guestCount: eventGuestCounts.get(eventId)
                });
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const corsOption = {
    origin: "http://localhost:3000",
    credentials: true
}
app.use(express.urlencoded({extended: true})); 
app.use(cors(corsOption));
app.use(express.json());

// Make io accessible to routes
app.set('io', io);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/events", eventRoutes);

console.log(PORT)
server.listen(PORT, () => {
    connect();
    console.log(`Server Listening at ${PORT}`);
});