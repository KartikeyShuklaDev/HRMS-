import React, { useState } from 'react';
import { markAttendance } from '../services/api';

function AttendanceForm() {
  const [formData, setFormData] = useState({
    employee_id: '',
    date: '',
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await markAttendance(formData);
      setFormData({
        employee_id: '',
        date: '',
        status: 'Present'
      });
      alert('Attendance marked successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to mark attendance';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="form-container">
      <h3>Mark Attendance</h3>
      <form onSubmit={handleSubmit} className="attendance-form">
        <input
          type="text"
          name="employee_id"
          placeholder="Employee ID"
          value={formData.employee_id}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={getTodayDate()}
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Mark Attendance'}
        </button>
      </form>
    </div>
  );
}

export default AttendanceForm;
