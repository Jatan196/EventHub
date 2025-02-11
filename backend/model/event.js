import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  organizer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  eventDetails: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    location: {
      address: {
        type: String
      },
      city: {
        type: String
      }
    },
    maxCapacity: {
      type: Number
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    meetingLink: {
      type: String
    }
  },
  attendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: { 
    type: String,
    default: 'draft'
  },
  totalAttendees: { 
    type: Number, 
    default: 0 
  },
  ticketPrice: { 
    type: Number, 
    default: 0 
  },
  images: [{
    url: { 
      type: String 
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Event = mongoose.model('Event', eventSchema);

