import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee } from '../services/api';

function EmployeeList({ refreshTrigger }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getEmployees();
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.phone && emp.phone.includes(searchTerm))
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await deleteEmployee(employeeId);
      alert('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee');
      console.error('Error deleting employee:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (employees.length === 0) {
    return <div className="no-data">No employees found. Add your first employee above!</div>;
  }

  return (
    <div className="table-container">
      <div className="list-header">
        <h3>Employee List ({filteredEmployees.length} of {employees.length})</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, ID, email, department, or phone..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button className="btn-clear-search" onClick={clearSearch}>
              Clear
            </button>
          )}
        </div>
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No employees found matching "{searchTerm}"
              </td>
            </tr>
          ) : (
            filteredEmployees.map((emp) => (
            <tr key={emp.employee_id}>
              <td>{emp.employee_id}</td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.department}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(emp.employee_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
