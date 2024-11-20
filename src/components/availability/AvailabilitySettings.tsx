import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { saveUserSchedule, getUserSchedule } from '../../services/availability';
import { WeeklySchedule, ValidationError } from '../../types/availability';

export const AvailabilitySettings: React.FC = () => {
  const { user } = useAuth();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    monday: { enabled: true, timeRanges: [{ start: '09:00', end: '17:00' }] },
    tuesday: { enabled: true, timeRanges: [{ start: '09:00', end: '17:00' }] },
    wednesday: { enabled: true, timeRanges: [{ start: '09:00', end: '17:00' }] },
    thursday: { enabled: true, timeRanges: [{ start: '09:00', end: '17:00' }] },
    friday: { enabled: true, timeRanges: [{ start: '09:00', end: '17:00' }] },
    saturday: { enabled: false, timeRanges: [{ start: '09:00', end: '17:00' }] },
    sunday: { enabled: false, timeRanges: [{ start: '09:00', end: '17:00' }] },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    const loadSchedule = async () => {
      if (user) {
        try {
          const savedSchedule = await getUserSchedule(user.uid);
          if (savedSchedule) {
            setWeeklySchedule(savedSchedule);
          }
        } catch (error) {
          console.error('Error loading schedule:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSchedule();
  }, [user]);

  const handleDayToggle = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const handleTimeChange = (day: string, rangeIndex: number, field: 'start' | 'end', value: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: prev[day].timeRanges.map((range, idx) =>
          idx === rangeIndex ? { ...range, [field]: value } : range
        )
      }
    }));
  };

  const addTimeRange = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: [...prev[day].timeRanges, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  const removeTimeRange = (day: string, rangeIndex: number) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: prev[day].timeRanges.filter((_, idx) => idx !== rangeIndex)
      }
    }));
  };

  const validateSchedule = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    Object.entries(weeklySchedule).forEach(([day, schedule]) => {
      if (schedule.enabled) {
        schedule.timeRanges.forEach((range, index) => {
          const start = parseInt(range.start.split(':')[0]) * 60 + parseInt(range.start.split(':')[1]);
          const end = parseInt(range.end.split(':')[0]) * 60 + parseInt(range.end.split(':')[1]);

          if (start >= end) {
            errors.push({
              day,
              rangeIndex: index,
              message: 'End time must be after start time'
            });
          }

          schedule.timeRanges.forEach((otherRange, otherIndex) => {
            if (index !== otherIndex) {
              const otherStart = parseInt(otherRange.start.split(':')[0]) * 60 + parseInt(otherRange.start.split(':')[1]);
              const otherEnd = parseInt(otherRange.end.split(':')[0]) * 60 + parseInt(otherRange.end.split(':')[1]);

              if ((start >= otherStart && start < otherEnd) || 
                  (end > otherStart && end <= otherEnd) ||
                  (start <= otherStart && end >= otherEnd)) {
                errors.push({
                  day,
                  rangeIndex: index,
                  message: 'Time ranges cannot overlap'
                });
              }
            }
          });
        });
      }
    });

    return errors;
  };

  const handleSave = async () => {
    if (!user) {
      console.log('No user found');
      return;
    }

    setSaving(true);
    try {
      console.log('Current user:', user.uid);
      console.log('Saving schedule:', weeklySchedule);
      await saveUserSchedule(user.uid, weeklySchedule);
      alert('Schedule saved!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Availability Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded-lg transition-colors ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg">
          <h3 className="text-red-700 font-medium mb-2">Please fix the following errors:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600">
                {`${error.day.charAt(0).toUpperCase() + error.day.slice(1)}: ${error.message}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(weeklySchedule).map(([day, schedule]) => (
          <div key={day} className="border-b pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={schedule.enabled}
                  onChange={() => handleDayToggle(day)}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-lg font-medium capitalize">{day}</span>
              </div>
              {schedule.enabled && (
                <button
                  onClick={() => addTimeRange(day)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  + Add Time Range
                </button>
              )}
            </div>

            {schedule.enabled && (
              <div className="space-y-3">
                {schedule.timeRanges.map((range, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <input
                      type="time"
                      value={range.start}
                      onChange={(e) => handleTimeChange(day, idx, 'start', e.target.value)}
                      className="border rounded-lg p-2"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={range.end}
                      onChange={(e) => handleTimeChange(day, idx, 'end', e.target.value)}
                      className="border rounded-lg p-2"
                    />
                    {schedule.timeRanges.length > 1 && (
                      <button
                        onClick={() => removeTimeRange(day, idx)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 