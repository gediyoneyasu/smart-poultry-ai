import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './CompanyDashboard.css';

const API_URL = 'http://localhost:5001/api';

const CompanyDashboard = () => {
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Form states
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [newFarm, setNewFarm] = useState({ name: '', location: '', size: '', poultryCount: '' });
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', username: '', password: '', role: 'farm_worker' });

  useEffect(() => {
    const token = localStorage.getItem('poultryToken');
    const userData = JSON.parse(localStorage.getItem('poultryUser') || '{}');
    
    if (!token || userData.role !== 'company_admin') {
      toast.error('Please login as company');
      navigate('/company-auth');
      return;
    }
    
    setUser(userData);
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    setLoading(true);
    const token = localStorage.getItem('poultryToken');
    
    try {
      // Load farms
      const farmsRes = await axios.get(`${API_URL}/farm/farms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarms(Array.isArray(farmsRes.data) ? farmsRes.data : []);
      
      // Load employees
      const employeesRes = await axios.get(`${API_URL}/company/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(employeesRes.data.employees || []);
      
    } catch (error) {
      console.error('Error loading company data:', error);
    }
    setLoading(false);
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('poultryToken');
    
    try {
      const response = await axios.post(`${API_URL}/farm/farms`, newFarm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarms([...farms, response.data]);
      setNewFarm({ name: '', location: '', size: '', poultryCount: '' });
      setShowFarmForm(false);
      toast.success('Farm created successfully!');
    } catch (error) {
      toast.error('Error creating farm');
    }
    setLoading(false);
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('poultryToken');
    
    try {
      const response = await axios.post(`${API_URL}/company/employees`, newEmployee, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees([...employees, response.data]);
      setNewEmployee({ name: '', email: '', username: '', password: '', role: 'farm_worker' });
      setShowEmployeeForm(false);
      toast.success('Employee added successfully!');
    } catch (error) {
      toast.error('Error adding employee');
    }
    setLoading(false);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Delete this employee?')) return;
    
    const token = localStorage.getItem('poultryToken');
    try {
      await axios.delete(`${API_URL}/company/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(employees.filter(emp => emp._id !== employeeId));
      toast.success('Employee deleted');
    } catch (error) {
      toast.error('Error deleting employee');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('poultryToken');
    localStorage.removeItem('poultryUser');
    navigate('/company-auth');
    toast.success('Logged out');
  };

  return (
    <div className="company-dashboard">
      <div className="dashboard-nav">
        <div className="logo">
          <span>🏢</span>
          <h2>Company Portal</h2>
        </div>
        <div className="nav-tabs">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            📊 Overview
          </button>
          <button className={activeTab === 'farms' ? 'active' : ''} onClick={() => setActiveTab('farms')}>
            🏠 Farms ({farms.length})
          </button>
          <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>
            👥 Employees ({employees.length})
          </button>
        </div>
        <div className="user-info">
          <span>👤 {user?.name || user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h1>Welcome, {user?.name || user?.username}!</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏠</div>
                <div className="stat-info">
                  <h3>{farms.length}</h3>
                  <p>Total Farms</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{employees.length}</h3>
                  <p>Total Employees</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🐔</div>
                <div className="stat-info">
                  <h3>{farms.reduce((sum, f) => sum + (f.poultryCount || 0), 0)}</h3>
                  <p>Total Birds</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'farms' && (
          <div className="farms-section">
            <div className="section-header">
              <h2>Company Farms</h2>
              <button onClick={() => setShowFarmForm(true)} className="add-btn">+ Add Farm</button>
            </div>
            
            {showFarmForm && (
              <div className="modal-overlay" onClick={() => setShowFarmForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Create New Farm</h3>
                  <form onSubmit={handleCreateFarm}>
                    <input type="text" placeholder="Farm Name" value={newFarm.name} onChange={(e) => setNewFarm({...newFarm, name: e.target.value})} required />
                    <input type="text" placeholder="Location" value={newFarm.location} onChange={(e) => setNewFarm({...newFarm, location: e.target.value})} required />
                    <input type="number" placeholder="Size (sq m)" value={newFarm.size} onChange={(e) => setNewFarm({...newFarm, size: e.target.value})} />
                    <input type="number" placeholder="Number of Birds" value={newFarm.poultryCount} onChange={(e) => setNewFarm({...newFarm, poultryCount: e.target.value})} />
                    <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Farm'}</button>
                    <button type="button" onClick={() => setShowFarmForm(false)}>Cancel</button>
                  </form>
                </div>
              </div>
            )}
            
            <div className="farms-grid">
              {farms.map(farm => (
                <div key={farm._id} className="farm-card">
                  <h4>{farm.name}</h4>
                  <p>📍 {farm.location}</p>
                  <p>🐔 {farm.poultryCount || 0} birds</p>
                  <p>📏 {farm.size || 0} sq m</p>
                </div>
              ))}
              {farms.length === 0 && <p className="no-data">No farms yet. Click "Add Farm" to create one.</p>}
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="employees-section">
            <div className="section-header">
              <h2>Company Employees</h2>
              <button onClick={() => setShowEmployeeForm(true)} className="add-btn">+ Add Employee</button>
            </div>
            
            {showEmployeeForm && (
              <div className="modal-overlay" onClick={() => setShowEmployeeForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Add New Employee</h3>
                  <form onSubmit={handleCreateEmployee}>
                    <input type="text" placeholder="Full Name" value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} required />
                    <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} required />
                    <input type="text" placeholder="Username" value={newEmployee.username} onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})} required />
                    <input type="password" placeholder="Password" value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} required />
                    <select value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}>
                      <option value="farm_worker">Farm Worker</option>
                      <option value="farm_manager">Farm Manager</option>
                    </select>
                    <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Employee'}</button>
                    <button type="button" onClick={() => setShowEmployeeForm(false)}>Cancel</button>
                  </form>
                </div>
              </div>
            )}
            
            <div className="employees-grid">
              {employees.map(emp => (
                <div key={emp._id} className="employee-card">
                  <div className="employee-info">
                    <h4>{emp.name}</h4>
                    <p>📧 {emp.email}</p>
                    <p>👤 {emp.username}</p>
                    <p>🎭 {emp.role}</p>
                  </div>
                  <button onClick={() => handleDeleteEmployee(emp._id)} className="delete-btn">🗑️ Delete</button>
                </div>
              ))}
              {employees.length === 0 && <p className="no-data">No employees yet. Click "Add Employee" to add one.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
