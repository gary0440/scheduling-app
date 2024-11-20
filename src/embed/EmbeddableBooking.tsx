import React from 'react';
import { Calendar } from '../calendar/Calendar';
import { AuthProvider } from '../auth/AuthContext';

export const EmbeddableBooking: React.FC = () => {
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