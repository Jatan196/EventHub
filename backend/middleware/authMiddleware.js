import jwt from 'jsonwebtoken';
import { User } from '../model/user.js';
import { Event } from '../model/event.js';

export const checkEventAccess = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // If accessing a specific event
        if (req.params.eventId) {
            const event = await Event.findById(req.params.eventId);
            if (!event) {
                return res.status(404).json({ success: false, error: 'Event not found' });
            }

            // Check if user is event owner
            const isOwner = event.organizer.userId.includes(user._id.toString());
            
            // Check if user is attending this event
            const isAttendee = user.attendingEventId && user.attendingEventId.equals(event._id);

            if (!isOwner && !isAttendee) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Access denied: You must be the event owner or an attendee'
                });
            }

            // Add user role to request object
            req.userRole = isOwner ? 'owner' : 'guest';
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

