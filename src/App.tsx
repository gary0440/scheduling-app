import React, { useState } from 'react';
import { Calendar } from './components/calendar/Calendar';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { LoginForm } from './components/auth/LoginForm';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { AvailabilitySettings } from './components/availability/AvailabilitySettings';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'dashboard' | 'availability'>('calendar');
  const { user, logout } = useAuth();

  const handleTimeSlotSelect = (startTime: Date) => {
    console.log('Time selected:', startTime);
  };

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeView === 'calendar'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Book Appointment
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeView === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              My Appointments
            </button>
            <button
              onClick={() => setActiveView('availability')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeView === 'availability'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Set Availability
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        {activeView === 'calendar' ? (
          <Calendar onTimeSlotSelect={handleTimeSlotSelect} />
        ) : activeView === 'dashboard' ? (
          <UserDashboard />
        ) : (
          <AvailabilitySettings />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;