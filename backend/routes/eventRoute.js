import express from 'express';
import {
  createEvent,
  getEventById,
  getAllEvents,
  deleteEvent,
  updateEventDetails,
  getEventLiveCounts,
  getEventsByOwner,
  joinEvent,
  leaveEvent
} from '../controller/eventController.js';
import { authenticate, eventOfficialAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all events
router.get('/', authenticate, getAllEvents);

// Get events by owner - specific route before parameterized routes
router.get('/owner/:userId', authenticate, getEventsByOwner);

// Event attendance routes
router.post('/:eventId/join', authenticate, joinEvent);
router.post('/:eventId/leave', authenticate, leaveEvent);
router.get('/:eventId/live-counts', authenticate, getEventLiveCounts);

// Event CRUD operations
router.get('/:eventId', authenticate, getEventById);
router.post('/', authenticate, eventOfficialAccess, createEvent);
router.put('/:eventId', authenticate, eventOfficialAccess, updateEventDetails);
router.delete('/:eventId', authenticate, eventOfficialAccess, deleteEvent);

export default router;
