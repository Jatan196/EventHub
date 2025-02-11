import { Event } from '../model/event.js';

export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ success: true, data: event });
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
    // Function to get latest counts
    const getLatestCounts = async () => {
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

      return {
        totalEvents,
        liveEvents,
        upcomingEvents,
        completedEvents,
        virtualEvents
      };
    };

    // Send initial counts