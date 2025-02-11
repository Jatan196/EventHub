import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCalendarAlt } from "react-icons/fa";



const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        {/* Company Info */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FaCalendarAlt className="text-blue-400 text-2xl" />
            <h3 className="font-bold text-xl">EventHub</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Your one-stop platform for creating, managing, and discovering amazing events.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-400 hover:text-blue-300">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/events" className="text-gray-400 hover:text-blue-400">Browse Events</Link>
            </li>
            <li>
              <Link to="/events/new" className="text-gray-400 hover:text-blue-400">Create Event</Link>
            </li>
            <li>
              <Link to="/my-tickets" className="text-gray-400 hover:text-blue-400">My Tickets</Link>
            </li>
            <li>
              <Link to="/calendar" className="text-gray-400 hover:text-blue-400">Event Calendar</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-lg mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/help" className="text-gray-400 hover:text-blue-400">Help Center</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-blue-400">Contact Us</Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-400 hover:text-blue-400">FAQs</Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-400 hover:text-blue-400">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-400 hover:text-blue-400">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest events and updates.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 w-full rounded-l text-gray-900 focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 pt-8 border-t border-gray-800">
        <p className="text-center text-gray-400">
          © {new Date().getFullYear()} EventHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

