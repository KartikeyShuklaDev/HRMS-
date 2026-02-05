import React, { useState } from 'react';
import Home from './pages/Home';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import DashboardPage from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'employees':
        return <Employees />;
      case 'attendance':
        return <Attendance />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={() => handleNavigate('home')} style={{ cursor: 'pointer' }}>
          HIREZONE- HRMS
        </h1>
        <p className="app-subtitle">Employee Management System</p>
        
        <nav className="header-nav">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigate('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-link ${currentPage === 'employees' ? 'active' : ''}`}
            onClick={() => handleNavigate('employees')}
          >
            Employees
          </button>
          <button 
            className={`nav-link ${currentPage === 'attendance' ? 'active' : ''}`}
            onClick={() => handleNavigate('attendance')}
          >
            Attendance
          </button>
        </nav>
      </header>
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
