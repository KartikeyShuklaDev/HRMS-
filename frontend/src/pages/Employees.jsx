import React, { useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import DatabaseStatus from '../components/DatabaseStatus';

function Employees() {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const handleEmployeeAdded = () => {
    setRefreshCounter(prev => prev + 1);
  };

  return (
    <section className="section">
      <h2>Employee Management</h2>
      <DatabaseStatus />
      
      <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          className="btn-view-list"
          onClick={() => setShowEmployeeForm(!showEmployeeForm)}
        >
          {showEmployeeForm ? 'Hide Add Employee Form' : 'Add Employee'}
        </button>
        
        <button 
          className="btn-view-list"
          onClick={() => setShowEmployeeList(!showEmployeeList)}
        >
          {showEmployeeList ? 'Hide Employee List' : 'View Employee List'}
        </button>
      </div>

      {showEmployeeForm && <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />}
      {showEmployeeList && <EmployeeList refreshTrigger={refreshCounter} />}
    </section>
  );
}

export default Employees;
