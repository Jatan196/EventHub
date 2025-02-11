import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { socket } from '../index';

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventCounts, setEventCounts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('guestCountUpdate', ({ eventId, guestCount }) => {
            setEventCounts(prev => ({
                ...prev,
                [eventId]: guestCount
            }));
        });

        socket.on('eventCounts', (counts) => {
            setEventCounts(counts);
        });

        return () => {
            socket.off('guestCountUpdate');
            socket.off('eventCounts');
        };
    }, []);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8000/api/v1/events/owner/${userId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setEvents(response.data.data);
                response.data.data.forEach(event => {
                    socket.emit('joinEvent', {
                        eventId: event._id,
                        userId: localStorage.getItem('userId')
                    });
                });
            }
        } catch (error) {
            console.error('Error fetching your events:', error);
            toast.error('Failed to fetch your events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
        return () => {
            events.forEach(event => {
                socket.emit('leaveEvent', { eventId: event._id });
            });
        };
    }, []);

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`http://localhost:8000/api/v1/events/${eventId}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setEvents(events.filter(event => event._id !== eventId));
                socket.emit('leaveEvent', { eventId });
                toast.success('Event deleted successfully');
            } catch (error) {
                console.error('Error deleting event:', error);
                toast.error('Failed to delete event');
            }
        }
    };

    const handleEditEvent = (eventId) => {
        navigate(`/events/${eventId}/edit`);
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold">Event Dashboard</h1>
                </div>
                <Link
                    to="/events/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Create New Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event._id} className="border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-semibold">{event.title}</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditEvent(event._id)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <FaEdit size={20} />
                                </button>
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <FaTrash size={20} />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-2">
                            {new Date(event.eventDetails.startDate).toLocaleDateString()}
                        </p>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mb-2">
                            {event.category}
                        </span>
                        <p className="text-gray-700 mb-4">{event.description}</p>
                        <div className="flex items-center justify-end text-gray-600">
                            <div className="flex items-center">
                                <FaUsers className="mr-2 text-green-600" />
                                <span className="text-green-600">{eventCounts[event._id] || 0} live</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                                event.status === 'published' ? 'bg-green-100 text-green-800' :
                                event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {event.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">No events found.</p>
                    <Link
                        to="/events/new"
                        className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
                    >
                        Create your first event
                    </Link>
                </div>
            )}
        </div>
    );
};

export default EventDashboard; 