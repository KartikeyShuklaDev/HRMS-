import React, { useState, useEffect } from 'react';
import { getEmployees } from '../services/api';

function DatabaseStatus() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await getEmployees();
        // Check if the response contains demo data
        if (response.data && response.data.length > 0) {
          const hasDemo = response.data.some(emp => emp.employee_id === 'DEMO0001');
          setIsDemoMode(hasDemo);
        }
      } catch (err) {
        console.error('Error checking database status:', err);
      }
    };
    checkDatabaseStatus();
  }, []);

  if (!isDemoMode) return null;

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '1px solid #ffc107',
      color: '#856404',
      padding: '12px 20px',
      marginBottom: '20px',
      borderRadius: '4px',
      textAlign: 'center',
      fontSize: '14px'
    }}>
      <strong>⚠ Demo Mode:</strong> Database not connected. Showing sample data only. 
      Data cannot be saved or modified.
    </div>
  );
}

export default DatabaseStatus;
