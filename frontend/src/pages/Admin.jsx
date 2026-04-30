import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import API_URL from '../config/api';
import './Admin.css';

const Admin = () => {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarms: 0,
    totalRecords: 0,
    totalCompanies: 0,
    totalFarmers: 0,
    totalEmployees: 0
  });
  const [users, setUsers] = useState([]);
  const [allFarms, setAllFarms] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('poultryToken');
  const getUser = () => {
    const user = localStorage.getItem('poultryUser');
    return user ? JSON.parse(user) : null;
  };

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    
    if (!token || !user || user.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/auth');
      return;
    }
    
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const token = getToken();
    
    try {
      const [statsRes, usersRes, farmsRes, recordsRes, contactsRes, companiesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/all-farms`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/all-records`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/companies`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAllFarms(farmsRes.data);
      setAllRecords(recordsRes.data);
      setContacts(contactsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    const token = getToken();
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/role`, { role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User role updated');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const token = getToken();
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const updateContactStatus = async (contactId, status) => {
    const token = getToken();
    try {
      await axios.put(`${API_URL}/admin/contacts/${contactId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Contact status updated');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const translations = {
    en: {
      title: "Admin Dashboard",
      subtitle: "Manage users, farms, records, and system data",
      dashboard: "Dashboard",
      users: "Users",
      farms: "All Farms",
      records: "Daily Records",
      companies: "Companies",
      messages: "Messages",
      totalUsers: "Total Users",
      totalFarms: "Total Farms",
      totalRecords: "Total Records",
      totalCompanies: "Companies",
      farmers: "Farmers",
      employees: "Employees",
      name: "Name",
      email: "Email",
      role: "Role",
      farmName: "Farm Name",
      owner: "Owner",
      actions: "Actions",
      status: "Status",
      date: "Date",
      eggs: "Eggs",
      profit: "Profit",
      view: "View",
      delete: "Delete",
      makeAdmin: "Make Admin",
      makeFarmer: "Make Farmer",
      makeCompanyAdmin: "Make Company Admin",
      makeManager: "Make Manager",
      markRead: "Mark as Read"
    },
    am: {
      title: "የአስተዳዳሪ ዳሽቦርድ",
      subtitle: "ተጠቃሚዎችን፣ እርሻዎችን፣ መዝገቦችን እና የስርዓት መረጃዎችን ያስተዳድሩ",
      dashboard: "ዳሽቦርድ",
      users: "ተጠቃሚዎች",
      farms: "ሁሉም እርሻዎች",
      records: "ዕለታዊ መዝገቦች",
      companies: "ኩባንያዎች",
      messages: "መልዕክቶች",
      totalUsers: "ጠቅላላ ተጠቃሚዎች",
      totalFarms: "ጠቅላላ እርሻዎች",
      totalRecords: "ጠቅላላ መዝገቦች",
      totalCompanies: "ኩባንያዎች",
      farmers: "አርሶ አደሮች",
      employees: "ሰራተኞች",
      name: "ስም",
      email: "ኢሜይል",
      role: "ሚና",
      farmName: "የእርሻ ስም",
      owner: "ባለቤት",
      actions: "ድርጊቶች",
      status: "ሁኔታ",
      date: "ቀን",
      eggs: "እንቁላሎች",
      profit: "ትርፍ",
      view: "ተመልከት",
      delete: "ሰርዝ",
      makeAdmin: "አስተዳዳሪ አድርግ",
      makeFarmer: "አርሶ አደር አድርግ",
      makeCompanyAdmin: "የኩባንያ አስተዳዳሪ አድርግ",
      makeManager: "አስተዳዳሪ አድርግ",
      markRead: "እንደተነበበ ምልክት አድርግ"
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="admin-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <button className="refresh-btn" onClick={fetchAllData}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-info"><h3>{t.totalUsers}</h3><p className="stat-value">{stats.totalUsers}</p></div></div>
          <div className="stat-card"><div className="stat-icon">🏠</div><div className="stat-info"><h3>{t.totalFarms}</h3><p className="stat-value">{stats.totalFarms}</p></div></div>
          <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-info"><h3>{t.totalRecords}</h3><p className="stat-value">{stats.totalRecords}</p></div></div>
          <div className="stat-card"><div className="stat-icon">🏢</div><div className="stat-info"><h3>{t.totalCompanies}</h3><p className="stat-value">{stats.totalCompanies}</p></div></div>
          <div className="stat-card"><div className="stat-icon">👨‍🌾</div><div className="stat-info"><h3>{t.farmers}</h3><p className="stat-value">{stats.totalFarmers || 0}</p></div></div>
          <div className="stat-card"><div className="stat-icon">👔</div><div className="stat-info"><h3>{t.employees}</h3><p className="stat-value">{stats.totalEmployees || 0}</p></div></div>
        </div>

        {/* Admin Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fas fa-chart-line"></i> {t.dashboard}</button>
          <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}><i className="fas fa-users"></i> {t.users}</button>
          <button className={`admin-tab ${activeTab === 'farms' ? 'active' : ''}`} onClick={() => setActiveTab('farms')}><i className="fas fa-tractor"></i> {t.farms}</button>
          <button className={`admin-tab ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')}><i className="fas fa-file-alt"></i> {t.records}</button>
          <button className={`admin-tab ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}><i className="fas fa-building"></i> {t.companies}</button>
          <button className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}><i className="fas fa-envelope"></i> {t.messages}</button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard-content">
            <h2>Welcome to Admin Dashboard</h2>
            <p>System is running with {stats.totalUsers} users, {stats.totalFarms} farms, and {stats.totalRecords} daily records across {stats.totalCompanies} companies.</p>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>{t.name}</th><th>{t.email}</th><th>{t.role}</th><th>{t.actions}</th></tr></thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                    <td className="actions-cell">
                      <select onChange={(e) => updateUserRole(user._id, e.target.value)} value={user.role}>
                        <option value="farmer">{t.makeFarmer}</option>
                        <option value="company_admin">{t.makeCompanyAdmin}</option>
                        <option value="farm_manager">{t.makeManager}</option>
                        <option value="admin">{t.makeAdmin}</option>
                      </select>
                      <button className="delete-btn" onClick={() => deleteUser(user._id)}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Farms Tab - All Farms from ALL Users */}
        {activeTab === 'farms' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>{t.farmName}</th><th>{t.owner}</th><th>{t.email}</th><th>Location</th><th>Birds</th><th>Type</th></tr></thead>
              <tbody>
                {allFarms.map(farm => (
                  <tr key={farm._id}>
                    <td>{farm.name}</td>
                    <td>{farm.ownerName || '-'}</td>
                    <td>{farm.ownerEmail || '-'}</td>
                    <td>{farm.location || '-'}</td>
                    <td>{farm.totalBirds || 0}</td>
                    <td>{farm.birdType}</td>
                  </tr>
                ))}
                {allFarms.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center'}}>No farms found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Records Tab - All Daily Records from ALL Users */}
        {activeTab === 'records' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>{t.date}</th><th>Farm</th><th>User</th><th>🥚 Eggs</th><th>❤️ Healthy</th><th>🤒 Sick</th><th>💀 Dead</th><th>💰 {t.profit}</th></tr></thead>
              <tbody>
                {allRecords.slice(0, 100).map(record => {
                  const profit = (record.eggsSold || 0) * (record.eggPrice || 5) - ((record.feedCost || 0) + (record.medicineCost || 0) + (record.otherExpenses || 0));
                  return (
                    <tr key={record._id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.farmName || '-'}</td>
                      <td>{record.userName || '-'}</td>
                      <td>{record.eggsCollected || 0}</td>
                      <td>{record.healthyBirds || 0}</td>
                      <td className="warning">{record.sickBirds || 0}</td>
                      <td className="danger">{record.deadBirds || 0}</td>
                      <td className={profit >= 0 ? 'profit' : 'loss'}>ETB {profit}</td>
                    </tr>
                  );
                })}
                {allRecords.length === 0 && <tr><td colSpan="8" style={{textAlign: 'center'}}>No records found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>Company Name</th><th>Owner</th><th>Farms</th><th>Managers</th><th>Status</th></tr></thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company._id}>
                    <td>{company.name}</td>
                    <td>{company.ownerId?.name || '-'}</td>
                    <td>{company.farms?.length || 0}</td>
                    <td>{company.managerIds?.length || 0}</td>
                    <td><span className="status-badge active">Active</span></td>
                  </tr>
                ))}
                {companies.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>No companies found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact._id}>
                    <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td><span className={`status-badge ${contact.status}`}>{contact.status}</span></td>
                    <td>
                      <select onChange={(e) => updateContactStatus(contact._id, e.target.value)} value={contact.status}>
                        <option value="unread">Unread</option>
                        <option value="read">Mark Read</option>
                        <option value="replied">Mark Replied</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
