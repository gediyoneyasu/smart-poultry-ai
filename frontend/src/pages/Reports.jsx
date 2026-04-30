import API_URL from '../config/api';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Reports.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const [language, setLanguage] = useState('en');
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('production');
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();

  import API_URL from '../config/api';


  const getToken = () => localStorage.getItem('poultryToken');

  useEffect(() => {
    const token = getToken();
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    
    if (!token) {
      toast.error('Please login to view reports');
      navigate('/auth');
      return;
    }
    
    loadAllData();
  }, [navigate]);

  useEffect(() => {
    if (dailyRecords.length > 0) {
      filterRecordsByDate();
    }
  }, [dateRange, startDate, endDate, dailyRecords]);

  const loadAllData = async () => {
    setLoading(true);
    const token = getToken();
    
    try {
      const farmsRes = await axios.get(`${API_URL}/farm/my-farms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarms(farmsRes.data || []);
      
      if (farmsRes.data && farmsRes.data.length > 0) {
        setSelectedFarm(farmsRes.data[0]);
        await loadRecordsAndSuggestions(farmsRes.data[0]._id);
      }
    } catch (error) {
      console.error('Error loading farms:', error);
      toast.error('Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const loadRecordsAndSuggestions = async (farmId) => {
    const token = getToken();
    setRefreshing(true);
    
    try {
      const recordsRes = await axios.get(`${API_URL}/farm/records/${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDailyRecords(recordsRes.data || []);
      setFilteredRecords(recordsRes.data || []);
      
      const suggestionsRes = await axios.get(`${API_URL}/farm/suggestions/${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiAnalysis(suggestionsRes.data);
    } catch (error) {
      console.error('Error loading records:', error);
      toast.error('Failed to load records');
    } finally {
      setRefreshing(false);
    }
  };

  const handleFarmChange = async (farmId) => {
    const farm = farms.find(f => f._id === farmId);
    setSelectedFarm(farm);
    await loadRecordsAndSuggestions(farmId);
  };

  const filterRecordsByDate = useCallback(() => {
    let filtered = [...dailyRecords];
    
    if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(r => new Date(r.date) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(r => new Date(r.date) >= monthAgo);
    } else if (dateRange === 'quarter') {
      const quarterAgo = new Date();
      quarterAgo.setMonth(quarterAgo.getMonth() - 3);
      filtered = filtered.filter(r => new Date(r.date) >= quarterAgo);
    } else if (dateRange === 'custom' && startDate && endDate) {
      filtered = filtered.filter(r => 
        new Date(r.date) >= new Date(startDate) && 
        new Date(r.date) <= new Date(endDate)
      );
    }
    
    setFilteredRecords(filtered.sort((a, b) => new Date(a.date) - new Date(b.date)));
  }, [dateRange, startDate, endDate, dailyRecords]);

  const refreshData = () => {
    if (selectedFarm) {
      loadRecordsAndSuggestions(selectedFarm._id);
    }
  };

  const prepareProductionData = () => {
    const labels = filteredRecords.map(r => new Date(r.date).toLocaleDateString());
    const eggsData = filteredRecords.map(r => r.eggsCollected || 0);
    const healthyData = filteredRecords.map(r => r.healthyBirds || 0);
    const sickData = filteredRecords.map(r => r.sickBirds || 0);
    
    return {
      labels,
      datasets: [
        {
          label: '🥚 Eggs Collected',
          data: eggsData,
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: '❤️ Healthy Birds',
          data: healthyData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: '🤒 Sick Birds',
          data: sickData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const prepareFinancialData = () => {
    const labels = filteredRecords.map(r => new Date(r.date).toLocaleDateString());
    const incomeData = filteredRecords.map(r => (r.eggsSold || 0) * (r.eggPrice || 5));
    const expensesData = filteredRecords.map(r => (r.feedCost || 0) + (r.medicineCost || 0) + (r.otherExpenses || 0));
    const profitData = incomeData.map((inc, i) => inc - expensesData[i]);
    
    return {
      labels,
      datasets: [
        {
          label: '💰 Income',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: '#10b981',
          borderWidth: 1
        },
        {
          label: '📉 Expenses',
          data: expensesData,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: '#ef4444',
          borderWidth: 1
        },
        {
          label: '💵 Profit',
          data: profitData,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: '#3b82f6',
          borderWidth: 1
        }
      ]
    };
  };

  const prepareHealthData = () => {
    const totalHealthy = filteredRecords.reduce((sum, r) => sum + (r.healthyBirds || 0), 0);
    const totalSick = filteredRecords.reduce((sum, r) => sum + (r.sickBirds || 0), 0);
    const totalDead = filteredRecords.reduce((sum, r) => sum + (r.deadBirds || 0), 0);
    
    return {
      labels: ['Healthy', 'Sick', 'Dead'],
      datasets: [{
        data: [totalHealthy, totalSick, totalDead],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    };
  };

  const prepareEnvironmentData = () => {
    const labels = filteredRecords.map(r => new Date(r.date).toLocaleDateString());
    const tempData = filteredRecords.map(r => r.temperature || 0);
    const humidityData = filteredRecords.map(r => r.humidity || 0);
    
    return {
      labels,
      datasets: [
        {
          label: '🌡️ Temperature (°C)',
          data: tempData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: '💧 Humidity (%)',
          data: humidityData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const totalIncome = filteredRecords.reduce((sum, r) => sum + (r.eggsSold || 0) * (r.eggPrice || 5), 0);
  const totalExpenses = filteredRecords.reduce((sum, r) => sum + (r.feedCost || 0) + (r.medicineCost || 0) + (r.otherExpenses || 0), 0);
  const totalProfit = totalIncome - totalExpenses;
  const totalEggs = filteredRecords.reduce((sum, r) => sum + (r.eggsCollected || 0), 0);
  const avgDailyEggs = filteredRecords.length > 0 ? (totalEggs / filteredRecords.length).toFixed(0) : 0;
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12 } } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
  };

  const translations = {
    en: {
      title: "Farm Reports & Analytics",
      subtitle: "Visualize your farm performance with AI insights",
      farmSelector: "Select Farm",
      dateRange: "Date Range",
      week: "Last 7 Days",
      month: "Last 30 Days",
      quarter: "Last 90 Days",
      custom: "Custom Range",
      startDate: "Start Date",
      endDate: "End Date",
      apply: "Apply",
      refresh: "Refresh",
      production: "Production",
      financial: "Financial",
      health: "Health",
      environment: "Environment",
      totalIncome: "Total Income",
      totalExpenses: "Total Expenses",
      totalProfit: "Total Profit",
      totalEggs: "Total Eggs",
      avgDailyEggs: "Avg Daily Eggs",
      aiInsights: "AI Insights",
      recommendations: "Recommendations",
      noData: "No data available. Add daily records in the Farm page!",
      recordsFound: (count) => `${count} records found`,
      goToFarm: "Go to Farm Page"
    },
    am: {
      title: "የእርሻ ሪፖርቶች እና ትንተና",
      subtitle: "የእርሻ አፈጻጸምዎን በኤአይ ግንዛቤዎች ይመልከቱ",
      farmSelector: "እርሻ ምረጡ",
      dateRange: "የቀን ክልል",
      week: "ያለፉ 7 ቀናት",
      month: "ያለፉ 30 ቀናት",
      quarter: "ያለፉ 90 ቀናት",
      custom: "የራስ ክልል",
      startDate: "ጀማሪ ቀን",
      endDate: "መጨረሻ ቀን",
      apply: "አጥራ",
      refresh: "አድስ",
      production: "ምርት",
      financial: "ገንዘብ",
      health: "ጤና",
      environment: "አካባቢ",
      totalIncome: "ጠቅላላ ገቢ",
      totalExpenses: "ጠቅላላ ወጪ",
      totalProfit: "ጠቅላላ ትርፍ",
      totalEggs: "ጠቅላላ እንቁላሎች",
      avgDailyEggs: "አማካይ ዕለታዊ እንቁላሎች",
      aiInsights: "ኤአይ ግንዛቤዎች",
      recommendations: "ምክሮች",
      noData: "ምንም መረጃ የለም። በእርሻ ገጽ ላይ ዕለታዊ መዝገቦችን ይጨምሩ!",
      recordsFound: (count) => `${count} መዝገቦች ተገኝተዋል`,
      goToFarm: "ወደ እርሻ ገጽ ይሂዱ"
    }
  };

  const t = translations[language];

  const exportReport = () => {
    const reportData = {
      farm: selectedFarm?.name,
      period: dateRange,
      totalRecords: filteredRecords.length,
      summary: { totalIncome, totalExpenses, totalProfit, totalEggs, avgDailyEggs },
      records: filteredRecords,
      aiAnalysis: aiAnalysis,
      generatedAt: new Date().toISOString()
    };
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `farm-report-${selectedFarm?.name || 'farm'}-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    toast.success('Report exported!');
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-container">
        <div className="reports-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <label>{t.farmSelector}</label>
            <select value={selectedFarm?._id || ''} onChange={(e) => handleFarmChange(e.target.value)}>
              {farms.length === 0 ? (
                <option value="">No farms - Create one first</option>
              ) : (
                farms.map(farm => <option key={farm._id} value={farm._id}>{farm.name} ({farm.totalBirds} birds)</option>)
              )}
            </select>
          </div>
          <div className="filter-group">
            <label>{t.dateRange}</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="week">{t.week}</option>
              <option value="month">{t.month}</option>
              <option value="quarter">{t.quarter}</option>
              <option value="custom">{t.custom}</option>
            </select>
          </div>
          {dateRange === 'custom' && (
            <>
              <div className="filter-group"><label>{t.startDate}</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div className="filter-group"><label>{t.endDate}</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
              <button className="apply-filter-btn" onClick={filterRecordsByDate}>{t.apply}</button>
            </>
          )}
          <button className="refresh-btn" onClick={refreshData} disabled={refreshing}>
            <i className={`fas fa-sync-alt ${refreshing ? 'fa-spin' : ''}`}></i> {t.refresh}
          </button>
          <button className="export-btn" onClick={exportReport}><i className="fas fa-download"></i> Export</button>
        </div>

        <div className="stats-info">
          <span className="records-count">{t.recordsFound(filteredRecords.length)}</span>
          {filteredRecords.length === 0 && farms.length > 0 && (
            <Link to="/farm" className="go-to-farm-btn">{t.goToFarm} →</Link>
          )}
        </div>

        {filteredRecords.length > 0 && (
          <div className="summary-cards">
            <div className="summary-card"><div className="card-icon income">💰</div><div className="card-info"><span>{t.totalIncome}</span><strong>ETB {totalIncome.toLocaleString()}</strong></div></div>
            <div className="summary-card"><div className="card-icon expense">📉</div><div className="card-info"><span>{t.totalExpenses}</span><strong>ETB {totalExpenses.toLocaleString()}</strong></div></div>
            <div className={`summary-card ${totalProfit >= 0 ? 'profit' : 'loss'}`}><div className="card-icon">💵</div><div className="card-info"><span>{t.totalProfit}</span><strong>ETB {totalProfit.toLocaleString()}</strong></div></div>
            <div className="summary-card"><div className="card-icon">🥚</div><div className="card-info"><span>{t.avgDailyEggs}</span><strong>Eggs/day avg</strong></div></div>
          </div>
        )}

        {filteredRecords.length > 0 && (
          <>
            <div className="chart-tabs">
              <button className={`chart-tab ${activeChart === 'production' ? 'active' : ''}`} onClick={() => setActiveChart('production')}>{t.production}</button>
              <button className={`chart-tab ${activeChart === 'financial' ? 'active' : ''}`} onClick={() => setActiveChart('financial')}>{t.financial}</button>
              <button className={`chart-tab ${activeChart === 'health' ? 'active' : ''}`} onClick={() => setActiveChart('health')}>{t.health}</button>
              <button className={`chart-tab ${activeChart === 'environment' ? 'active' : ''}`} onClick={() => setActiveChart('environment')}>{t.environment}</button>
            </div>

            <div className="charts-container">
              {activeChart === 'production' && (
                <div className="chart-card"><h3>{t.production}</h3><div className="chart-wrapper"><Line data={prepareProductionData()} options={chartOptions} /></div></div>
              )}
              {activeChart === 'financial' && (
                <div className="chart-card"><h3>{t.financial}</h3><div className="chart-wrapper"><Bar data={prepareFinancialData()} options={chartOptions} /></div></div>
              )}
              {activeChart === 'health' && (
                <div className="chart-card"><h3>{t.health}</h3><div className="health-charts"><div className="doughnut-container"><Doughnut data={prepareHealthData()} options={{ responsive: true }} /></div></div></div>
              )}
              {activeChart === 'environment' && (
                <div className="chart-card"><h3>{t.environment}</h3><div className="chart-wrapper"><Line data={prepareEnvironmentData()} options={chartOptions} /></div></div>
              )}
            </div>
          </>
        )}

        {aiAnalysis && aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
          <div className="ai-insights-section">
            <h2><i className="fas fa-robot"></i> {t.aiInsights}</h2>
            <div className="ai-summary"><i className="fas fa-brain"></i><p>{aiAnalysis.summary}</p></div>
            <div className="suggestions-list">
              {aiAnalysis.suggestions.map((suggestion, idx) => (
                <div key={idx} className={`suggestion-item ${suggestion.type}`}>
                  <div className="suggestion-icon">{suggestion.icon}</div>
                  <div className="suggestion-content">
                    <h4>{suggestion.title}</h4>
                    <p>{suggestion.message}</p>
                    <div className="suggestion-actions">
                      <strong>{t.recommendations}:</strong>
                      <ul>{suggestion.actions.slice(0, 5).map((action, i) => <li key={i}>✓ {action}</li>)}</ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredRecords.length === 0 && (
          <div className="no-data-container">
            <div className="no-data">
              <i className="fas fa-chart-line"></i>
              <p>{t.noData}</p>
              {farms.length > 0 && (
                <Link to="/farm" className="create-record-btn">
                  <i className="fas fa-plus"></i> Add Daily Record
                </Link>
              )}
              {farms.length === 0 && (
                <Link to="/farm" className="create-farm-btn">
                  <i className="fas fa-tractor"></i> Create Your First Farm
                </Link>
              )}
            </div>
          </div>
        )}

        {filteredRecords.length > 0 && (
          <div className="data-table-section">
            <h3>📋 Detailed Records ({filteredRecords.length})</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th><th>🥚 Eggs</th><th>❤️ Healthy</th><th>🤒 Sick</th><th>💀 Dead</th><th>💰 Income</th><th>📉 Expenses</th><th>💵 Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 30).map(record => {
                    const income = (record.eggsSold || 0) * (record.eggPrice || 5);
                    const expenses = (record.feedCost || 0) + (record.medicineCost || 0) + (record.otherExpenses || 0);
                    const profit = income - expenses;
                    return (
                      <tr key={record._id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.eggsCollected || 0}</td>
                        <td>{record.healthyBirds || 0}</td>
                        <td className="warning">{record.sickBirds || 0}</td>
                        <td className="danger">{record.deadBirds || 0}</td>
                        <td>ETB {income}</td>
                        <td>ETB {expenses}</td>
                        <td className={profit >= 0 ? 'profit' : 'loss'}>ETB {profit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
