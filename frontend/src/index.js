import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { io } from 'socket.io-client';
import { Toaster } from 'react-hot-toast';

// Initialize socket connection
export const socket = io('http://localhost:8000', {
  withCredentials: true,
  transports: ['websocket'] 
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Toaster position="top-center" />
    <App />
  </React.StrictMode>
);

