import React, { useState } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceCalendar from '../components/AttendanceCalendar';
import TotalEmployeeAttendance from '../components/TotalEmployeeAttendance';

function Attendance() {
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showViewAttendance, setShowViewAttendance] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showTotalAttendance, setShowTotalAttendance] = useState(false);

  return (
    <section className="section">
      <h2>Attendance Management</h2>
      
      <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          className="btn-view-list"
          onClick={() => setShowMarkAttendance(!showMarkAttendance)}
        >
          {showMarkAttendance ? 'Hide Mark Attendance' : 'Mark Attendance'}
        </button>
        
        <button 
          className="btn-view-list"
          onClick={() => setShowViewAttendance(!showViewAttendance)}
        >
          {showViewAttendance ? 'Hide View Attendance' : 'View Attendance'}
        </button>

        <button 
          className="btn-view-list"
          onClick={() => setShowCalendarView(!showCalendarView)}
        >
          {showCalendarView ? 'Hide Calendar View' : 'Calendar View'}
        </button>

        <button 
          className="btn-view-list"
          onClick={() => setShowTotalAttendance(!showTotalAttendance)}
        >
          {showTotalAttendance ? 'Hide Total Employee Attendance' : 'Total Employee Attendance'}
        </button>
      </div>

      <div className="attendance-container">
        {showMarkAttendance && <AttendanceForm />}
        {showViewAttendance && <AttendanceTable />}
        {showCalendarView && <AttendanceCalendar />}
        {showTotalAttendance && <TotalEmployeeAttendance />}
      </div>
    </section>
  );
}

export default Attendance;
