import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { FaUserCircle, FaUserCog } from 'react-icons/fa';

const Register = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        isGuestUser: false,
        address: "",
        organization: "",
        aadharNumber: "",
        gstNumber: ""
    });

    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log(user);

        try {
            const res = await fetch("http://localhost:8000/api/v1/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(user),
            });
            
            const data = await res.json();
            
            if (res.ok) {
                console.log("User signed up successfully:", data);
                navigate("/login");
                toast.success("Registered Successfully! Please Login");
            } else {
                console.log("Signup failed:", data);
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <div className="mt-4 flex justify-center space-x-4">
                    <button
                        onClick={() => setUser({ ...user, isGuestUser: false })}
                        className={`flex items-center px-4 py-2 rounded-lg ${!user.isGuestUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        <FaUserCog className="mr-2" />
                        Event Official
                    </button>
                    <button
                        onClick={() => setUser({ ...user, isGuestUser: true })}
                        className={`flex items-center px-4 py-2 rounded-lg ${user.isGuestUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        <FaUserCircle className="mr-2" />
                        Guest User
                    </button>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={onSubmitHandler} className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={user.phone}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Event Official Additional Information */}
                        {!user.isGuestUser && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 pt-4">Professional Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        value={user.organization}
                                        onChange={(e) => setUser({ ...user, organization: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your organization name"
                                        required={!user.isGuestUser}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Aadhar Card Number
                                    </label>
                                    <input
                                        type="text"
                                        value={user.aadharNumber}
                                        onChange={(e) => setUser({ ...user, aadharNumber: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your Aadhar number"
                                        required={!user.isGuestUser}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        GST Number
                                    </label>
                                    <input
                                        type="text"
                                        value={user.gstNumber}
                                        onChange={(e) => setUser({ ...user, gstNumber: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your GST number"
                                        required={!user.isGuestUser}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Guest User Address */}
                        {user.isGuestUser && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={user.address}
                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your address"
                                />
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
