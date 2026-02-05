import React, { useState } from 'react';
import { getAttendance, updateAttendance } from '../services/api';

function AttendanceTable() {
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isDateEditable = (recordDate) => {
    const today = new Date();
    const record = new Date(recordDate);
    today.setHours(0, 0, 0, 0);
    record.setHours(0, 0, 0, 0);
    return record <= today;
  };

  const handleFetch = async () => {
    if (!employeeId) {
      alert('Please enter an Employee ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setEditingRecord(null);

    try {
      const response = await getAttendance(employeeId, date);
      let records = response.data.records;
      
      // Apply date range filter if both dates are provided
      if (startDate && endDate) {
        records = records.filter(record => {
          const recordDate = new Date(record.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return recordDate >= start && recordDate <= end;
        });
      }
      
      // Calculate filtered present days
      const filteredPresentDays = records.filter(r => r.status === "Present").length;
      
      setResult({
        records: records,
        total_present_days: filteredPresentDays,
        total_records: records.length
      });
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch attendance';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    if (!isDateEditable(record.date)) {
      alert('Cannot edit attendance for future dates');
      return;
    }
    setEditingRecord({ ...record });
  };

  const handleSave = async () => {
    if (!editingRecord) return;

    setLoading(true);
    try {
      await updateAttendance(employeeId, editingRecord.date, {
        status: editingRecord.status
      });
      alert('Attendance updated successfully!');
      setEditingRecord(null);
      // Refresh the data
      await handleFetch();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to update attendance';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingRecord(null);
  };

  return (
    <div className="attendance-view">
      <h3>View Attendance</h3>
      <div className="search-form">
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Filter by date (optional)"
          max={getTodayDate()}
        />
        <button onClick={handleFetch} disabled={loading}>
          {loading ? 'Loading...' : 'View Attendance'}
        </button>
      </div>
      
      <div className="date-range-filter">
        <label>Filter by Date Range (optional):</label>
        <div className="date-range-inputs">
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={getTodayDate()}
          />
          <span>to</span>
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={getTodayDate()}
          />
          <button 
            onClick={() => { setStartDate(''); setEndDate(''); }}
            className="btn-clear"
          >
            Clear Range
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="attendance-results">
          <div className="stats-summary">
            <div className="stat-card">
              <span className="stat-label">Total Records:</span>
              <span className="stat-value">{result.total_records}</span>
            </div>
            <div className="stat-card present">
              <span className="stat-label">Present Days:</span>
              <span className="stat-value">{result.total_present_days}</span>
            </div>
            <div className="stat-card absent">
              <span className="stat-label">Absent Days:</span>
              <span className="stat-value">{result.total_records - result.total_present_days}</span>
            </div>
            {result.total_records > 0 && (
              <div className="stat-card rate">
                <span className="stat-label">Attendance Rate:</span>
                <span className="stat-value">
                  {((result.total_present_days / result.total_records) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {result.records.length === 0 ? (
            <p className="no-data">No attendance records found</p>
          ) : (
            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {result.records.map((record, index) => (
                    <tr key={index} className={record.status === 'Present' ? 'present' : 'absent'}>
                      <td>{record.date}</td>
                      <td>
                        {editingRecord && editingRecord.date === record.date ? (
                          <select
                            value={editingRecord.status}
                            onChange={(e) => setEditingRecord({ ...editingRecord, status: e.target.value })}
                            className="edit-select"
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                          </select>
                        ) : (
                          <span className={`status-badge ${record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                        )}
                      </td>
                      <td>
                        {editingRecord && editingRecord.date === record.date ? (
                          <div className="edit-actions">
                            <button onClick={handleSave} className="btn-save" disabled={loading}>
                              Save
                            </button>
                            <button onClick={handleCancel} className="btn-cancel">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(record)}
                            className="btn-edit"
                            disabled={!isDateEditable(record.date)}
                            title={!isDateEditable(record.date) ? 'Cannot edit future dates' : 'Edit attendance'}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendanceTable;
