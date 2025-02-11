import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const EventHomePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    timeFrame: 'upcoming',
    category: 'all',
    startDate: '',
    endDate: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is event official
    const token = localStorage.getItem('token');
    const isGuestUser = localStorage.getItem('isGuestUser') === 'true';
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!isGuestUser) {
      navigate('/dashboard');
      return;
    }

    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/events');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/v1/events/${eventId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Successfully joined the event!');
      fetchEvents(); // Refresh events list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join event');
    }
  };

  useEffect(() => {
    filterEvents();
  }, [filters, events]);

  const filterEvents = () => {
    let filtered = [...events];
    const currentDate = new Date();

    // Filter by timeframe
    if (filters.timeFrame === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.eventDetails.startDate) >= currentDate);
    } else if (filters.timeFrame === 'past') {
      filtered = filtered.filter(event => new Date(event.eventDetails.endDate) < currentDate);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(
        event => new Date(event.eventDetails.startDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        event => new Date(event.eventDetails.endDate) <= new Date(filters.endDate)
      );
    }

    setFilteredEvents(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Events</h1>
      
      {/* Filters */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="timeFrame"
            value={filters.timeFrame}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
            <option value="all">All Events</option>
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="all">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Social">Social</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 border rounded"
            placeholder="Start Date"
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 border rounded"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event._id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">
              {new Date(event.eventDetails.startDate).toLocaleDateString()}
            </p>
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mb-2">
              {event.category}
            </span>
            <p className="mt-2 text-gray-700">{event.description}</p>
            <div className="mt-4">
              <button
                onClick={() => handleJoinEvent(event._id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Join Event
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No events found matching your criteria.</p>
      )}
    </div>
  );
};

export default EventHomePage;
