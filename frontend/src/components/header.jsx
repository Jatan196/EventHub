import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import toast from 'react-hot-toast';

const Header = () => {
    const navigate = useNavigate();

    // Directly read from localStorage
    const isAuthenticated = !!localStorage.getItem('userId');
    const isGuestUser = localStorage.getItem('isGuestUser') === 'true';

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/user/signout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                localStorage.removeItem('userId');
                localStorage.removeItem('isGuestUser');
                toast.success('Logged out successfully');
                navigate('/login');
            } else {
                toast.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed');
        }
    };

    return (
        <header className="bg-white shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link to="/" className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-blue-600 text-2xl" />
                    <h1 className="text-2xl font-bold text-blue-600">EventHub</h1>
                </Link>

                <div className="flex space-x-6">
                    <Link to="/" className="hover:text-blue-600">
                        Home
                    </Link>
                    <Link to="/events" className="hover:text-blue-600">
                        Browse Events
                    </Link>
                    {isAuthenticated && !isGuestUser && (
                        <>
                            <Link to="/dashboard" className="hover:text-blue-600">
                                Dashboard
                            </Link>
                            <Link to="/events/new" className="hover:text-blue-600">
                                Create Event
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <div className="cursor-pointer">
                            <FaUserCircle size={24} className="text-gray-600 hover:text-blue-600" />
                        </div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
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
        </header>
    );
};

export default Header;
