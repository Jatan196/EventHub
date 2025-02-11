import jwt from 'jsonwebtoken';
import { User } from '../model/user.js';
import { Event } from '../model/event.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

export const eventOfficialAccess = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        if (req.user.isGuestUser) {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied: Event official access required' 
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: 'Error checking event official access' 
        });
    }
};
