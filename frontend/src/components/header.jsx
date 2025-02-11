import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserCircle, FaTicketAlt } from "react-icons/fa";

const Header = () => {
    const isAuthenticated = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link to="/" className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-blue-600 text-2xl" />
                    <h1 className="text-2xl font-bold text-blue-600">EventHub</h1>
                </Link>

                <div className="flex space-x-6">
                    <Link to="/" className="hover:text-blue-600 flex items-center space-x-1">
                        <span>Home</span>
                    </Link>
                    <Link to="/events" className="hover:text-blue-600 flex items-center space-x-1">
                        <span>Browse Events</span>
                    </Link>
                    {isAuthenticated && (
                        <Link to="/events/new" className="hover:text-blue-600 flex items-center space-x-1">
                            <span>Create Event</span>
                        </Link>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {/* <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="p-2 outline-none w-full"
                        />
                        <button className="p-2 bg-blue-600 text-white hover:bg-blue-700">
                            Search
                        </button>
                    </div>
                     */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && (
                            <Link to="/my-tickets" className="text-gray-600 hover:text-blue-600">
                                <FaTicketAlt size={20} />
                            </Link>
                        )}
                        <div className="relative group">
                            <Link to={isAuthenticated ? "/profile" : "/login"} className="text-gray-600 hover:text-blue-600 cursor-pointer">
                                <FaUserCircle size={24} />
                            </Link>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="absolute top-0 right-0 w-48 bg-white rounded-md shadow-lg py-1">
                                    {isAuthenticated ? (
                                        <>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Login
                                            </Link>
                                            <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
