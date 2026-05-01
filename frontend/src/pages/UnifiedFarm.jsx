import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './UnifiedFarm.css';

const API_URL = 'http://localhost:5001/api';

const UnifiedFarm = () => {
  const [language, setLanguage] = useState('en');
  const [activeView, setActiveView] = useState('overview');
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [currentFarm, setCurrentFarm] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  
  // Mode selection
  const [farmMode, setFarmMode] = useState(null);
  const [showModeSelector, setShowModeSelector] = useState(true);
  
  // Company management state
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', username: '', password: '', role: 'farm_worker' });
  const [companyStats, setCompanyStats] = useState({ totalFarms: 0, totalEmployees: 0, totalBirds: 0, totalProfit: 0 });
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [companyForm, setCompanyForm] = useState({ name: '', description: '', address: '', phone: '', email: '' });
  
  // Employee login state
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);
  const [employeeLoginForm, setEmployeeLoginForm] = useState({ companyName: '', username: '', password: '' });
  const [isEmployeeMode, setIsEmployeeMode] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  
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
    farmId: '',
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

  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    
    if (!token || !userData) {
      toast.error('Please login to access farm management');
      navigate('/auth');
      return;
    }
    
    setUser(userData);
    setShowModeSelector(true);
    setLoading(false);
    
  }, [navigate]);

  const loadDataByMode = async (mode) => {
    setLoading(true);
    if (mode === 'individual') {
      await loadUserData();
    } else if (mode === 'company_manager') {
      await loadCompanyData();
    } else if (mode === 'employee') {
      await loadEmployeeData();
    }
    setLoading(false);
  };

  const saveModeToStorage = (mode) => {
    setFarmMode(mode);
    localStorage.setItem('farmMode', mode);
    setShowModeSelector(false);
    loadDataByMode(mode);
  };

  const switchMode = () => {
    setShowModeSelector(true);
    setFarmMode(null);
    setFarms([]);
    setCurrentFarm(null);
    setDailyRecords([]);
    setAiSuggestions(null);
    setCompany(null);
    setIsEmployeeMode(false);
    setEmployeeData(null);
    localStorage.removeItem('farmMode');
  };

  // ============ INDIVIDUAL MODE ============
  const loadUserData = async () => {
    const token = getToken();
    
    try {
      const farmsRes = await axios.get(`${API_URL}/farm/farms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let farmsData = [];
      if (Array.isArray(farmsRes.data)) {
        farmsData = farmsRes.data;
      } else if (farmsRes.data.farms && Array.isArray(farmsRes.data.farms)) {
        farmsData = farmsRes.data.farms;
      } else {
        farmsData = [];
      }
      
      setFarms(farmsData);
      
      if (farmsData.length > 0) {
        setCurrentFarm(farmsData[0]);
        setRecordForm({ ...recordForm, farmId: farmsData[0]._id });
        await loadRecords(farmsData[0]._id);
      }
    } catch (error) {
      console.error('Error loading farms:', error);
      setFarms([]);
    }
  };

  // ============ COMPANY MANAGER MODE ============
  const loadCompanyData = async () => {
    const token = getToken();
    setLoading(true);
    
    try {
      const companyRes = await axios.get(`${API_URL}/company/my-company`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (companyRes.data.company) {
        setCompany(companyRes.data.company);
        setCompanyForm({
          name: companyRes.data.company.name || '',
          description: companyRes.data.company.description || '',
          address: companyRes.data.company.address || '',
          phone: companyRes.data.company.phone || '',
          email: companyRes.data.company.email || ''
        });
        
        const farmsRes = await axios.get(`${API_URL}/company/farms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let farmsData = [];
        if (Array.isArray(farmsRes.data.farms)) {
          farmsData = farmsRes.data.farms;
        } else if (Array.isArray(farmsRes.data)) {
          farmsData = farmsRes.data;
        } else {
          farmsData = [];
        }
        
        setFarms(farmsData);
        
        const employeesRes = await axios.get(`${API_URL}/company/employees`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(employeesRes.data.employees || []);
        
        const statsRes = await axios.get(`${API_URL}/company/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanyStats(statsRes.data);
        
        if (farmsData.length > 0) {
          setCurrentFarm(farmsData[0]);
          setRecordForm({ ...recordForm, farmId: farmsData[0]._id });
          await loadRecords(farmsData[0]._id);
        }
      } else {
        setShowCompanyForm(true);
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      setShowCompanyForm(true);
    }
    setLoading(false);
  };

  // ============ EMPLOYEE MODE ============
  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/company/employee-login`, employeeLoginForm);
      
      if (res.data.success) {
        setEmployeeData(res.data.employee);
        setIsEmployeeMode(true);
        setFarmMode('employee');
        localStorage.setItem('employeeMode', 'true');
        localStorage.setItem('employeeData', JSON.stringify(res.data.employee));
        setShowEmployeeLogin(false);
        await loadEmployeeData();
        toast.success(`Welcome, ${res.data.employee.name}!`);
      } else {
        toast.error(res.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Employee login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const loadEmployeeData = async () => {
    const employee = JSON.parse(localStorage.getItem('employeeData'));
    if (!employee) return;
    
    try {
      const farmsRes = await axios.get(`${API_URL}/company/employee/farms`, {
        headers: { 'X-Employee-Id': employee._id }
      });
      
      let farmsData = [];
      if (Array.isArray(farmsRes.data)) {
        farmsData = farmsRes.data;
      } else if (farmsRes.data.farms) {
        farmsData = farmsRes.data.farms;
      } else {
        farmsData = [];
      }
      
      setFarms(farmsData);
      
      if (farmsData.length > 0) {
        setCurrentFarm(farmsData[0]);
        await loadEmployeeRecords(farmsData[0]._id);
      }
    } catch (error) {
      console.error('Error loading employee farms:', error);
      setFarms([]);
    }
  };

  const loadEmployeeRecords = async (farmId) => {
    const employee = JSON.parse(localStorage.getItem('employeeData'));
    try {
      const recordsRes = await axios.get(`${API_URL}/company/employee/records/${farmId}`, {
        headers: { 'X-Employee-Id': employee._id }
      });
      const records = recordsRes.data.records || recordsRes.data || [];
      setDailyRecords(records);
    } catch (error) {
      console.error('Error loading employee records:', error);
      setDailyRecords([]);
    }
  };

  const handleEmployeeAddRecord = async (e) => {
    e.preventDefault();
    const employee = JSON.parse(localStorage.getItem('employeeData'));
    
    const dataToSave = {
      farmId: currentFarm._id,
      employeeId: employee._id,
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
      const res = await axios.post(`${API_URL}/company/employee/records`, dataToSave, {
        headers: { 'X-Employee-Id': employee._id }
      });
      const newRecord = res.data.record || res.data;
      setDailyRecords([newRecord, ...dailyRecords]);
      setShowRecordForm(false);
      setRecordForm({
        farmId: currentFarm._id,
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
      toast.success('Daily record saved! Manager will review it.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save record');
    }
  };

  // ============ COMMON FUNCTIONS ============
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    if (!token) {
      toast.error('Please login again');
      navigate('/auth');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await axios.put(`${API_URL}/company/my-company`, {
        name: companyForm.name || `${user?.name || 'My'}'s Company`,
        description: companyForm.description || '',
        address: companyForm.address || '',
        phone: companyForm.phone || '',
        email: companyForm.email || ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.company) {
        setCompany(res.data.company);
        setShowCompanyForm(false);
        toast.success('Company created successfully!');
        await loadCompanyData();
      } else {
        toast.error('Failed to create company');
      }
    } catch (error) {
      console.error('Create company error:', error);
      toast.error(error.response?.data?.message || 'Failed to create company');
    }
    setLoading(false);
  };

  const loadRecords = async (farmId) => {
    const token = getToken();
    try {
      const recordsRes = await axios.get(`${API_URL}/farm/records/${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const records = recordsRes.data.records || recordsRes.data || [];
      setDailyRecords(records);
    } catch (error) {
      console.error('Error loading records:', error);
      setDailyRecords([]);
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
    const url = farmMode === 'company_manager' ? `${API_URL}/company/farms` : `${API_URL}/farm/farms`;
    
    try {
      if (editingFarm) {
        const res = await axios.put(`${API_URL}/farm/farms/${editingFarm._id}`, farmForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedFarm = res.data.farm || res.data;
        setFarms(farms.map(f => f._id === editingFarm._id ? updatedFarm : f));
        toast.success('Farm updated!');
      } else {
        const res = await axios.post(url, farmForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newFarm = res.data.farm || res.data;
        setFarms([...farms, newFarm]);
        toast.success('Farm created!');
      }
      setShowFarmForm(false);
      setEditingFarm(null);
      setFarmForm({ name: '', location: '', totalBirds: 0, birdType: 'Layers', establishedDate: '', phone: '', email: '' });
      if (farmMode === 'company_manager') {
        await loadCompanyData();
      } else {
        await loadUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save farm');
    }
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    const token = getToken();
    
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
      const newRecord = res.data.record || res.data;
      setDailyRecords([newRecord, ...dailyRecords]);
      setShowRecordForm(false);
      setRecordForm({
        farmId: currentFarm._id,
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
      toast.success('Daily record saved!');
      loadAISuggestions();
      if (farmMode === 'company_manager') {
        await loadCompanyData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save record');
    }
  };

  const handleSelectFarm = async (farm) => {
    setCurrentFarm(farm);
    setRecordForm({ ...recordForm, farmId: farm._id });
    await loadRecords(farm._id);
    setAiSuggestions(null);
  };

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Delete this farm? All records will be lost.')) return;
    const token = getToken();
    const url = farmMode === 'company_manager' ? `${API_URL}/company/farms/${farmId}` : `${API_URL}/farm/farms/${farmId}`;
    
    try {
      await axios.delete(url, {
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
      if (farmMode === 'company_manager') {
        await loadCompanyData();
      }
    } catch (error) {
      toast.error('Failed to delete farm');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    const username = employeeForm.email.split('@')[0];
    
    try {
      const res = await axios.post(`${API_URL}/company/employees`, {
        name: employeeForm.name,
        email: employeeForm.email,
        username: username,
        password: employeeForm.password,
        role: employeeForm.role
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees([...employees, res.data.employee]);
      setShowEmployeeForm(false);
      setEmployeeForm({ name: '', email: '', username: '', password: '', role: 'farm_worker' });
      toast.success(`Employee added! Login with:\nCompany: ${company?.name}\nUsername: ${username}\nPassword: ${employeeForm.password}`);
      await loadCompanyData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Remove this employee?')) return;
    const token = getToken();
    
    try {
      await axios.delete(`${API_URL}/company/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(employees.filter(e => e._id !== employeeId));
      toast.success('Employee removed');
      await loadCompanyData();
    } catch (error) {
      toast.error('Failed to remove employee');
    }
  };

  const employeeLogout = () => {
    setIsEmployeeMode(false);
    setEmployeeData(null);
    setFarmMode(null);
    setFarms([]);
    setCurrentFarm(null);
    setDailyRecords([]);
    localStorage.removeItem('employeeMode');
    localStorage.removeItem('employeeData');
    setShowModeSelector(true);
    toast.success('Logged out from employee mode');
  };

  const translations = {
    en: {
      title: "🐔 Smart Farm Management",
      subtitle: "Track daily records, get AI insights, maximize profits",
      modeSelector: "Select Mode",
      individualMode: "👤 Individual Farmer (ለግል)",
      companyMode: "🏢 Company Manager (ለድርጅት)",
      employeeMode: "👥 Employee Login",
      individualDesc: "Manage your personal farm, track records, and get AI insights",
      companyDesc: "Manage multiple farms, employees, and company-wide analytics",
      employeeDesc: "Login with company credentials provided by your manager",
      overview: "Overview",
      records: "Daily Records",
      insights: "AI Insights",
      employees: "Employees",
      myFarms: "My Farms",
      companyFarms: "Company Farms",
      addFarm: "+ New Farm",
      addRecord: "+ Add Daily Record",
      addEmployee: "+ Add Employee",
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
      aiSuggestions: "AI Suggestions",
      companyStats: "Company Statistics",
      totalCompanyFarms: "Total Farms",
      totalEmployees: "Total Employees",
      totalCompanyBirds: "Total Birds",
      totalCompanyProfit: "Total Profit",
      employeeName: "Full Name",
      employeeEmail: "Email",
      employeeRole: "Role",
      farmManager: "Farm Manager",
      farmWorker: "Farm Worker",
      add: "Add",
      companyInfo: "Company Information",
      companyName: "Company Name",
      companyDescription: "Description",
      companyAddress: "Address",
      companyPhone: "Phone",
      companyEmail: "Email",
      createCompany: "Create Company",
      switchToIndividual: "Switch to Individual Mode",
      switchToCompany: "Switch to Company Mode",
      employeeLoginTitle: "Employee Login",
      employeeLoginSubtitle: "Enter your company credentials",
      companyNameLabel: "Company Name",
      usernameLabel: "Username",
      passwordLabel: "Password",
      loginBtn: "Login",
      backToModeSelect: "Back to Mode Select",
      logoutEmployee: "Logout from Employee Mode"
    },
    am: {
      title: "🐔 ስማርት የእርሻ አስተዳደር",
      subtitle: "ዕለታዊ መዝገቦችን ይከታተሉ፣ የኤአይ ግንዛቤዎችን ያግኙ፣ ትርፍዎን ያሳድጉ",
      modeSelector: "ሁነታ ምረጡ",
      individualMode: "👤 ለግል አርሶ አደር",
      companyMode: "🏢 የድርጅት ሥራ አስኪያጅ",
      employeeMode: "👥 ሠራተኛ ግባ",
      individualDesc: "የግል እርሻዎን ያስተዳድሩ፣ መዝገቦችን ይከታተሉ",
      companyDesc: "በርካታ እርሻዎችን፣ ሠራተኞችን እና የድርጅት ትንተናዎችን ያስተዳድሩ",
      employeeDesc: "በአስተዳዳሪዎ የተሰገዎት ምስክርነት ይግቡ",
      overview: "አጠቃላይ እይታ",
      records: "ዕለታዊ መዝገቦች",
      insights: "ኤአይ ግንዛቤዎች",
      employees: "ሠራተኞች",
      myFarms: "እርሻዎቼ",
      companyFarms: "የድርጅት እርሻዎች",
      addFarm: "+ አዲስ እርሻ",
      addRecord: "+ ዕለታዊ መዝገብ",
      addEmployee: "+ ሠራተኛ ጨምር",
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
      aiSuggestions: "ኤአይ ምክሮች",
      companyStats: "የድርጅት ስታቲስቲክስ",
      totalCompanyFarms: "ጠቅላላ እርሻዎች",
      totalEmployees: "ጠቅላላ ሠራተኞች",
      totalCompanyBirds: "ጠቅላላ ዶሮዎች",
      totalCompanyProfit: "ጠቅላላ ትርፍ",
      employeeName: "ሙሉ ስም",
      employeeEmail: "ኢሜይል",
      employeeRole: "ሚና",
      farmManager: "የእርሻ ሥራ አስኪያጅ",
      farmWorker: "የእርሻ ሠራተኛ",
      add: "ጨምር",
      companyInfo: "የድርጅት መረጃ",
      companyName: "የድርጅት ስም",
      companyDescription: "መግለጫ",
      companyAddress: "አድራሻ",
      companyPhone: "ስልክ",
      companyEmail: "ኢሜይል",
      createCompany: "ድርጅት ፍጠር",
      switchToIndividual: "ወደ ግል ሁነታ ቀይር",
      switchToCompany: "ወደ ድርጅት ሁነታ ቀይር",
      employeeLoginTitle: "የሠራተኛ መግቢያ",
      employeeLoginSubtitle: "የድርጅትዎን ምስክርነት ያስገቡ",
      companyNameLabel: "የድርጅት ስም",
      usernameLabel: "የተጠቃሚ ስም",
      passwordLabel: "የይለፍ ቃል",
      loginBtn: "ግባ",
      backToModeSelect: "ወደ ሁነታ ምረጫ ተመለስ",
      logoutEmployee: "ከሠራተኛ ሁነታ ውጣ"
    }
  };

  const t = translations[language];
  
  const totalIncome = dailyRecords.reduce((sum, r) => sum + (r.eggsSold || 0) * (r.eggPrice || 5), 0);
  const totalExpenses = dailyRecords.reduce((sum, r) => sum + (r.feedCost || 0) + (r.medicineCost || 0) + (r.otherExpenses || 0), 0);
  const profit = totalIncome - totalExpenses;
  const avgEggs = dailyRecords.length > 0 ? (dailyRecords.reduce((sum, r) => sum + (r.eggsCollected || 0), 0) / dailyRecords.length).toFixed(0) : 0;

  // Employee Login UI
  if (showEmployeeLogin) {
    return (
      <div className="mode-selector-page">
        <div className="mode-selector-container" style={{ maxWidth: '500px' }}>
          <div className="mode-selector-header">
            <h2>👥 {t.employeeLoginTitle}</h2>
            <p>{t.employeeLoginSubtitle}</p>
          </div>
          <form onSubmit={handleEmployeeLogin}>
            <input
              type="text"
              placeholder={t.companyNameLabel}
              value={employeeLoginForm.companyName}
              onChange={(e) => setEmployeeLoginForm({...employeeLoginForm, companyName: e.target.value})}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <input
              type="text"
              placeholder={t.usernameLabel}
              value={employeeLoginForm.username}
              onChange={(e) => setEmployeeLoginForm({...employeeLoginForm, username: e.target.value})}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <input
              type="password"
              placeholder={t.passwordLabel}
              value={employeeLoginForm.password}
              onChange={(e) => setEmployeeLoginForm({...employeeLoginForm, password: e.target.value})}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <button type="submit" className="mode-select-btn" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Logging in...' : t.loginBtn}
            </button>
            <button type="button" onClick={() => setShowEmployeeLogin(false)} className="cancel-btn" style={{ width: '100%', marginTop: '10px' }}>
              {t.backToModeSelect}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============ MODE SELECTOR UI - FIXED COMPANY BUTTON ============
  if (showModeSelector && !loading && !isEmployeeMode) {
    return (
      <div className="mode-selector-page">
        <div className="mode-selector-container">
          <div className="mode-selector-header">
            <h1>🐔 Smart Poultry AI</h1>
            <h2>{t.modeSelector}</h2>
            <p>Please select how you want to manage your farms</p>
          </div>
          <div className="mode-cards">
            {/* Individual Mode */}
            <div className="mode-card" onClick={() => saveModeToStorage('individual')}>
              <div className="mode-icon">👤</div>
              <h3>{t.individualMode}</h3>
              <p>{t.individualDesc}</p>
              <button className="mode-select-btn">Select Individual Mode</button>
              <small style={{ display: 'block', marginTop: '10px', color: '#10b981' }}>
                ✅ Using: {user?.name || 'Your account'}
              </small>
            </div>

            {/* Company Mode - FIXED: Using window.location.href */}
            <div 
              className="mode-card" 
              onClick={() => {
                console.log('Redirecting to Company Portal...');
                window.location.href = '/company-auth';
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="mode-icon">🏢</div>
              <h3>{t.companyMode}</h3>
              <p>{t.companyDesc}</p>
              <button className="mode-select-btn company-btn" style={{ background: '#3b82f6' }}>
                Login to Company Portal
              </button>
              <small style={{ display: 'block', marginTop: '10px', color: '#6b7280' }}>
                🔐 Separate company account required
              </small>
            </div>

            {/* Employee Login */}
            <div className="mode-card" onClick={() => setShowEmployeeLogin(true)}>
              <div className="mode-icon">👥</div>
              <h3>{t.employeeMode}</h3>
              <p>{t.employeeDesc}</p>
              <button className="mode-select-btn">Employee Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Employee mode view
  if (isEmployeeMode && farmMode === 'employee') {
    return (
      <div className="unified-farm-page">
        <div className="farm-container-unified">
          <div className="farm-header-unified">
            <div className="header-top">
              <div className="mode-indicator">
                <span className="mode-badge">👥 Employee Mode</span>
                <button className="switch-mode-link" onClick={employeeLogout}>
                  🔄 {t.logoutEmployee}
                </button>
              </div>
            </div>
            <h1>👥 {employeeData?.name}'s Dashboard</h1>
            <p>{t.subtitle}</p>
            <div className="welcome-banner">🏢 Working at: {employeeData?.companyName}</div>
          </div>

          <div className="farm-selector-unified">
            <div className="selector-header">
              <span><i className="fas fa-tractor"></i> My Assigned Farms ({farms.length})</span>
            </div>
            <div className="selector-farms">
              {farms.length === 0 ? (
                <div className="no-farms-message">No farms assigned yet. Contact your manager.</div>
              ) : (
                farms.map(farm => (
                  <div key={farm._id} className={`farm-card-mini ${currentFarm?._id === farm._id ? 'active' : ''}`}>
                    <div className="farm-info-mini">
                      <strong>{farm.name}</strong>
                      <span>{farm.totalBirds} 🐔</span>
                    </div>
                    <div className="farm-actions-mini">
                      <button onClick={() => handleSelectFarm(farm)} title={t.selectFarm}><i className="fas fa-check"></i></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {currentFarm && (
            <div className="quick-stats">
              <div className="stat"><span className="stat-icon">🐔</span><div className="stat-info"><label>{t.totalBirds}</label><strong>{currentFarm.totalBirds}</strong></div></div>
              <div className="stat"><span className="stat-icon">🥚</span><div className="stat-info"><label>Eggs/Day</label><strong>{avgEggs}</strong></div></div>
              <div className="stat"><span className="stat-icon">💰</span><div className="stat-info"><label>{t.profit}</label><strong className={profit >= 0 ? 'profit' : 'loss'}>ETB {profit}</strong></div></div>
              <button className="add-record-quick" onClick={() => setShowRecordForm(true)}><i className="fas fa-plus"></i> {t.addRecord}</button>
            </div>
          )}

          {currentFarm && (
            <div className="farm-tabs-unified">
              <button className={`tab ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}><i className="fas fa-chart-pie"></i> {t.overview}</button>
              <button className={`tab ${activeView === 'records' ? 'active' : ''}`} onClick={() => setActiveView('records')}><i className="fas fa-calendar"></i> {t.records}</button>
            </div>
          )}

          {activeView === 'overview' && currentFarm && (
            <div className="overview-tab">
              <div className="farm-details-card">
                <h3><i className="fas fa-info-circle"></i> {t.farmDetails}</h3>
                <div className="details-grid">
                  <div><label>📍 {t.location}:</label> <span>{currentFarm.location || 'Not set'}</span></div>
                  <div><label>🐔 Type:</label> <span>{currentFarm.birdType}</span></div>
                  <div><label>📅 Established:</label> <span>{currentFarm.establishedDate ? new Date(currentFarm.establishedDate).toLocaleDateString() : 'Not set'}</span></div>
                </div>
              </div>
              <div className="recent-records">
                <h3><i className="fas fa-history"></i> {t.recentRecords}</h3>
                <div className="records-preview">
                  {dailyRecords.slice(0, 5).map(record => (
                    <div key={record._id} className="preview-record">
                      <span className="date">{new Date(record.date).toLocaleDateString()}</span>
                      <span className="eggs">🥚 {record.eggsCollected || 0}</span>
                      <span className="health">❤️ {record.healthyBirds || 0}</span>
                    </div>
                  ))}
                  {dailyRecords.length === 0 && <div className="no-records">{t.noRecords}</div>}
                </div>
              </div>
            </div>
          )}

          {activeView === 'records' && currentFarm && (
            <div className="records-tab">
              <div className="records-table-container">
                {dailyRecords.length === 0 ? (
                  <div className="empty-records"><i className="fas fa-calendar-alt"></i><p>{t.noRecords}</p></div>
                ) : (
                  <table className="records-table">
                    <thead>
                      <tr><th>{t.date}</th><th>🐔 {t.healthy}</th><th>🤒 {t.sick}</th><th>💀 {t.dead}</th><th>🥚 {t.eggs}</th><th>💰 Profit</th></tr>
                    </thead>
                    <tbody>
                      {dailyRecords.map(record => {
                        const recordProfit = (record.eggsSold || 0) * (record.eggPrice || 5) - ((record.feedCost || 0) + (record.medicineCost || 0) + (record.otherExpenses || 0));
                        return (
                          <tr key={record._id}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>{record.healthyBirds || 0}</td>
                            <td className="warning">{record.sickBirds || 0}</td>
                            <td className="danger">{record.deadBirds || 0}</td>
                            <td>{record.eggsCollected || 0}</td>
                            <td className={recordProfit >= 0 ? 'profit' : 'loss'}>ETB {recordProfit}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Record Form Modal for Employee */}
          {showRecordForm && currentFarm && (
            <div className="modal-overlay" onClick={() => setShowRecordForm(false)}>
              <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                <h2>📝 Add Daily Record - {currentFarm.name}</h2>
                <form onSubmit={handleEmployeeAddRecord}>
                  <div className="form-grid">
                    <input type="date" value={recordForm.date} onChange={(e) => setRecordForm({...recordForm, date: e.target.value})} required />
                    <input type="number" placeholder="🐔 Healthy Birds" value={recordForm.healthyBirds} onChange={(e) => setRecordForm({...recordForm, healthyBirds: parseInt(e.target.value)})} />
                    <input type="number" placeholder="🤒 Sick Birds" value={recordForm.sickBirds} onChange={(e) => setRecordForm({...recordForm, sickBirds: parseInt(e.target.value)})} />
                    <input type="number" placeholder="💀 Dead Birds" value={recordForm.deadBirds} onChange={(e) => setRecordForm({...recordForm, deadBirds: parseInt(e.target.value)})} />
                    <input type="number" placeholder="🥚 Eggs Collected" value={recordForm.eggsCollected} onChange={(e) => setRecordForm({...recordForm, eggsCollected: parseInt(e.target.value)})} />
                    <input type="number" placeholder="💰 Eggs Sold" value={recordForm.eggsSold} onChange={(e) => setRecordForm({...recordForm, eggsSold: parseInt(e.target.value)})} />
                    <input type="number" step="0.5" placeholder="💵 Egg Price (ETB)" value={recordForm.eggPrice} onChange={(e) => setRecordForm({...recordForm, eggPrice: parseFloat(e.target.value)})} />
                    <input type="number" placeholder="💰 Feed Cost (ETB)" value={recordForm.feedCost} onChange={(e) => setRecordForm({...recordForm, feedCost: parseInt(e.target.value)})} />
                    <input type="number" placeholder="💊 Medicine Cost" value={recordForm.medicineCost} onChange={(e) => setRecordForm({...recordForm, medicineCost: parseInt(e.target.value)})} />
                  </div>
                  <textarea placeholder="📝 Notes" rows="2" value={recordForm.notes} onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})} />
                  <div className="modal-buttons"><button type="submit" className="save-btn">{t.save}</button><button type="button" className="cancel-btn" onClick={() => setShowRecordForm(false)}>{t.cancel}</button></div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Company creation form
  if (showCompanyForm && farmMode === 'company_manager') {
    return (
      <div className="unified-farm-page">
        <div className="company-setup-container">
          <div className="company-setup-card">
            <h2>🏢 {t.createCompany}</h2>
            <p>Set up your company to start managing multiple farms</p>
            <form onSubmit={handleCreateCompany}>
              <input type="text" placeholder={t.companyName} value={companyForm.name} onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})} required />
              <textarea placeholder={t.companyDescription} value={companyForm.description} onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})} rows="3" />
              <input type="text" placeholder={t.companyAddress} value={companyForm.address} onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})} />
              <input type="tel" placeholder={t.companyPhone} value={companyForm.phone} onChange={(e) => setCompanyForm({...companyForm, phone: e.target.value})} />
              <input type="email" placeholder={t.companyEmail} value={companyForm.email} onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})} />
              <div className="modal-buttons">
                <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Creating...' : t.createCompany}</button>
                <button type="button" className="cancel-btn" onClick={switchMode}>{t.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-farm">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading your farm data...</p>
      </div>
    );
  }

  // INDIVIDUAL MODE or COMPANY MANAGER MODE Full Dashboard
  return (
    <div className="unified-farm-page">
      <div className="farm-container-unified">
        <div className="farm-header-unified">
          <div className="header-top">
            <div className="mode-indicator">
              <span className="mode-badge">
                {farmMode === 'individual' ? '👤 ' + t.individualMode : '🏢 ' + t.companyMode}
              </span>
              <button className="switch-mode-link" onClick={switchMode}>
                🔄 {farmMode === 'individual' ? t.switchToCompany : t.switchToIndividual}
              </button>
            </div>
          </div>
          <h1>{farmMode === 'company_manager' ? '🏢 ' + (company?.name || t.title) : t.title}</h1>
          <p>{t.subtitle}</p>
          {user && <div className="welcome-banner">👋 Welcome, {user.name}!</div>}
        </div>

        {/* Company Stats Dashboard */}
        {farmMode === 'company_manager' && (
          <div className="company-stats-dashboard">
            <h3>{t.companyStats}</h3>
            <div className="company-stats-grid">
              <div className="company-stat-card"><div className="stat-icon">🏠</div><div className="stat-info"><span>{t.totalCompanyFarms}</span><strong>{companyStats.totalFarms || farms.length}</strong></div></div>
              <div className="company-stat-card"><div className="stat-icon">👥</div><div className="stat-info"><span>{t.totalEmployees}</span><strong>{companyStats.totalEmployees || employees.length}</strong></div></div>
              <div className="company-stat-card"><div className="stat-icon">🐔</div><div className="stat-info"><span>{t.totalCompanyBirds}</span><strong>{companyStats.totalBirds || farms.reduce((sum, f) => sum + (f.totalBirds || 0), 0)}</strong></div></div>
              <div className="company-stat-card profit"><div className="stat-icon">💰</div><div className="stat-info"><span>{t.totalCompanyProfit}</span><strong>ETB {companyStats.totalProfit || 0}</strong></div></div>
            </div>
          </div>
        )}

        <div className="farm-selector-unified">
          <div className="selector-header">
            <span><i className="fas fa-tractor"></i> {farmMode === 'company_manager' ? t.companyFarms : t.myFarms} ({farms.length})</span>
            <button className="add-farm-btn-small" onClick={() => { setShowFarmForm(true); setEditingFarm(null); setFarmForm({ name: '', location: '', totalBirds: 0, birdType: 'Layers', establishedDate: '', phone: '', email: '' }); }}>
              <i className="fas fa-plus"></i> {t.addFarm}
            </button>
          </div>
          <div className="selector-farms">
            {farms.length === 0 ? (
              <div className="no-farms-message">{t.noFarms}</div>
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

        {currentFarm && (
          <div className="quick-stats">
            <div className="stat"><span className="stat-icon">🐔</span><div className="stat-info"><label>{t.totalBirds}</label><strong>{currentFarm.totalBirds}</strong></div></div>
            <div className="stat"><span className="stat-icon">🥚</span><div className="stat-info"><label>Eggs/Day</label><strong>{avgEggs}</strong></div></div>
            <div className="stat"><span className="stat-icon">💰</span><div className="stat-info"><label>{t.profit}</label><strong className={profit >= 0 ? 'profit' : 'loss'}>ETB {profit}</strong></div></div>
            <button className="add-record-quick" onClick={() => setShowRecordForm(true)}><i className="fas fa-plus"></i> {t.addRecord}</button>
          </div>
        )}

        {currentFarm && (
          <div className="farm-tabs-unified">
            <button className={`tab ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}><i className="fas fa-chart-pie"></i> {t.overview}</button>
            <button className={`tab ${activeView === 'records' ? 'active' : ''}`} onClick={() => setActiveView('records')}><i className="fas fa-calendar"></i> {t.records}</button>
            <button className={`tab ${activeView === 'insights' ? 'active' : ''}`} onClick={() => { setActiveView('insights'); loadAISuggestions(); }}><i className="fas fa-brain"></i> {t.insights}</button>
            {farmMode === 'company_manager' && (
              <button className={`tab ${activeView === 'employees' ? 'active' : ''}`} onClick={() => setActiveView('employees')}><i className="fas fa-users"></i> {t.employees}</button>
            )}
          </div>
        )}

        {!currentFarm && farms.length === 0 && (
          <div className="no-farm-message">
            <i className="fas fa-tractor"></i>
            <p>{t.noFarms}</p>
            <button className="create-farm-btn" onClick={() => setShowFarmForm(true)}>
              <i className="fas fa-plus"></i> {t.addFarm}
            </button>
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
              <div className="records-preview">
                {dailyRecords.slice(0, 5).map(record => (
                  <div key={record._id} className="preview-record">
                    <span className="date">{new Date(record.date).toLocaleDateString()}</span>
                    <span className="eggs">🥚 {record.eggsCollected || 0}</span>
                    <span className="health">❤️ {record.healthyBirds || 0}</span>
                    <span className={record.deadBirds > 0 ? 'danger' : ''}>💀 {record.deadBirds || 0}</span>
                  </div>
                ))}
                {dailyRecords.length === 0 && <div className="no-records">{t.noRecords}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeView === 'records' && currentFarm && (
          <div className="records-tab">
            <div className="records-table-container">
              {dailyRecords.length === 0 ? (
                <div className="empty-records">
                  <i className="fas fa-calendar-alt"></i>
                  <p>{t.noRecords}</p>
                </div>
              ) : (
                <table className="records-table">
                  <thead>
                    <tr><th>{t.date}</th><th>🐔 {t.healthy}</th><th>🤒 {t.sick}</th><th>💀 {t.dead}</th><th>🥚 {t.eggs}</th><th>💰 Profit</th></tr>
                  </thead>
                  <tbody>
                    {dailyRecords.map(record => {
                      const recordProfit = (record.eggsSold || 0) * (record.eggPrice || 5) - ((record.feedCost || 0) + (record.medicineCost || 0) + (record.otherExpenses || 0));
                      return (
                        <tr key={record._id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.healthyBirds || 0}</td>
                          <td className="warning">{record.sickBirds || 0}</td>
                          <td className="danger">{record.deadBirds || 0}</td>
                          <td>{record.eggsCollected || 0}</td>
                          <td className={recordProfit >= 0 ? 'profit' : 'loss'}>ETB {recordProfit}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeView === 'insights' && currentFarm && (
          <div className="insights-tab">
            {aiSuggestions ? (
              <div className="ai-summary-card">
                <div className="ai-summary"><i className="fas fa-robot"></i><p>{aiSuggestions.summary}</p></div>
                {aiSuggestions.suggestions && aiSuggestions.suggestions.map((s, idx) => (
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

        {/* Employees Tab (Company Manager Only) */}
        {activeView === 'employees' && farmMode === 'company_manager' && (
          <div className="employees-tab">
            <div className="employees-header">
              <h3><i className="fas fa-users"></i> {t.employees}</h3>
              <button className="add-employee-btn" onClick={() => setShowEmployeeForm(true)}>
                <i className="fas fa-plus"></i> {t.addEmployee}
              </button>
            </div>
            <div className="employees-list">
              {employees.length === 0 ? (
                <div className="no-employees">No employees yet. Add your first employee!</div>
              ) : (
                <table className="employees-table">
                  <thead>
                    <tr><th>👤 {t.employeeName}</th><th>📧 {t.employeeEmail}</th><th>👤 Username</th><th>🎭 {t.employeeRole}</th><th>⚙️ Actions</th></tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp._id}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td><code>{emp.username}</code></td>
                        <td><span className="role-badge">{emp.role}</span></td>
                        <td><button className="delete-employee-btn" onClick={() => handleDeleteEmployee(emp._id)}><i className="fas fa-trash"></i></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
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
                <input type="date" placeholder="Established Date" value={farmForm.establishedDate} onChange={(e) => setFarmForm({...farmForm, establishedDate: e.target.value})} />
                <input type="tel" placeholder="Phone" value={farmForm.phone} onChange={(e) => setFarmForm({...farmForm, phone: e.target.value})} />
                <input type="email" placeholder="Email" value={farmForm.email} onChange={(e) => setFarmForm({...farmForm, email: e.target.value})} />
                <div className="modal-buttons"><button type="submit" className="save-btn">{t.save}</button><button type="button" className="cancel-btn" onClick={() => setShowFarmForm(false)}>{t.cancel}</button></div>
              </form>
            </div>
          </div>
        )}

        {/* Employee Form Modal */}
        {showEmployeeForm && (
          <div className="modal-overlay" onClick={() => setShowEmployeeForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{t.addEmployee}</h2>
              <form onSubmit={handleAddEmployee}>
                <input type="text" placeholder={t.employeeName} value={employeeForm.name} onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})} required />
                <input type="email" placeholder={t.employeeEmail} value={employeeForm.email} onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})} required />
                <input type="password" placeholder="Password" value={employeeForm.password} onChange={(e) => setEmployeeForm({...employeeForm, password: e.target.value})} required />
                <select value={employeeForm.role} onChange={(e) => setEmployeeForm({...employeeForm, role: e.target.value})}>
                  <option value="farm_manager">{t.farmManager}</option>
                  <option value="farm_worker">{t.farmWorker}</option>
                </select>
                <div className="modal-buttons"><button type="submit" className="save-btn">{t.add}</button><button type="button" className="cancel-btn" onClick={() => setShowEmployeeForm(false)}>{t.cancel}</button></div>
              </form>
            </div>
          </div>
        )}

        {/* Record Form Modal */}
        {showRecordForm && currentFarm && (
          <div className="modal-overlay" onClick={() => setShowRecordForm(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <h2>📝 Add Daily Record - {currentFarm.name}</h2>
              <form onSubmit={handleSaveRecord}>
                <div className="form-grid">
                  <input type="date" value={recordForm.date} onChange={(e) => setRecordForm({...recordForm, date: e.target.value})} required />
                  <input type="number" placeholder="🐔 Healthy Birds" value={recordForm.healthyBirds} onChange={(e) => setRecordForm({...recordForm, healthyBirds: parseInt(e.target.value)})} />
                  <input type="number" placeholder="🤒 Sick Birds" value={recordForm.sickBirds} onChange={(e) => setRecordForm({...recordForm, sickBirds: parseInt(e.target.value)})} />
                  <input type="number" placeholder="💀 Dead Birds" value={recordForm.deadBirds} onChange={(e) => setRecordForm({...recordForm, deadBirds: parseInt(e.target.value)})} />
                  <input type="number" placeholder="🥚 Eggs Collected" value={recordForm.eggsCollected} onChange={(e) => setRecordForm({...recordForm, eggsCollected: parseInt(e.target.value)})} />
                  <input type="number" placeholder="💰 Eggs Sold" value={recordForm.eggsSold} onChange={(e) => setRecordForm({...recordForm, eggsSold: parseInt(e.target.value)})} />
                  <input type="number" step="0.5" placeholder="💵 Egg Price (ETB)" value={recordForm.eggPrice} onChange={(e) => setRecordForm({...recordForm, eggPrice: parseFloat(e.target.value)})} />
                  <input type="number" placeholder="🌾 Feed Consumed (kg)" value={recordForm.feedConsumed} onChange={(e) => setRecordForm({...recordForm, feedConsumed: parseInt(e.target.value)})} />
                  <input type="number" placeholder="💰 Feed Cost (ETB)" value={recordForm.feedCost} onChange={(e) => setRecordForm({...recordForm, feedCost: parseInt(e.target.value)})} />
                  <input type="number" placeholder="💊 Medicine Cost" value={recordForm.medicineCost} onChange={(e) => setRecordForm({...recordForm, medicineCost: parseInt(e.target.value)})} />
                  <input type="number" placeholder="📋 Other Expenses" value={recordForm.otherExpenses} onChange={(e) => setRecordForm({...recordForm, otherExpenses: parseInt(e.target.value)})} />
                  <input type="number" step="0.1" placeholder="🌡️ Temperature (°C)" value={recordForm.temperature} onChange={(e) => setRecordForm({...recordForm, temperature: parseFloat(e.target.value)})} />
                  <input type="number" placeholder="💧 Humidity (%)" value={recordForm.humidity} onChange={(e) => setRecordForm({...recordForm, humidity: parseInt(e.target.value)})} />
                </div>
                <textarea placeholder="📝 Notes" rows="2" value={recordForm.notes} onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})} />
                <div className="modal-buttons"><button type="submit" className="save-btn">{t.save}</button><button type="button" className="cancel-btn" onClick={() => setShowRecordForm(false)}>{t.cancel}</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedFarm;