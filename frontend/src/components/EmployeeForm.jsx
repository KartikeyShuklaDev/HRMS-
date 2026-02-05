import React, { useState, useEffect } from 'react';
import { addEmployee, getDepartments, generateEmployeeId } from '../services/api';

function EmployeeForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    phone: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isAutoGenerate, setIsAutoGenerate] = useState(true);
  const [generatingId, setGeneratingId] = useState(false);

  useEffect(() => {
    // Fetch departments on component mount
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        setDepartments(response.data.departments);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments');
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Auto-generate ID when name changes and auto-generate is enabled
    if (isAutoGenerate && formData.full_name.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        handleGenerateId();
      }, 500); // Debounce for 500ms
      return () => clearTimeout(timeoutId);
    } else if (isAutoGenerate && formData.full_name.trim().length < 2) {
      setFormData(prev => ({ ...prev, employee_id: '' }));
    }
  }, [formData.full_name, isAutoGenerate]);

  const handleGenerateId = async () => {
    if (formData.full_name.trim().length < 2) return;
    
    setGeneratingId(true);
    try {
      const response = await generateEmployeeId(formData.full_name);
      setFormData(prev => ({ ...prev, employee_id: response.data.employee_id }));
    } catch (err) {
      console.error('Error generating employee ID:', err);
    } finally {
      setGeneratingId(false);
    }
  };

  const handleToggleMode = () => {
    setIsAutoGenerate(!isAutoGenerate);
    if (isAutoGenerate) {
      // Switching to manual mode - clear the ID
      setFormData(prev => ({ ...prev, employee_id: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addEmployee(formData);
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        phone: '',
        department: ''
      });
      alert('Employee added successfully!');
      if (onEmployeeAdded) onEmployeeAdded();
    } catch (err) {
      console.error('Error adding employee:', err);
      let errorMsg = 'Failed to add employee';
      
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.response?.status === 503) {
        errorMsg = 'Database not available. The app is running in demo mode. Please configure MongoDB to save employees.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Add New Employee</h3>
      {error && <div className="error-message">{error}</div>}
      
      <div className="id-mode-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={isAutoGenerate}
            onChange={handleToggleMode}
          />
          <span className="toggle-text">
            {isAutoGenerate ? 'Auto-Generate Employee ID' : 'Manual Employee ID'}
          </span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="employee-form">
        {!isAutoGenerate && (
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={handleChange}
            required
          />
        )}
        {isAutoGenerate && formData.employee_id && (
          <div className="generated-id-display">
            <label>Generated Employee ID:</label>
            <span className="employee-id-badge">{formData.employee_id}</span>
            {generatingId && <span className="generating-text">Generating...</span>}
          </div>
        )}
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          title="Please enter exactly 10 digits"
          required
        />
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
