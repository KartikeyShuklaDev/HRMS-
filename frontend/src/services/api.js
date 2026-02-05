import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee APIs
export const getDepartments = () => api.get('/employees/departments');

export const generateEmployeeId = (fullName) => 
  api.post('/employees/generate-id', { full_name: fullName });

export const getEmployees = () => api.get('/employees');

export const addEmployee = (data) => api.post('/employees', data);

export const deleteEmployee = (employeeId) => api.delete(`/employees/${employeeId}`);

// Attendance APIs
export const markAttendance = (data) => api.post('/attendance', data);

export const updateAttendance = (employeeId, date, data) => 
  api.put(`/attendance/${employeeId}/${date}`, data);

export const getAttendance = (employeeId, date = null) => {
  const params = {};
  if (date) {
    params.date = date;
  }
  return api.get(`/attendance/${employeeId}`, { params });
};

// Dashboard APIs
export const getDashboardStats = () => api.get('/dashboard/stats');

export const getEmployeeDashboard = () => api.get('/dashboard/employees');

export default api;
