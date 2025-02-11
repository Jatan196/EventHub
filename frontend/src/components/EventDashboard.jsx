import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/v1/events', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter events where user is organizer
                const userId = localStorage.getItem('userId');
                const myEvents = response.data.data.filter(event => 
                    event.organizer?.userId?.includes(userId)
                );
                setEvents(myEvents);
            } catch (error) {
                
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8000/api/v1/events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(events.filter(event => event._id !== eventId));
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Events</h1>
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
                                <Link
                                    to={`/events/${event._id}/edit`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <FaEdit size={20} />
                                </Link>
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
                        <div className="flex items-center text-gray-600">
                            <FaUsers className="mr-2" />
                            <span>{event.totalAttendees || 0} attendees</span>
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
                    <p className="text-gray-500">You haven't created any events yet.</p>
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