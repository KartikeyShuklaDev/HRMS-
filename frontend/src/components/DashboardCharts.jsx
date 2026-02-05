import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

function DashboardCharts({ stats, employeeData }) {
  if (!stats || !employeeData) return null;

  // Color palette
  const COLORS = ['#26a69a', '#00acc1', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#3f51b5', '#e91e63'];

  // Prepare data for Overall Attendance Pie Chart
  const overallAttendanceData = [
    { name: 'Present', value: stats.total_present, color: '#4caf50' },
    { name: 'Absent', value: stats.total_absent, color: '#f44336' }
  ];

  // Prepare data for Department Bar Chart
  const departmentData = stats.department_stats?.map(dept => ({
    department: dept.department,
    employees: dept.count
  })) || [];

  // Prepare data for Top Performers (highest attendance rate)
  const topPerformers = [...employeeData.employees]
    .sort((a, b) => b.attendance_rate - a.attendance_rate)
    .slice(0, 5)
    .map(emp => ({
      name: emp.full_name.split(' ').slice(0, 2).join(' '), // First two names
      rate: emp.attendance_rate,
      present: emp.present_count,
      absent: emp.absent_count
    }));

  // Prepare data for Department-wise Attendance
  const departmentAttendance = {};
  employeeData.employees.forEach(emp => {
    if (!departmentAttendance[emp.department]) {
      departmentAttendance[emp.department] = { present: 0, absent: 0, total: 0 };
    }
    departmentAttendance[emp.department].present += emp.present_count;
    departmentAttendance[emp.department].absent += emp.absent_count;
    departmentAttendance[emp.department].total += emp.total_records;
  });

  const deptAttendanceData = Object.keys(departmentAttendance).map(dept => ({
    department: dept,
    present: departmentAttendance[dept].present,
    absent: departmentAttendance[dept].absent,
    rate: departmentAttendance[dept].total > 0 
      ? ((departmentAttendance[dept].present / departmentAttendance[dept].total) * 100).toFixed(1)
      : 0
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-charts">
      <h3>Analytics & Insights</h3>

      <div className="charts-grid">
        {/* Overall Attendance Distribution */}
        <div className="chart-card">
          <h4>Overall Attendance Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overallAttendanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {overallAttendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Employees by Department */}
        <div className="chart-card">
          <h4>Employees by Department</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="employees" fill="#26a69a" name="Employee Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="chart-card wide">
          <h4>Top 5 Performers (Attendance Rate)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPerformers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="rate" fill="#4caf50" name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department-wise Attendance Comparison */}
        <div className="chart-card wide">
          <h4>Department-wise Attendance</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="present" fill="#4caf50" name="Present Days" />
              <Bar dataKey="absent" fill="#f44336" name="Absent Days" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Attendance Rate Line Chart */}
        <div className="chart-card">
          <h4>Department Attendance Rates</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deptAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#26a69a" 
                strokeWidth={3}
                name="Attendance Rate %"
                dot={{ fill: '#26a69a', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Distribution by Performance */}
        <div className="chart-card">
          <h4>Performance Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { 
                    name: 'Excellent (≥90%)', 
                    value: employeeData.employees.filter(e => e.attendance_rate >= 90).length,
                    color: '#4caf50'
                  },
                  { 
                    name: 'Good (75-89%)', 
                    value: employeeData.employees.filter(e => e.attendance_rate >= 75 && e.attendance_rate < 90).length,
                    color: '#8bc34a'
                  },
                  { 
                    name: 'Average (50-74%)', 
                    value: employeeData.employees.filter(e => e.attendance_rate >= 50 && e.attendance_rate < 75).length,
                    color: '#ff9800'
                  },
                  { 
                    name: 'Poor (<50%)', 
                    value: employeeData.employees.filter(e => e.attendance_rate < 50).length,
                    color: '#f44336'
                  }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2, 3].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
