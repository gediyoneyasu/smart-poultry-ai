import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarms: 0,
    totalReports: 0,
    unreadMessages: 0,
    totalHouses: 0
  });
  const [users, setUsers] = useState([]);
  const [farms, setFarms] = useState([]);
  const [reports, setReports] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5001/api';

  const getToken = () => localStorage.getItem('poultryToken');
  const getUser = () => {
    const user = localStorage.getItem('poultryUser');
    return user ? JSON.parse(user) : null;
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = getToken();
    const user = getUser();
    
    console.log('Checking auth - Token:', token ? 'Present' : 'Missing');
    console.log('Checking auth - User:', user);
    
    if (!token || !user) {
      toast.error('Please login first');
      navigate('/auth');
      return;
    }
    
    if (user.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/dashboard');
      return;
    }
    
    // If authenticated, fetch data
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = getToken();
    
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      // Fetch stats
      const statsRes = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
      
      // Fetch users
      const usersRes = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data);
      
      // Fetch farms
      const farmsRes = await axios.get(`${API_URL}/admin/farms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarms(farmsRes.data);
      
      // Fetch reports
      const reportsRes = await axios.get(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(reportsRes.data);
      
      // Fetch contacts
      const contactsRes = await axios.get(`${API_URL}/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(contactsRes.data);
      
      toast.success('Admin data loaded');
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('poultryToken');
        localStorage.removeItem('poultryUser');
        toast.error('Session expired. Please login again.');
        navigate('/auth');
      } else {
        toast.error('Failed to load admin data: ' + (error.response?.data?.message || error.message));
      }
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
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update role: ' + (error.response?.data?.message || error.message));
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
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete user: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateContactStatus = async (contactId, status) => {
    const token = getToken();
    try {
      await axios.put(`${API_URL}/admin/contacts/${contactId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Contact status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const translations = {
    en: {
      title: "Admin Dashboard",
      subtitle: "Manage users, farms, and system data",
      dashboard: "Dashboard",
      users: "Users",
      farms: "Farms",
      reports: "Reports",
      messages: "Messages",
      totalUsers: "Total Users",
      totalFarms: "Total Farms",
      totalReports: "AI Reports",
      unreadMessages: "Unread Messages",
      totalHouses: "Poultry Houses",
      name: "Name",
      email: "Email",
      role: "Role",
      farmName: "Farm Name",
      actions: "Actions",
      status: "Status",
      date: "Date",
      disease: "Disease",
      confidence: "Confidence",
      view: "View",
      delete: "Delete",
      makeAdmin: "Make Admin",
      makeVet: "Make Vet",
      makeFarmer: "Make Farmer",
      markRead: "Mark as Read",
      markReplied: "Mark as Replied",
      refresh: "Refresh Data"
    },
    am: {
      title: "የአስተዳዳሪ ዳሽቦርድ",
      subtitle: "ተጠቃሚዎችን፣ እርሻዎችን እና የስርዓት መረጃዎችን ያስተዳድሩ",
      dashboard: "ዳሽቦርድ",
      users: "ተጠቃሚዎች",
      farms: "እርሻዎች",
      reports: "ሪፖርቶች",
      messages: "መልዕክቶች",
      totalUsers: "ጠቅላላ ተጠቃሚዎች",
      totalFarms: "ጠቅላላ እርሻዎች",
      totalReports: "ኤአይ ሪፖርቶች",
      unreadMessages: "ያልተነበቡ መልዕክቶች",
      totalHouses: "የዶሮ ቤቶች",
      name: "ስም",
      email: "ኢሜይል",
      role: "ሚና",
      farmName: "የእርሻ ስም",
      actions: "ድርጊቶች",
      status: "ሁኔታ",
      date: "ቀን",
      disease: "በሽታ",
      confidence: "እምነት",
      view: "ተመልከት",
      delete: "ሰርዝ",
      makeAdmin: "አስተዳዳሪ አድርግ",
      makeVet: "የእንስሳት ሐኪም አድርግ",
      makeFarmer: "አርሶ አደር አድርግ",
      markRead: "እንደተነበበ ምልክት አድርግ",
      markReplied: "መልስ እንደተሰጠው ምልክት አድርግ",
      refresh: "መረጃ አድስ"
    }
  };

  const t = translations[language];

  const getStatusColor = (status) => {
    switch(status) {
      case 'unread': return '#ef4444';
      case 'read': return '#f59e0b';
      case 'replied': return '#10b981';
      default: return '#6b7280';
    }
  };

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
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <i className="fas fa-sync-alt"></i> {t.refresh}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-info"><h3>{t.totalUsers}</h3><p className="stat-value">{stats.totalUsers}</p></div></div>
          <div className="stat-card"><div className="stat-icon">🏠</div><div className="stat-info"><h3>{t.totalFarms}</h3><p className="stat-value">{stats.totalFarms}</p></div></div>
          <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-info"><h3>{t.totalReports}</h3><p className="stat-value">{stats.totalReports}</p></div></div>
          <div className="stat-card"><div className="stat-icon">✉️</div><div className="stat-info"><h3>{t.unreadMessages}</h3><p className="stat-value">{stats.unreadMessages}</p></div></div>
          <div className="stat-card"><div className="stat-icon">🏚️</div><div className="stat-info"><h3>{t.totalHouses}</h3><p className="stat-value">{stats.totalHouses}</p></div></div>
        </div>

        {/* Admin Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fas fa-chart-line"></i> {t.dashboard}</button>
          <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}><i className="fas fa-users"></i> {t.users}</button>
          <button className={`admin-tab ${activeTab === 'farms' ? 'active' : ''}`} onClick={() => setActiveTab('farms')}><i className="fas fa-tractor"></i> {t.farms}</button>
          <button className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}><i className="fas fa-file-alt"></i> {t.reports}</button>
          <button className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}><i className="fas fa-envelope"></i> {t.messages}</button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard-content">
            <h2>Welcome to Admin Dashboard</h2>
            <p>System is running with {stats.totalUsers} users, {stats.totalFarms} farms, and {stats.totalReports} AI reports.</p>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>{t.name}</th><th>{t.email}</th><th>{t.role}</th><th>{t.farmName}</th><th>{t.actions}</th></tr></thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                    <td>{user.farmName || '-'}</td>
                    <td className="actions-cell">
                      <select onChange={(e) => updateUserRole(user._id, e.target.value)} value={user.role}>
                        <option value="farmer">{t.makeFarmer}</option>
                        <option value="vet">{t.makeVet}</option>
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

        {/* Farms Tab */}
        {activeTab === 'farms' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>{t.farmName}</th><th>{t.name}</th><th>{t.email}</th><th>Location</th><th>Birds</th></tr></thead>
              <tbody>
                {farms.map(farm => (
                  <tr key={farm._id}>
                    <td>{farm.farmName}</td>
                    <td>{farm.farmerId?.name || '-'}</td>
                    <td>{farm.farmerId?.email || '-'}</td>
                    <td>{farm.location?.region || '-'}</td>
                    <td>{farm.totalBirds || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>{t.date}</th><th>Farm</th><th>{t.disease}</th><th>{t.confidence}</th><th>{t.status}</th></tr></thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report._id}>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>{report.farmId?.farmName || '-'}</td>
                    <td>{report.imageAnalysis?.disease || '-'}</td>
                    <td>{report.imageAnalysis?.confidence || 0}%</td>
                    <td><span className={`status-badge ${report.status}`}>{report.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>{t.date}</th><th>{t.name}</th><th>{t.email}</th><th>Subject</th><th>{t.status}</th><th>{t.actions}</th></tr></thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact._id}>
                    <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td><span className={`status-badge ${contact.status}`} style={{backgroundColor: getStatusColor(contact.status)}}>{contact.status}</span></td>
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
