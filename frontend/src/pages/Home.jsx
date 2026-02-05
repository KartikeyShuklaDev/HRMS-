import React from 'react';

function Home({ onNavigate }) {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to HIREZONE- HRMS</h1>
        <p className="welcome-subtitle">Your Complete Employee Management Solution</p>
        
        <div className="system-details">
          <h2>About the System</h2>
          <p>
            HIREZONE- HRMS is a comprehensive Human Resource Management System designed to streamline
            your organization's employee management and attendance tracking processes.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Employee Management</h3>
              <p>Add, view, and manage employee records with ease. Auto-generate unique employee IDs
                 and maintain complete employee profiles including contact information and department assignments.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Attendance Tracking</h3>
              <p>Mark and monitor employee attendance efficiently. Edit past attendance records and
                 maintain accurate attendance logs with date-wise tracking capabilities.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Dashboard Analytics</h3>
              <p>Get comprehensive insights with our powerful dashboard. View employee-wise attendance summaries,
                 department statistics, and real-time attendance rates.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="navigation-section">
        <h2>Get Started</h2>
        <div className="nav-buttons">
          <button 
            className="nav-btn dashboard-btn"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="btn-icon">📈</div>
            <div className="btn-content">
              <h3>Dashboard</h3>
              <p>View analytics and employee summaries</p>
            </div>
          </button>
          
          <button 
            className="nav-btn employee-btn"
            onClick={() => onNavigate('employees')}
          >
            <div className="btn-icon">👥</div>
            <div className="btn-content">
              <h3>Employee Management</h3>
              <p>Add and manage employee records</p>
            </div>
          </button>
          
          <button 
            className="nav-btn attendance-btn"
            onClick={() => onNavigate('attendance')}
          >
            <div className="btn-icon">📊</div>
            <div className="btn-content">
              <h3>Attendance</h3>
              <p>Track and update attendance records</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
