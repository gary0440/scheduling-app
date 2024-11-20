import React from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar } from './components/calendar/Calendar';
import { AuthProvider } from './components/auth/AuthContext';
import './index.css';

// Create a function to initialize the widget
const EmbeddableBooking: React.FC = () => {
  const handleTimeSlotSelect = (startTime: Date) => {
    console.log('Time selected:', startTime);
    // Add your booking logic here
  };

  return (
    <div className="mira-booking-widget">
      <AuthProvider>
        <Calendar onTimeSlotSelect={handleTimeSlotSelect} />
      </AuthProvider>
    </div>
  );
};

// Add the initialization function to the window object
declare global {
  interface Window {
    initMiraBooking?: (elementId: string) => void;
  }
}

window.initMiraBooking = (elementId: string) => {
  const container = document.getElementById(elementId);
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <EmbeddableBooking />
      </React.StrictMode>
    );
  }
}; 