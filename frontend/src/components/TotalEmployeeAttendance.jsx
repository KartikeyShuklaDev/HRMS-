import React, { useState } from 'react';
import { getEmployees, getAttendance } from '../services/api';

function TotalEmployeeAttendance() {
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllEmployeeAttendance = async () => {
    setLoading(true);
    setError('');

    try {
      // First, get all employees
      const employeesResponse = await getEmployees();
      const employeesList = employeesResponse.data;

      // Then fetch attendance for each employee
      const summaryPromises = employeesList.map(async (emp) => {
        try {
          const attendanceResponse = await getAttendance(emp.employee_id, '');
          const records = attendanceResponse.data.records;
          const presentCount = records.filter(r => r.status === 'Present').length;
          const absentCount = records.filter(r => r.status === 'Absent').length;
          const totalRecords = records.length;
          const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

          return {
            employee_id: emp.employee_id,
            full_name: emp.full_name,
            department: emp.department,
            total_records: totalRecords,
            present_count: presentCount,
            absent_count: absentCount,
            attendance_rate: attendanceRate
          };
        } catch (err) {
          return {
            employee_id: emp.employee_id,
            full_name: emp.full_name,
            department: emp.department,
            total_records: 0,
            present_count: 0,
            absent_count: 0,
            attendance_rate: 0
          };
        }
      });

      const summaryResults = await Promise.all(summaryPromises);
      setAttendanceSummary(summaryResults);
    } catch (err) {
      setError('Failed to fetch employee attendance data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading employee attendance data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="total-attendance-container">
      <h3>Total Employee Attendance Summary</h3>
      
      <button 
        onClick={fetchAllEmployeeAttendance} 
        className="btn-view-list"
        disabled={loading}
        style={{ marginBottom: '20px' }}
      >
        {loading ? 'Loading...' : 'Refresh Data'}
      </button>

      {attendanceSummary.length > 0 && (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Total Records</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSummary.map((emp) => (
                <tr key={emp.employee_id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.total_records}</td>
                  <td className="present-cell">{emp.present_count}</td>
                  <td className="absent-cell">{emp.absent_count}</td>
                  <td>
                    <span className={`rate-badge ${emp.attendance_rate >= 75 ? 'good' : emp.attendance_rate >= 50 ? 'average' : 'low'}`}>
                      {emp.attendance_rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attendanceSummary.length === 0 && !loading && (
        <p className="no-data">Click "Refresh Data" to load employee attendance summary</p>
      )}
    </div>
  );
}

export default TotalEmployeeAttendance;
