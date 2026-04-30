import API_URL from "../config/api";
import API_URL from '../config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './UnifiedFarm.css';

const UnifiedFarm = () => {
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [currentFarm, setCurrentFarm] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('poultryToken');
  const getUser = () => {
    const userData = localStorage.getItem('poultryUser');
    return userData ? JSON.parse(userData) : null;
  };

  // Form states
  const [farmForm, setFarmForm] = useState({
    name: '',
    location: '',
    totalBirds: 0,
    birdType: 'Layers',
    establishedDate: '',
    phone: '',
    email: ''
  });
  
  const [recordForm, setRecordForm] = useState({
    date: new Date().toISOString().split('T')[0],
    totalBirds: '',
    healthyBirds: '',
    sickBirds: '',
    deadBirds: '',
    eggsCollected: '',
    eggsSold: '',
    eggPrice: 5,
    feedConsumed: '',
    feedCost: '',
    medicineCost: '',
    otherExpenses: '',
    temperature: '',
    humidity: '',
    notes: ''
  });

  // Check authentication
  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    
    if (!token || !userData) {
      toast.error('Please login first');
      navigate('/auth');
      return;
    }
    
    setUser(userData);
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    const token = getToken();
    
    try {
      // Load farms
      const farmsRes = await axios.get(`${API_URL}/farm/my-farms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Farms loaded:', farmsRes.data);
      setFarms(farmsRes.data);
      
      if (farmsRes.data.length > 0) {
        setCurrentFarm(farmsRes.data[0]);
        await loadRecords(farmsRes.data[0]._id);
      }
    } catch (error) {
      console.error('Error loading farms:', error);
      toast.error('Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async (farmId) => {
    const token = getToken();
    try {
      const recordsRes = await axios.get(`${API_URL}/farm/records/${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Records loaded:', recordsRes.data.length);
      setDailyRecords(recordsRes.data);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const loadAISuggestions = async () => {
    if (!currentFarm) return;
    
    const token = getToken();
    try {
      const suggestionsRes = await axios.get(`${API_URL}/farm/suggestions/${currentFarm._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiSuggestions(suggestionsRes.data);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleSaveFarm = async (e) => {
    e.preventDefault();
    const token = getToken();
    setSaving(true);
    
    try {
      if (editingFarm) {
        const res = await axios.put(`${API_URL}/farm/farms/${editingFarm._id}`, farmForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFarms(farms.map(f => f._id === editingFarm._id ? res.data : f));
        toast.success('Farm updated successfully!');
      } else {
        const res = await axios.post(`${API_URL}/farm/farms`, farmForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFarms([...farms, res.data]);
        toast.success('Farm created successfully!');
      }
      setShowFarmForm(false);
      setEditingFarm(null);
      setFarmForm({ name: '', location: '', totalBirds: 0, birdType: 'Layers', establishedDate: '', phone: '', email: '' });
      await loadUserData();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save farm');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    if (!currentFarm) {
      toast.error('Please select a farm first');
      return;
    }
    
    const token = getToken();
    setSaving(true);
    
    const dataToSave = {
      farmId: currentFarm._id,
      date: recordForm.date,
      totalBirds: parseInt(recordForm.totalBirds) || 0,
      healthyBirds: parseInt(recordForm.healthyBirds) || 0,
      sickBirds: parseInt(recordForm.sickBirds) || 0,
      deadBirds: parseInt(recordForm.deadBirds) || 0,
      eggsCollected: parseInt(recordForm.eggsCollected) || 0,
      eggsSold: parseInt(recordForm.eggsSold) || 0,
      eggPrice: parseFloat(recordForm.eggPrice) || 5,
      feedConsumed: parseInt(recordForm.feedConsumed) || 0,
      feedCost: parseInt(recordForm.feedCost) || 0,
      medicineCost: parseInt(recordForm.medicineCost) || 0,
      otherExpenses: parseInt(recordForm.otherExpenses) || 0,
      temperature: parseFloat(recordForm.temperature) || 0,
      humidity: parseInt(recordForm.humidity) || 0,
      notes: recordForm.notes || ''
    };
    
    try {
      const res = await axios.post(`${API_URL}/farm/records`, dataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Record saved:', res.data);
      setDailyRecords([res.data, ...dailyRecords]);
      setShowRecordForm(false);
      
      // Reset form
      setRecordForm({
        date: new Date().toISOString().split('T')[0],
        totalBirds: '',
        healthyBirds: '',
        sickBirds: '',
        deadBirds: '',
        eggsCollected: '',
        eggsSold: '',
        eggPrice: 5,
        feedConsumed: '',
        feedCost: '',
        medicineCost: '',
        otherExpenses: '',
        temperature: '',
        humidity: '',
        notes: ''
      });
      
      toast.success('Daily record saved successfully!');
      await loadAISuggestions();
    } catch (error) {
      console.error('Save record error:', error);
      toast.error(error.response?.data?.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectFarm = async (farm) => {
    setCurrentFarm(farm);
    await loadRecords(farm._id);
    setAiSuggestions(null);
  };

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Delete this farm? All records will be lost.')) return;
    
    const token = getToken();
    try {
      await axios.delete(`${API_URL}/farm/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedFarms = farms.filter(f => f._id !== farmId);
      setFarms(updatedFarms);
      if (currentFarm?._id === farmId && updatedFarms.length > 0) {
        handleSelectFarm(updatedFarms[0]);
      } else if (updatedFarms.length === 0) {
        setCurrentFarm(null);
        setDailyRecords([]);
      }
      toast.success('Farm deleted');
    } catch (error) {
      toast.error('Failed to delete farm');
    }
  };

  const translations = {
    en: {
      title: "🐔 Smart Farm Management",
      subtitle: "Track daily records, get AI insights, maximize profits",
      overview: "Overview",
      records: "Daily Records",
      insights: "AI Insights",
      myFarms: "My Farms",
      addFarm: "+ New Farm",
      addRecord: "+ Add Daily Record",
      farmName: "Farm Name",
      location: "Location",
      totalBirds: "Total Birds",
      birdType: "Bird Type",
      layers: "Layers (Eggs)",
      broilers: "Broilers (Meat)",
      selectFarm: "Select",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      profit: "Profit/Loss",
      income: "Income",
      expenses: "Expenses",
      date: "Date",
      healthy: "Healthy",
      sick: "Sick",
      dead: "Dead",
      eggs: "Eggs",
      saving: "Saving...",
      noFarms: "No farms yet. Click 'New Farm' to get started!",
      noRecords: "No daily records yet. Click 'Add Daily Record' to start tracking!",
      farmDetails: "Farm Details",
      recentRecords: "Recent Records",
      aiSuggestions: "AI Suggestions"
    },
    am: {
      title: "🐔 ስማርት የእርሻ አስተዳደር",
      subtitle: "ዕለታዊ መዝገቦችን ይከታተሉ፣ የኤአይ ግንዛቤዎችን ያግኙ፣ ትርፍዎን ያሳድጉ",
      overview: "አጠቃላይ እይታ",
      records: "ዕለታዊ መዝገቦች",
      insights: "ኤአይ ግንዛቤዎች",
      myFarms: "እርሻዎቼ",
      addFarm: "+ አዲስ እርሻ",
      addRecord: "+ ዕለታዊ መዝገብ",
      farmName: "የእርሻ ስም",
      location: "አካባቢ",
      totalBirds: "ጠቅላላ ዶሮዎች",
      birdType: "የዶሮ አይነት",
      layers: "እንቁላል",
      broilers: "ስጋ",
      selectFarm: "ምረጥ",
      edit: "አርትዕ",
      delete: "ሰርዝ",
      save: "አስቀምጥ",
      cancel: "ሰርዝ",
      profit: "ትርፍ/ኪሳራ",
      income: "ገቢ",
      expenses: "ወጪ",
      date: "ቀን",
      healthy: "ጤናማ",
      sick: "የታመሙ",
      dead: "ሞት",
      eggs: "እንቁላሎች",
      saving: "በማስቀመጥ ላይ...",
      noFarms: "እስካሁን እርሻ የለም። 'አዲስ እርሻ' ን ጠቅ ያድርጉ!",
      noRecords: "እስካሁን ዕለታዊ መዝገቦች የሉም። 'ዕለታዊ መዝገብ ጨምር' ን ጠቅ ያድርጉ!",
      farmDetails: "የእርሻ ዝርዝሮች",
      recentRecords: "የቅርብ ጊዜ መዝገቦች",
      aiSuggestions: "ኤአይ ምክሮች"
    }
  };

  const t = translations[language];
  
  // Calculate totals
  const totalIncome = dailyRecords.reduce((sum, r) => sum + (r.eggsSold || 0) * (r.eggPrice || 5), 0);
  const totalExpenses = dailyRecords.reduce((sum, r) => sum + (r.feedCost || 0) + (r.medicineCost || 0) + (r.otherExpenses || 0), 0);
  const profit = totalIncome - totalExpenses;
  const avgEggs = dailyRecords.length > 0 ? (dailyRecords.reduce((sum, r) => sum + (r.eggsCollected || 0), 0) / dailyRecords.length).toFixed(0) : 0;

  if (loading) {
    return (
      <div className="loading-farm">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading your farm data...</p>
      </div>
    );
  }

  return (
    <div className="unified-farm-page">
      <div className="farm-container-unified">
        {/* Header */}
        <div className="farm-header-unified">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          {user && <div className="welcome-banner">👋 Welcome, {user.name}!</div>}
        </div>

        {/* Farm Selector */}
        <div className="farm-selector-unified">
          <div className="selector-header">
            <span><i className="fas fa-tractor"></i> {t.myFarms} ({farms.length})</span>
            <button className="add-farm-btn-small" onClick={() => { setShowFarmForm(true); setEditingFarm(null); setFarmForm({ name: '', location: '', totalBirds: 0, birdType: 'Layers', establishedDate: '', phone: '', email: '' }); }}>
              <i className="fas fa-plus"></i> {t.addFarm}
            </button>
          </div>
          <div className="selector-farms">
            {farms.length === 0 ? (
              <div className="no-farms">{t.noFarms}</div>
            ) : (
              farms.map(farm => (
                <div key={farm._id} className={`farm-card-mini ${currentFarm?._id === farm._id ? 'active' : ''}`}>
                  <div className="farm-info-mini">
                    <strong>{farm.name}</strong>
                    <span>{farm.totalBirds} 🐔</span>
                  </div>
                  <div className="farm-actions-mini">
                    <button onClick={() => handleSelectFarm(farm)} title={t.selectFarm}><i className="fas fa-check"></i></button>
                    <button onClick={() => { setEditingFarm(farm); setFarmForm(farm); setShowFarmForm(true); }}><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDeleteFarm(farm._id)}><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {currentFarm && (
          <div className="quick-stats">
            <div className="stat"><span className="stat-icon">🐔</span><div className="stat-info"><label>{t.totalBirds}</label><strong>{currentFarm.totalBirds}</strong></div></div>
            <div className="stat"><span className="stat-icon">🥚</span><div className="stat-info"><label>Eggs/Day</label><strong>{avgEggs}</strong></div></div>
            <div className="stat"><span className="stat-icon">💰</span><div className="stat-info"><label>{t.profit}</label><strong className={profit >= 0 ? 'profit' : 'loss'}>ETB {profit}</strong></div></div>
            <button className="add-record-quick" onClick={() => setShowRecordForm(true)}><i className="fas fa-plus"></i> {t.addRecord}</button>
          </div>
        )}

        {/* Tabs */}
        {currentFarm && (
          <div className="farm-tabs-unified">
            <button className={`tab ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}><i className="fas fa-chart-pie"></i> {t.overview}</button>
            <button className={`tab ${activeView === 'records' ? 'active' : ''}`} onClick={() => setActiveView('records')}><i className="fas fa-calendar"></i> {t.records}</button>
            <button className={`tab ${activeView === 'insights' ? 'active' : ''}`} onClick={() => { setActiveView('insights'); loadAISuggestions(); }}><i className="fas fa-brain"></i> {t.insights}</button>
          </div>
        )}

        {/* Overview Tab */}
        {activeView === 'overview' && currentFarm && (
          <div className="overview-tab">
            <div className="farm-details-card">
              <h3><i className="fas fa-info-circle"></i> {t.farmDetails}</h3>
              <div className="details-grid">
                <div><label>📍 {t.location}:</label> <span>{currentFarm.location || 'Not set'}</span></div>
                <div><label>🐔 Type:</label> <span>{currentFarm.birdType}</span></div>
                <div><label>📅 Established:</label> <span>{currentFarm.establishedDate ? new Date(currentFarm.establishedDate).toLocaleDateString() : 'Not set'}</span></div>
                <div><label>📞 Phone:</label> <span>{currentFarm.phone || 'Not set'}</span></div>
                <div><label>✉️ Email:</label> <span>{currentFarm.email || 'Not set'}</span></div>
              </div>
            </div>

            <div className="recent-records">
              <h3><i className="fas fa-history"></i> {t.recentRecords}</h3>
              {dailyRecords.length === 0 ? (
                <div className="no-records">{t.noRecords}</div>
              ) : (
                <div className="records-preview">
                  {dailyRecords.slice(0, 5).map(record => (
                    <div key={record._id} className="preview-record">
                      <span className="date">{new Date(record.date).toLocaleDateString()}</span>
                      <span className="eggs">🥚 {record.eggsCollected || 0}</span>
                      <span className="health">❤️ {record.healthyBirds || 0}</span>
                      <span className={record.deadBirds > 0 ? 'danger' : ''}>💀 {record.deadBirds || 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeView === 'records' && currentFarm && (
          <div className="records-tab">
            {dailyRecords.length === 0 ? (
              <div className="empty-records">
                <i className="fas fa-calendar-alt"></i>
                <p>{t.noRecords}</p>
                <button className="add-record-btn" onClick={() => setShowRecordForm(true)}><i className="fas fa-plus"></i> {t.addRecord}</button>
              </div>
            ) : (
              <div className="records-table-container">
                <table className="records-table">
                  <thead><tr><th>{t.date}</th><th>🥚 {t.eggs}</th><th>❤️ {t.healthy}</th><th>🤒 {t.sick}</th><th>💀 {t.dead}</th><th>💰 {t.profit}</th></tr></thead>
                  <tbody>
                    {dailyRecords.map(record => {
                      const recordProfit = (record.eggsSold || 0) * (record.eggPrice || 5) - ((record.feedCost || 0) + (record.medicineCost || 0) + (record.otherExpenses || 0));
                      return (
                        <tr key={record._id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.eggsCollected || 0}</td>
                          <td>{record.healthyBirds || 0}</td>
                          <td className="warning">{record.sickBirds || 0}</td>
                          <td className="danger">{record.deadBirds || 0}</td>
                          <td className={recordProfit >= 0 ? 'profit' : 'loss'}>ETB {recordProfit}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* AI Insights Tab */}
        {activeView === 'insights' && currentFarm && (
          <div className="insights-tab">
            {aiSuggestions ? (
              <div className="ai-summary-card">
                <div className="ai-summary"><i className="fas fa-robot"></i><p>{aiSuggestions.summary}</p></div>
                {aiSuggestions.suggestions.map((s, idx) => (
                  <div key={idx} className={`suggestion-card ${s.type}`}>
                    <div className="suggestion-header"><span className="suggestion-icon">{s.icon}</span><div className="suggestion-title"><h4>{s.title}</h4><span className={`priority-badge ${s.priority}`}>{s.priority.toUpperCase()}</span></div></div>
                    <p className="suggestion-message">{s.message}</p>
                    <div className="suggestion-actions"><strong>📋 Action Items:</strong><ul>{s.actions.slice(0, 4).map((a, i) => <li key={i}>✓ {a}</li>)}</ul></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-ai"><i className="fas fa-brain"></i><p>Click to generate AI insights from your farm data!</p><button className="generate-ai-btn" onClick={loadAISuggestions}>Generate AI Insights</button></div>
            )}
          </div>
        )}

        {/* Farm Form Modal */}
        {showFarmForm && (
          <div className="modal-overlay" onClick={() => setShowFarmForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingFarm ? 'Edit Farm' : t.addFarm}</h2>
              <form onSubmit={handleSaveFarm}>
                <input type="text" placeholder={t.farmName} value={farmForm.name} onChange={(e) => setFarmForm({...farmForm, name: e.target.value})} required />
                <input type="text" placeholder={t.location} value={farmForm.location} onChange={(e) => setFarmForm({...farmForm, location: e.target.value})} />
                <input type="number" placeholder={t.totalBirds} value={farmForm.totalBirds} onChange={(e) => setFarmForm({...farmForm, totalBirds: parseInt(e.target.value)})} required />
                <select value={farmForm.birdType} onChange={(e) => setFarmForm({...farmForm, birdType: e.target.value})}><option value="Layers">{t.layers}</option><option value="Broilers">{t.broilers}</option></select>
                <input type="date" value={farmForm.establishedDate} onChange={(e) => setFarmForm({...farmForm, establishedDate: e.target.value})} />
                <input type="tel" placeholder="Phone" value={farmForm.phone} onChange={(e) => setFarmForm({...farmForm, phone: e.target.value})} />
                <input type="email" placeholder="Email" value={farmForm.email} onChange={(e) => setFarmForm({...farmForm, email: e.target.value})} />
                <div className="modal-buttons"><button type="submit" className="save-btn" disabled={saving}>{saving ? t.saving : t.save}</button><button type="button" className="cancel-btn" onClick={() => setShowFarmForm(false)}>{t.cancel}</button></div>
              </form>
            </div>
          </div>
        )}

        {/* Daily Record Form Modal */}
        {showRecordForm && currentFarm && (
          <div className="modal-overlay" onClick={() => setShowRecordForm(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <h2>📝 Add Daily Record - {currentFarm.name}</h2>
              <form onSubmit={handleSaveRecord}>
                <div className="form-grid">
                  <div className="form-field"><label>📅 Date</label><input type="date" value={recordForm.date} onChange={(e) => setRecordForm({...recordForm, date: e.target.value})} required /></div>
                  <div className="form-field"><label>🐔 Total Birds</label><input type="number" placeholder="e.g., 500" value={recordForm.totalBirds} onChange={(e) => setRecordForm({...recordForm, totalBirds: e.target.value})} /></div>
                  <div className="form-field"><label>❤️ Healthy Birds</label><input type="number" placeholder="Number of healthy birds" value={recordForm.healthyBirds} onChange={(e) => setRecordForm({...recordForm, healthyBirds: e.target.value})} /></div>
                  <div className="form-field"><label>🤒 Sick Birds</label><input type="number" placeholder="Number of sick birds" value={recordForm.sickBirds} onChange={(e) => setRecordForm({...recordForm, sickBirds: e.target.value})} /></div>
                  <div className="form-field"><label>💀 Dead Birds</label><input type="number" placeholder="Number of dead birds" value={recordForm.deadBirds} onChange={(e) => setRecordForm({...recordForm, deadBirds: e.target.value})} /></div>
                  <div className="form-field"><label>🥚 Eggs Collected</label><input type="number" placeholder="Total eggs today" value={recordForm.eggsCollected} onChange={(e) => setRecordForm({...recordForm, eggsCollected: e.target.value})} /></div>
                  <div className="form-field"><label>💰 Eggs Sold</label><input type="number" placeholder="Eggs sold today" value={recordForm.eggsSold} onChange={(e) => setRecordForm({...recordForm, eggsSold: e.target.value})} /></div>
                  <div className="form-field"><label>💵 Egg Price (ETB)</label><input type="number" step="0.5" placeholder="e.g., 5.00" value={recordForm.eggPrice} onChange={(e) => setRecordForm({...recordForm, eggPrice: e.target.value})} /></div>
                  <div className="form-field"><label>🌾 Feed Consumed (kg)</label><input type="number" placeholder="Feed eaten (kg)" value={recordForm.feedConsumed} onChange={(e) => setRecordForm({...recordForm, feedConsumed: e.target.value})} /></div>
                  <div className="form-field"><label>💰 Feed Cost (ETB)</label><input type="number" placeholder="Cost of feed" value={recordForm.feedCost} onChange={(e) => setRecordForm({...recordForm, feedCost: e.target.value})} /></div>
                  <div className="form-field"><label>💊 Medicine Cost</label><input type="number" placeholder="Medicine expenses" value={recordForm.medicineCost} onChange={(e) => setRecordForm({...recordForm, medicineCost: e.target.value})} /></div>
                  <div className="form-field"><label>📋 Other Expenses</label><input type="number" placeholder="Electricity, water, etc." value={recordForm.otherExpenses} onChange={(e) => setRecordForm({...recordForm, otherExpenses: e.target.value})} /></div>
                  <div className="form-field"><label>🌡️ Temperature (°C)</label><input type="number" step="0.1" placeholder="e.g., 32.5" value={recordForm.temperature} onChange={(e) => setRecordForm({...recordForm, temperature: e.target.value})} /></div>
                  <div className="form-field"><label>💧 Humidity (%)</label><input type="number" placeholder="e.g., 65" value={recordForm.humidity} onChange={(e) => setRecordForm({...recordForm, humidity: e.target.value})} /></div>
                </div>
                <div className="form-field full-width"><label>📝 Notes</label><textarea rows="2" placeholder="Any observations..." value={recordForm.notes} onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})} /></div>
                <div className="modal-buttons"><button type="submit" className="save-btn" disabled={saving}>{saving ? t.saving : t.save}</button><button type="button" className="cancel-btn" onClick={() => setShowRecordForm(false)}>{t.cancel}</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedFarm;
