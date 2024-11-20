import React, { useState } from 'react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Simulated appointments data - replace with real data later
  const [appointments] = useState<Appointment[]>([
    { id: '1', date: new Date(2024, 2, 25, 9, 0), status: 'upcoming' },
    { id: '2', date: new Date(2024, 2, 26, 14, 30), status: 'upcoming' },
    { id: '3', date: new Date(2024, 2, 20, 11, 0), status: 'completed' },
  ]);

  const handleCancelAppointment = (id: string) => {
    // Add cancellation logic here
    console.log('Cancelling appointment:', id);
  };

  const handleReschedule = (id: string) => {
    // Add rescheduling logic here
    console.log('Rescheduling appointment:', id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === 'past'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Past
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments
          .filter(apt => 
            activeTab === 'upcoming' 
              ? apt.status === 'upcoming'
              : apt.status === 'completed' || apt.status === 'cancelled'
          )
          .map(appointment => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-medium text-gray-800">
                    {format(appointment.date, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-gray-600">
                    {format(appointment.date, 'h:mm a')}
                  </div>
                  <div className={`
                    mt-2 inline-block px-2 py-1 rounded-full text-sm
                    ${appointment.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'}
                  `}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </div>
                </div>

                {appointment.status === 'upcoming' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReschedule(appointment.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}; 