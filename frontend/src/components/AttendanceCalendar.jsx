import React, { useState } from 'react';
import { getAttendance } from '../services/api';

function AttendanceCalendar() {
  const [employeeId, setEmployeeId] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const handleFetch = async () => {
    if (!employeeId) {
      alert('Please enter an Employee ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getAttendance(employeeId, '');
      setAttendanceData(response.data.records);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch attendance';
      setError(errorMsg);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceForDate = (dateStr) => {
    return attendanceData.find(record => record.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    const today = new Date();
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    if (nextMonthDate <= today) {
      setCurrentDate(nextMonthDate);
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Day headers
    dayNames.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="calendar-day-header">
          {day}
        </div>
      );
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const attendance = getAttendanceForDate(dateStr);
      const isFuture = date > today;
      
      let className = 'calendar-day';
      if (isFuture) {
        className += ' future';
      } else if (attendance) {
        className += attendance.status === 'Present' ? ' present' : ' absent';
      }

      days.push(
        <div key={day} className={className} title={attendance ? `${attendance.status}` : 'No record'}>
          <div className="day-number">{day}</div>
          {attendance && (
            <div className="day-status">
              {attendance.status === 'Present' ? '✓' : '✗'}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const canGoNext = () => {
    const today = new Date();
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    return nextMonthDate <= today;
  };

  return (
    <div className="attendance-calendar-container">
      <h3>Attendance Calendar View</h3>
      
      <div className="calendar-controls">
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="calendar-input"
        />
        <button onClick={handleFetch} disabled={loading} className="btn-view-list">
          {loading ? 'Loading...' : 'Load Attendance'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {attendanceData.length > 0 && (
        <>
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-box present"></span>
              <span>Present</span>
            </div>
            <div className="legend-item">
              <span className="legend-box absent"></span>
              <span>Absent</span>
            </div>
            <div className="legend-item">
              <span className="legend-box no-record"></span>
              <span>No Record</span>
            </div>
          </div>

          <div className="calendar-navigation">
            <button onClick={previousMonth} className="nav-btn">
              ← Previous
            </button>
            <h4>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <button onClick={nextMonth} className="nav-btn" disabled={!canGoNext()}>
              Next →
            </button>
          </div>

          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </>
      )}
    </div>
  );
}

export default AttendanceCalendar;
