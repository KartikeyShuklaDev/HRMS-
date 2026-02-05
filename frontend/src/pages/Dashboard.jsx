import React from 'react';
import Dashboard from '../components/Dashboard';
import DatabaseStatus from '../components/DatabaseStatus';

function DashboardPage() {
  return (
    <section className="section">
      <h2>Dashboard</h2>
      <DatabaseStatus />
      <Dashboard />
    </section>
  );
}

export default DashboardPage;
