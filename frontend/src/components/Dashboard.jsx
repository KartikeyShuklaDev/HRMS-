import React, { useState, useEffect } from 'react';
import { getDashboardStats, getEmployeeDashboard } from '../services/api';
import DashboardCharts from './DashboardCharts';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsResponse, employeeResponse] = await Promise.all([
        getDashboardStats(),
        getEmployeeDashboard()
      ]);
      setStats(statsResponse.data);
      setEmployeeData(employeeResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!stats || !employeeData) return null;

  // Filter employees by department
  const filteredEmployees = selectedDepartment === 'All' 
    ? employeeData.employees 
    : employeeData.employees.filter(emp => emp.department === selectedDepartment);

  // Get unique departments
  const departments = ['All', ...new Set(employeeData.employees.map(emp => emp.department))];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* Toggle Charts Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          className="btn-view-list"
          onClick={() => setShowCharts(!showCharts)}
        >
          {showCharts ? 'Hide Analytics Charts' : 'View Analytics Charts'}
        </button>
      </div>

      {/* Charts Section */}
      {showCharts && <DashboardCharts stats={stats} employeeData={employeeData} />}

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card primary">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Total Employees</h3>
            <p className="card-value">{stats.total_employees}</p>
          </div>
        </div>

        <div className="dashboard-card success">
          <div className="card-icon">✓</div>
          <div className="card-content">
            <h3>Total Present</h3>
            <p className="card-value">{stats.total_present}</p>
          </div>
        </div>

        <div className="dashboard-card danger">
          <div className="card-icon">✗</div>
          <div className="card-content">
            <h3>Total Absent</h3>
            <p className="card-value">{stats.total_absent}</p>
          </div>
        </div>

        <div className="dashboard-card info">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Attendance Rate</h3>
            <p className="card-value">{stats.attendance_rate}%</p>
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="today-summary">
        <h3>Today's Attendance ({stats.today.date})</h3>
        <div className="today-stats">
          <div className="today-stat">
            <span className="label">Present:</span>
            <span className="value present-text">{stats.today.present}</span>
          </div>
          <div className="today-stat">
            <span className="label">Absent:</span>
            <span className="value absent-text">{stats.today.absent}</span>
          </div>
          <div className="today-stat">
            <span className="label">Total Marked:</span>
            <span className="value">{stats.today.total}</span>
          </div>
          <div className="today-stat">
            <span className="label">Rate:</span>
            <span className="value">{stats.today.attendance_rate}%</span>
          </div>
        </div>
      </div>

      {/* Employee Dashboard Section */}
      <div className="employee-dashboard-section">
        <div className="employee-dashboard-header">
          <h3>Employee Attendance Summary</h3>
          <div className="department-filter">
            <label>Filter by Department:</label>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="employee-cards-grid">
          {filteredEmployees.map((employee) => (
            <div key={employee.employee_id} className="employee-summary-card">
              <div className="employee-header">
                <div className="employee-info">
                  <h4 className="employee-name">{employee.full_name}</h4>
                  <span className="employee-id-small">ID: {employee.employee_id}</span>
                </div>
                <div className="employee-dept-badge">{employee.department}</div>
              </div>

              <div className="employee-contact">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span className="contact-text">{employee.email}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span className="contact-text">{employee.phone}</span>
                </div>
              </div>

              <div className="employee-stats">
                <div className="emp-stat">
                  <span className="emp-stat-label">Total Records</span>
                  <span className="emp-stat-value">{employee.total_records}</span>
                </div>
                <div className="emp-stat present-stat">
                  <span className="emp-stat-label">Present</span>
                  <span className="emp-stat-value">{employee.present_count}</span>
                </div>
                <div className="emp-stat absent-stat">
                  <span className="emp-stat-label">Absent</span>
                  <span className="emp-stat-value">{employee.absent_count}</span>
                </div>
                <div className="emp-stat rate-stat">
                  <span className="emp-stat-label">Rate</span>
                  <span className="emp-stat-value">{employee.attendance_rate}%</span>
                </div>
              </div>

              <div className="employee-today">
                <span className="today-label">Today's Status:</span>
                <span className={`today-status ${employee.today_status.toLowerCase().replace(' ', '-')}`}>
                  {employee.today_status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="no-data">No employees found in this department.</div>
        )}
      </div>

      {/* Department Statistics */}
      {stats.department_stats && stats.department_stats.length > 0 && (
        <div className="department-stats">
          <h3>Employees by Department</h3>
          <div className="department-grid">
            {stats.department_stats.map((dept, index) => (
              <div key={index} className="department-card">
                <span className="dept-name">{dept.department}</span>
                <span className="dept-count">{dept.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
