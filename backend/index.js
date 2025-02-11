import 'dotenv/config';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connect from "./config/db.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoute.js"
import eventRoutes from "./routes/eventRoute.js"

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const eventGuestCounts = new Map();

io.on('connection', (socket) => {
    socket.on('joinEvent', async ({ userId, eventId }) => {
        try {
            socket.join(`event_${eventId}`);
            const currentCount = eventGuestCounts.get(eventId) || 0;
            eventGuestCounts.set(eventId, currentCount + 1);
            io.to(`event_${eventId}`).emit('guestCountUpdate', {
                eventId,
                guestCount: eventGuestCounts.get(eventId)
            });
        } catch (error) {
            console.error('Error in joinEvent:', error);
        }
    });

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

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('io', io);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/events", eventRoutes);

server.listen(PORT, () => {
    connect();
    console.log(`Server Listening at ${PORT}`);
});