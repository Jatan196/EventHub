import { Event } from '../model/event.js';
import { User } from '../model/user.js';

export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: {
        userId: req.user._id  // Ensure this is a single ObjectId
      }
    };
    const event = new Event(eventData);
    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    
    const user = req.user;
    if (!user.isGuestUser) {
      return res.status(403).json({ 
        success: false, 
        error: 'Only guest users can join events' 
      });
    }

    // Directly add user to attendees
    event.attendees.push({ userId: user._id });
    event.totalAttendees += 1;
    await event.save();

    // Update user's attending event
    user.attendingEventId = event._id;
    await user.save();

    const io = req.app.get('io');
    io.to(`event_${event._id}`).emit('guestCountUpdate', {
      eventId: event._id,
      guestCount: event.totalAttendees
    });

    res.status(200).json({ 
      success: true, 
      message: 'Successfully joined event',
      data: event 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const user = req.user;
    if (!user.isGuestUser) {
      return res.status(403).json({ 
        success: false, 
        error: 'Only guest users can leave events' 
      });
    }

    // Check if user is actually attending this event
    if (!user.attendingEventId || user.attendingEventId.toString() !== event._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        error: 'User is not attending this event' 
      });
    }

    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.userId.toString() === user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ 
        success: false, 
        error: 'User has not joined this event' 
      });
    }

    event.attendees.splice(attendeeIndex, 1);
    event.totalAttendees = Math.max(0, event.totalAttendees - 1);
    await event.save();

    // Clear user's attending event
    user.attendingEventId = null;
    await user.save();

    const io = req.app.get('io');
    io.to(`event_${event._id}`).emit('guestCountUpdate', {
      eventId: event._id,
      guestCount: event.totalAttendees
    });

    res.status(200).json({ 
      success: true, 
      message: 'Successfully left event',
      data: event 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getEventsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    const events = await Event.find({
      'organizer.userId': ownerId
    });
    
    if (!events) {
      return res.status(404).json({ 
        success: false, 
        message: 'No events found for this user' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: events 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (req.body.eventDetails) {
      if (req.body.eventDetails.startDate) {
        event.eventDetails.startDate = req.body.eventDetails.startDate;
      }
      if (req.body.eventDetails.endDate) {
        event.eventDetails.endDate = req.body.eventDetails.endDate;
      }
      if (req.body.eventDetails.location) {
        event.eventDetails.location = req.body.eventDetails.location;
      }
      if (req.body.eventDetails.maxCapacity) {
        event.eventDetails.maxCapacity = req.body.eventDetails.maxCapacity;
      }
      if (req.body.eventDetails.isVirtual !== undefined) {
        event.eventDetails.isVirtual = req.body.eventDetails.isVirtual;
      }
      if (req.body.eventDetails.meetingLink) {
        event.eventDetails.meetingLink = req.body.eventDetails.meetingLink;
      }
    }

    if (req.body.title) event.title = req.body.title;
    if (req.body.description) event.description = req.body.description;
    if (req.body.category) event.category = req.body.category;
    if (req.body.ticketPrice !== undefined) event.ticketPrice = req.body.ticketPrice;
    if (req.body.status) event.status = req.body.status;

    await event.save();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getEventLiveCounts = async (socket) => {
  try {
    const totalEvents = await Event.countDocuments();
    const liveEvents = await Event.countDocuments({ 
      'eventDetails.startDate': { $lte: new Date() },
      'eventDetails.endDate': { $gte: new Date() },
      status: 'published'
    });
    const upcomingEvents = await Event.countDocuments({ 
      'eventDetails.startDate': { $gt: new Date() },
      status: 'published'
    });
    const completedEvents = await Event.countDocuments({ 
      'eventDetails.endDate': { $lt: new Date() },
      status: 'completed'
    });
    const virtualEvents = await Event.countDocuments({ 
      'eventDetails.isVirtual': true,
      status: 'published'
    });

    const counts = {
      totalEvents,
      liveEvents,
      upcomingEvents,
      completedEvents,
      virtualEvents
    };

    socket.emit('eventCounts', counts);
  } catch (error) {
    socket.emit('error', { success: false, error: error.message });
  }
};
