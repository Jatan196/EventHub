import express from 'express';
import {
  createEvent,
  getEventById,
  getAllEvents,
  deleteEvent,
  updateEventDetails,
  getEventLiveCounts,
  // joinEvent,
  // leaveEvent
} from '../controller/eventController.js';
import { checkEventAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);

// // Protected routes
// router.post('/', checkEventAccess, createEvent);
router.post('/', createEvent);
router.put('/:eventId', checkEventAccess, updateEventDetails);
router.delete('/:eventId', checkEventAccess, deleteEvent);

// // Event attendance routes
// router.post('/:eventId/join', checkEventAccess, joinEvent);
// router.post('/:eventId/leave', checkEventAccess, leaveEvent);
router.get('/:eventId/live-counts', checkEventAccess, getEventLiveCounts); // it should for both admin and user


export default router;
