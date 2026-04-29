import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import './FarmManagement.css';

const FarmManagement = () => {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('farms');
  const [farms, setFarms] = useState([]);
  const [currentFarm, setCurrentFarm] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [editingFarm, setEditingFarm] = useState(null);
  
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
    totalBirds: 0,
    healthyBirds: 0,
    sickBirds: 0,
    deadBirds: 0,
    eggsCollected: 0,
    eggsSold: 0,
    eggPrice: 5,
    feedConsumed: 0,
    feedCost: 0,
    medicineCost: 0,
    otherExpenses: 0,
    temperature: 0,
    humidity: 0,
    notes: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    loadFarms();
  }, []);

  const loadFarms = () => {
    const savedFarms = localStorage.getItem('poultry_farms');
    if (savedFarms) {
      const farmsData = JSON.parse(savedFarms);
      setFarms(farmsData);
      const current = localStorage.getItem('current_farm');
      if (current) {
        setCurrentFarm(JSON.parse(current));
        loadDailyRecords(JSON.parse(current).id);
      } else if (farmsData.length > 0) {
        setCurrentFarm(farmsData[0]);
        localStorage.setItem('current_farm', JSON.stringify(farmsData[0]));
        loadDailyRecords(farmsData[0].id);
      }
    }
  };

  const loadDailyRecords = (farmId) => {
    const records = localStorage.getItem(`daily_records_${farmId}`);
    if (records) {
      const recordsData = JSON.parse(records);
      setDailyRecords(recordsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setDailyRecords([]);
    }
  };

  const saveFarms = (updatedFarms) => {
    localStorage.setItem('poultry_farms', JSON.stringify(updatedFarms));
    setFarms(updatedFarms);
  };

  // AI Suggestion Engine
  const generateAISuggestions = () => {
    if (!currentFarm || dailyRecords.length === 0) {
      setAiSuggestions({
        summary: language === 'en' 
          ? '📊 Add daily records to get personalized AI suggestions!'
          : '📊 ለግል የኤአይ ምክሮች ዕለታዊ መዝገቦችን ይጨምሩ!',
        suggestions: []
      });
      return;
    }

    const last7Days = dailyRecords.slice(0, 7);
    const avgEggProduction = last7Days.reduce((sum, r) => sum + (r.eggsCollected || 0), 0) / Math.min(7, last7Days.length);
    const avgMortality = last7Days.reduce((sum, r) => sum + (r.deadBirds || 0), 0) / Math.min(7, last7Days.length);
    const avgFeedEfficiency = last7Days.reduce((sum, r) => sum + ((r.eggsCollected || 0) / (r.feedConsumed || 1)), 0) / Math.min(7, last7Days.length);
    const latestRecord = dailyRecords[0];
    
    const suggestions = [];
    let summary = '';
    let totalIncome = 0;
    let totalExpenses = 0;
    
    // Calculate financial summary
    dailyRecords.forEach(record => {
      totalIncome += (record.eggsSold || 0) * (record.eggPrice || 5);
      totalExpenses += (record.feedCost || 0) + (record.medicineCost || 0) + (record.otherExpenses || 0);
    });
    const profit = totalIncome - totalExpenses;
    
    // Egg production suggestions
    if (avgEggProduction < currentFarm.totalBirds * 0.6) {
      suggestions.push({
        type: 'production',
        priority: 'high',
        icon: '🥚',
        titleEn: 'Low Egg Production Detected',
        titleAm: 'ዝቅተኛ የእንቁላል ምርት ተገኝቷል',
        messageEn: `Your egg production is ${avgEggProduction.toFixed(0)} eggs/day (${((avgEggProduction/currentFarm.totalBirds)*100).toFixed(0)}% of flock). Target is 80-90%.`,
        messageAm: `የእንቁላል ምርትዎ በቀን ${avgEggProduction.toFixed(0)} እንቁላል ነው (ከመንጋዎ ${((avgEggProduction/currentFarm.totalBirds)*100).toFixed(0)}%)። ግብ 80-90% ነው።`,
        actions: [
          'Increase protein to 16-18% in feed',
          'Ensure 14-16 hours of light daily',
          'Add calcium supplement (oyster shells)',
          'Check for stress factors',
          'የመኖ ፕሮቲን ወደ 16-18% ይጨምሩ',
          'በየቀኑ 14-16 ሰአት ብርሃን ያረጋግጡ'
        ]
      });
    }
    
    // Mortality suggestions
    if (avgMortality > currentFarm.totalBirds * 0.01) {
      suggestions.push({
        type: 'health',
        priority: 'critical',
        icon: '⚠️',
        titleEn: 'High Mortality Rate',
        titleAm: 'ከፍተኛ የሞት መጠን',
        messageEn: `Daily mortality: ${avgMortality.toFixed(1)} birds/day (${((avgMortality/currentFarm.totalBirds)*100).toFixed(1)}% of flock). Normal is <1%.`,
        messageAm: `ዕለታዊ ሞት: ${avgMortality.toFixed(1)} ዶሮዎች/ቀን (ከመንጋዎ ${((avgMortality/currentFarm.totalBirds)*100).toFixed(1)}%)። መደበኛ ከ1% በታች ነው።`,
        actions: [
          'URGENT: Contact veterinarian immediately',
          'Check for disease symptoms',
          'Improve ventilation',
          'Disinfect the poultry house',
          'አስቸኳይ: የእንስሳት ሐኪም ይደውሉ',
          'የበሽታ ምልክቶችን ይፈትሹ'
        ]
      });
    }
    
    // Temperature suggestions
    if (latestRecord && latestRecord.temperature > 33) {
      suggestions.push({
        type: 'environment',
        priority: 'high',
        icon: '🌡️',
        titleEn: 'High Temperature Alert',
        titleAm: 'ከፍተኛ የሙቀት መጠን ማስጠንቀቂያ',
        messageEn: `Temperature is ${latestRecord.temperature}°C. Optimal is 18-24°C.`,
        messageAm: `የሙቀት መጠን ${latestRecord.temperature}°C ነው። ጥሩው 18-24°C ነው።`,
        actions: [
          'Increase ventilation immediately',
          'Provide extra water stations',
          'Add ice or misters',
          'Reduce stocking density',
          'ወዲያውኑ አየር ማናፈሻ ይጨምሩ',
          'ተጨማሪ የውሃ ማቆሚያዎች ያዘጋጁ'
        ]
      });
    }
    
    // Humidity suggestions
    if (latestRecord && latestRecord.humidity > 75) {
      suggestions.push({
        type: 'environment',
        priority: 'medium',
        icon: '💧',
        titleEn: 'High Humidity Detected',
        titleAm: 'ከፍተኛ እርጥበት ተገኝቷል',
        messageEn: `Humidity is ${latestRecord.humidity}%. Optimal is 50-70%.`,
        messageAm: `እርጥበት ${latestRecord.humidity}% ነው። ጥሩው 50-70% ነው።`,
        actions: [
          'Improve ventilation',
          'Change wet bedding',
          'Reduce water spills',
          'Add dehumidifier if possible',
          'አየር ማናፈሻ ያሻሽሉ',
          'እርጥብ አልጋ ይቀይሩ'
        ]
      });
    }
    
    // Financial suggestions
    if (profit < 0) {
      suggestions.push({
        type: 'financial',
        priority: 'high',
        icon: '💰',
        titleEn: 'Negative Profit Detected',
        titleAm: 'አሉታዊ ትርፍ ተገኝቷል',
        messageEn: `Your farm is operating at a loss. Total profit: ETB ${profit.toFixed(0)}.`,
        messageAm: `እርሻዎ በኪሳራ እየሰራ ነው። ጠቅላላ ትርፍ: ብር ${profit.toFixed(0)}።`,
        actions: [
          'Review pricing strategy',
          'Reduce feed costs by buying in bulk',
          'Increase egg production (see above)',
          'Find direct buyers (no middlemen)',
          'የዋጋ አሰጣጥ ስልት ይገምግሙ',
          'የመኖ ዋጋ በጅምላ በመግዛት ይቀንሱ'
        ]
      });
    } else if (profit > 0) {
      suggestions.push({
        type: 'financial',
        priority: 'low',
        icon: '📈',
        titleEn: 'Profit Analysis',
        titleAm: 'የትርፍ ትንተና',
        messageEn: `Good job! Your farm made ETB ${profit.toFixed(0)} profit. Here's how to grow:`,
        messageAm: `ጥሩ ስራ! እርሻዎ ብር ${profit.toFixed(0)} ትርፍ አግኝቷል። እንዴት ማሳደግ እንደሚችሉ እነሆ:`,
        actions: [
          'Reinvest 20% into farm expansion',
          'Save 30% for emergencies',
          'Consider adding more birds',
          'Explore value-added products (manure fertilizer)',
          '20% ወደ እርሻ መስፋፋት እንደገና ኢንቨስት ያድርጉ',
          '30% ለድንገተኛ ጊዜ ይቆጥቡ'
        ]
      });
    }
    
    // Feed efficiency
    if (avgFeedEfficiency < 0.25) {
      suggestions.push({
        type: 'feed',
        priority: 'medium',
        icon: '🌾',
        titleEn: 'Poor Feed Efficiency',
        titleAm: 'ደካማ የመኖ ብቃት',
        messageEn: `${avgFeedEfficiency.toFixed(2)} eggs per kg feed. Target is >0.3.`,
        messageAm: `በአንድ ኪሎ መኖ ${avgFeedEfficiency.toFixed(2)} እንቁላል። ጥሩው ከ0.3 በላይ ነው።`,
        actions: [
          'Switch to higher quality feed',
          'Reduce feed waste',
          'Check for rodents eating feed',
          'Add feed supplements',
          'ወደ ከፍተኛ ጥራት መኖ ይቀይሩ',
          'የመኖ ብክነት ይቀንሱ'
        ]
      });
    }
    
    // Summary
    if (suggestions.length === 0) {
      summary = language === 'en'
        ? '✅ Excellent! Your farm is performing well. Continue with current practices and monitor daily.'
        : '✅ በጣም ጥሩ! እርሻዎ በጥሩ ሁኔታ እየሰራ ነው። ወቅታዊ ልምዶችዎን ይቀጥሉ እና በየቀኑ ይከታተሉ።';
    } else {
      summary = language === 'en'
        ? `📊 AI Analysis: Found ${suggestions.length} area(s) needing attention. Review recommendations below.`
        : `📊 የኤአይ ትንተና: ${suggestions.length} ትኩረት የሚጠይቁ ቦታ(ዎች) ተገኝተዋል። ከዚህ በታች ያሉትን ምክሮች ይገምግሙ።`;
    }
    
    setAiSuggestions({ summary, suggestions });
  };

  // Save daily record and regenerate suggestions
  const handleSaveRecord = (e) => {
    e.preventDefault();
    if (!currentFarm) {
      toast.error('Please select a farm first');
      return;
    }
    
    const records = localStorage.getItem(`daily_records_${currentFarm.id}`);
    const existingRecords = records ? JSON.parse(records) : [];
    
    const newRecord = {
      id: Date.now(),
      farmId: currentFarm.id,
      ...recordForm
    };
    
    existingRecords.push(newRecord);
    localStorage.setItem(`daily_records_${currentFarm.id}`, JSON.stringify(existingRecords));
    loadDailyRecords(currentFarm.id);
    setShowRecordForm(false);
    setRecordForm({
      date: new Date().toISOString().split('T')[0],
      totalBirds: currentFarm.totalBirds,
      healthyBirds: 0,
      sickBirds: 0,
      deadBirds: 0,
      eggsCollected: 0,
      eggsSold: 0,
      eggPrice: 5,
      feedConsumed: 0,
      feedCost: 0,
      medicineCost: 0,
      otherExpenses: 0,
      temperature: 0,
      humidity: 0,
      notes: ''
    });
    
    toast.success('Daily record saved! AI suggestions updated.');
    generateAISuggestions();
  };
  
  const handleSaveFarm = (e) => {
    e.preventDefault();
    if (editingFarm) {
      const updatedFarms = farms.map(f => 
        f.id === editingFarm.id ? { ...farmForm, id: f.id, updatedAt: new Date().toISOString() } : f
      );
      saveFarms(updatedFarms);
      toast.success('Farm updated successfully!');
    } else {
      const newFarm = {
        id: Date.now(),
        ...farmForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedFarms = [...farms, newFarm];
      saveFarms(updatedFarms);
      toast.success('Farm created successfully!');
    }
    setShowFarmForm(false);
    setEditingFarm(null);
    setFarmForm({
      name: '',
      location: '',
      totalBirds: 0,
      birdType: 'Layers',
      establishedDate: '',
      phone: '',
      email: ''
    });
  };
  
  const handleSelectFarm = (farm) => {
    setCurrentFarm(farm);
    localStorage.setItem('current_farm', JSON.stringify(farm));
    loadDailyRecords(farm.id);
    setAiSuggestions(null);
  };
  
  const handleDeleteFarm = (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      const updatedFarms = farms.filter(f => f.id !== farmId);
      saveFarms(updatedFarms);
      if (currentFarm && currentFarm.id === farmId) {
        if (updatedFarms.length > 0) {
          setCurrentFarm(updatedFarms[0]);
          localStorage.setItem('current_farm', JSON.stringify(updatedFarms[0]));
          loadDailyRecords(updatedFarms[0].id);
        } else {
          setCurrentFarm(null);
          localStorage.removeItem('current_farm');
          setDailyRecords([]);
        }
      }
      toast.success('Farm deleted');
    }
  };
  
  const translations = {
    en: {
      title: "Multi-Farm Management",
      subtitle: "Manage multiple farms, track daily data, get AI suggestions",
      farms: "My Farms",
      dailyRecords: "Daily Records",
      aiInsights: "AI Insights",
      addFarm: "Add New Farm",
      addRecord: "Add Daily Record",
      farmName: "Farm Name",
      location: "Location",
      totalBirds: "Total Birds",
      birdType: "Bird Type",
      layers: "Layers",
      broilers: "Broilers",
      dualPurpose: "Dual Purpose",
      establishedDate: "Established Date",
      phone: "Phone Number",
      email: "Email",
      saveFarm: "Save Farm",
      cancel: "Cancel",
      selectFarm: "Select Farm",
      edit: "Edit",
      delete: "Delete",
      date: "Date",
      healthyBirds: "Healthy Birds",
      sickBirds: "Sick Birds",
      deadBirds: "Dead Birds",
      eggsCollected: "Eggs Collected",
      eggsSold: "Eggs Sold",
      eggPrice: "Egg Price (ETB)",
      feedConsumed: "Feed Consumed (kg)",
      feedCost: "Feed Cost (ETB)",
      medicineCost: "Medicine Cost (ETB)",
      otherExpenses: "Other Expenses",
      temperature: "Temperature (°C)",
      humidity: "Humidity (%)",
      notes: "Notes",
      saveRecord: "Save Record",
      viewDetails: "View Details",
      noFarms: "No farms yet. Create your first farm!",
      noRecords: "No daily records. Add your first record!",
      profit: "Profit/Loss",
      income: "Total Income",
      expenses: "Total Expenses",
      suggestions: "AI Suggestions",
      priority: "Priority"
    },
    am: {
      title: "የበርካታ እርሻዎች አስተዳደር",
      subtitle: "በርካታ እርሻዎችን ያስተዳድሩ፣ ዕለታዊ መረጃ ይከታተሉ፣ የኤአይ ምክሮችን ያግኙ",
      farms: "እርሻዎቼ",
      dailyRecords: "ዕለታዊ መዝገቦች",
      aiInsights: "ኤአይ ግንዛቤዎች",
      addFarm: "አዲስ እርሻ ጨምር",
      addRecord: "ዕለታዊ መዝገብ ጨምር",
      farmName: "የእርሻ ስም",
      location: "አካባቢ",
      totalBirds: "ጠቅላላ ዶሮዎች",
      birdType: "የዶሮ አይነት",
      layers: "እንቁላል",
      broilers: "ስጋ",
      dualPurpose: "ሁለት ጥቅም",
      establishedDate: "የተመሰረተበት ቀን",
      phone: "ስልክ ቁጥር",
      email: "ኢሜይል",
      saveFarm: "እርሻ አስቀምጥ",
      cancel: "ሰርዝ",
      selectFarm: "እርሻ ምረጥ",
      edit: "አርትዕ",
      delete: "ሰርዝ",
      date: "ቀን",
      healthyBirds: "ጤናማ ዶሮዎች",
      sickBirds: "የታመሙ ዶሮዎች",
      deadBirds: "የሞቱ ዶሮዎች",
      eggsCollected: "የተሰበሰቡ እንቁላሎች",
      eggsSold: "የተሸጡ እንቁላሎች",
      eggPrice: "የእንቁላል ዋጋ (ብር)",
      feedConsumed: "የበላ መኖ (ኪግ)",
      feedCost: "የመኖ ዋጋ (ብር)",
      medicineCost: "የመድሀኒት ዋጋ (ብር)",
      otherExpenses: "ሌላ ወጪ",
      temperature: "ሙቀት (ሴልሺየስ)",
      humidity: "እርጥበት (%)",
      notes: "ማስታወሻ",
      saveRecord: "መዝገብ አስቀምጥ",
      viewDetails: "ዝርዝር ተመልከት",
      noFarms: "እስካሁን እርሻ የለም። የመጀመሪያ እርሻዎን ይፍጠሩ!",
      noRecords: "ምንም ዕለታዊ መዝገቦች የሉም። የመጀመሪያ መዝገብዎን ይጨምሩ!",
      profit: "ትርፍ/ኪሳራ",
      income: "ጠቅላላ ገቢ",
      expenses: "ጠቅላላ ወጪ",
      suggestions: "የኤአይ ምክሮች",
      priority: "ቅድሚያ"
    }
  };
  
  const t = translations[language];
  
  // Calculate financial summary
  const calculateFinancials = () => {
    let totalIncome = 0;
    let totalExpenses = 0;
    dailyRecords.forEach(record => {
      totalIncome += (record.eggsSold || 0) * (record.eggPrice || 5);
      totalExpenses += (record.feedCost || 0) + (record.medicineCost || 0) + (record.otherExpenses || 0);
    });
    return { totalIncome, totalExpenses, profit: totalIncome - totalExpenses };
  };
  
  const financials = calculateFinancials();
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };
  
  return (
    <div className="farm-management-page">
      <div className="farm-container">
        <div className="farm-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        
        {/* Farm Selector Bar */}
        {farms.length > 0 && (
          <div className="farm-selector">
            <div className="selector-label">📍 {t.selectFarm}:</div>
            <div className="selector-buttons">
              {farms.map(farm => (
                <button
                  key={farm.id}
                  className={`farm-select-btn ${currentFarm?.id === farm.id ? 'active' : ''}`}
                  onClick={() => handleSelectFarm(farm)}
                >
                  {farm.name}
                  <span className="farm-badge">{farm.totalBirds} 🐔</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="add-farm-btn" onClick={() => { setShowFarmForm(true); setEditingFarm(null); setFarmForm({ name: '', location: '', totalBirds: 0, birdType: 'Layers', establishedDate: '', phone: '', email: '' }); }}>
            <i className="fas fa-plus"></i> {t.addFarm}
          </button>
          {currentFarm && (
            <button className="add-record-btn" onClick={() => setShowRecordForm(true)}>
              <i className="fas fa-pen"></i> {t.addRecord}
            </button>
          )}
        </div>
        
        {/* Farm Form Modal */}
        {showFarmForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingFarm ? 'Edit Farm' : t.addFarm}</h2>
              <form onSubmit={handleSaveFarm}>
                <div className="form-grid">
                  <input type="text" placeholder={t.farmName} value={farmForm.name} onChange={(e) => setFarmForm({...farmForm, name: e.target.value})} required />
                  <input type="text" placeholder={t.location} value={farmForm.location} onChange={(e) => setFarmForm({...farmForm, location: e.target.value})} />
                  <input type="number" placeholder={t.totalBirds} value={farmForm.totalBirds} onChange={(e) => setFarmForm({...farmForm, totalBirds: parseInt(e.target.value)})} required />
                  <select value={farmForm.birdType} onChange={(e) => setFarmForm({...farmForm, birdType: e.target.value})}>
                    <option value="Layers">{t.layers}</option>
                    <option value="Broilers">{t.broilers}</option>
                    <option value="Dual Purpose">{t.dualPurpose}</option>
                  </select>
                  <input type="date" placeholder={t.establishedDate} value={farmForm.establishedDate} onChange={(e) => setFarmForm({...farmForm, establishedDate: e.target.value})} />
                  <input type="tel" placeholder={t.phone} value={farmForm.phone} onChange={(e) => setFarmForm({...farmForm, phone: e.target.value})} />
                  <input type="email" placeholder={t.email} value={farmForm.email} onChange={(e) => setFarmForm({...farmForm, email: e.target.value})} />
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="save-btn">{t.saveFarm}</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowFarmForm(false)}>{t.cancel}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Daily Record Form Modal */}
        {showRecordForm && currentFarm && (
          <div className="modal-overlay">
            <div className="modal-content large">
              <h2>{t.addRecord} - {currentFarm.name}</h2>
              <form onSubmit={handleSaveRecord}>
                <div className="form-grid-2">
                  <input type="date" value={recordForm.date} onChange={(e) => setRecordForm({...recordForm, date: e.target.value})} required />
                  <input type="number" placeholder={t.totalBirds} value={recordForm.totalBirds} onChange={(e) => setRecordForm({...recordForm, totalBirds: parseInt(e.target.value)})} required />
                  <input type="number" placeholder={t.healthyBirds} value={recordForm.healthyBirds} onChange={(e) => setRecordForm({...recordForm, healthyBirds: parseInt(e.target.value)})} />
                  <input type="number" placeholder={t.sickBirds} value={recordForm.sickBirds} onChange={(e) => setRecordForm({...recordForm, sickBirds: parseInt(e.target.value)})} />
                  <input type="number" placeholder={t.deadBirds} value={recordForm.deadBirds} onChange={(e) => setRecordForm({...recordForm, deadBirds: parseInt(e.target.value)})} />
                  <input type="number" placeholder={t.eggsCollected} value={recordForm.eggsCollected} onChange={(e) => setRecordForm({...recordForm, eggsCollected: parseInt(e.target.value)})} />
                  <input type="number" placeholder={t.eggsSold} value={recordForm.eggsSold} onChange={(e) => setRecordForm({...recordForm, eggsSold: parseInt(e.target.value)})} />
                  <input type="number" step="0.5" placeholder={t.eggPrice} value={recordForm.eggPrice} onChange={(e) => setRecordForm({...recordForm, eggPrice: parseFloat(e.target.value)})} />
                  <input type="number" placeholder={t.feedConsumed} value={recordForm.feedConsumed} onChange={(e) => setRecordForm({...recordForm, feedConsumed: parseInt(e.target.value)})} />
                  <input type="number" placeholder={t.feedCost} value={recordForm.feedCost} onChange={(e) => setRecordForm({...recordForm, feedCost: parseInt(e.target.value)})} />
                  <input type="number" placeholder={t.medicineCost} value={recordForm.medicineCost} onChange={(e) => setRecordForm({...recordForm, medicineCost: parseInt(e.target.value)})} />
                  <input type="number" placeholder={t.otherExpenses} value={recordForm.otherExpenses} onChange={(e) => setRecordForm({...recordForm, otherExpenses: parseInt(e.target.value)})} />
                  <input type="number" step="0.1" placeholder={t.temperature} value={recordForm.temperature} onChange={(e) => setRecordForm({...recordForm, temperature: parseFloat(e.target.value)})} />
                  <input type="number" placeholder={t.humidity} value={recordForm.humidity} onChange={(e) => setRecordForm({...recordForm, humidity: parseInt(e.target.value)})} />
                  <textarea placeholder={t.notes} rows="2" value={recordForm.notes} onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})} />
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="save-btn">{t.saveRecord}</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowRecordForm(false)}>{t.cancel}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="farm-tabs">
          <button className={`farm-tab ${activeTab === 'farms' ? 'active' : ''}`} onClick={() => setActiveTab('farms')}>
            <i className="fas fa-tractor"></i> {t.farms} ({farms.length})
          </button>
          <button className={`farm-tab ${activeTab === 'records' ? 'active' : ''}`} onClick={() => { setActiveTab('records'); if (currentFarm) generateAISuggestions(); }}>
            <i className="fas fa-calendar-alt"></i> {t.dailyRecords} ({dailyRecords.length})
          </button>
          <button className={`farm-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => { setActiveTab('ai'); generateAISuggestions(); }}>
            <i className="fas fa-brain"></i> {t.aiInsights}
          </button>
        </div>
        
        {/* Farms List Tab */}
        {activeTab === 'farms' && (
          <div className="farms-list">
            {farms.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-tractor"></i>
                <p>{t.noFarms}</p>
              </div>
            ) : (
              <div className="farms-grid">
                {farms.map(farm => (
                  <div key={farm.id} className={`farm-card ${currentFarm?.id === farm.id ? 'selected' : ''}`}>
                    <div className="farm-card-header">
                      <div className="farm-icon">
                        <i className="fas fa-warehouse"></i>
                      </div>
                      <div className="farm-info">
                        <h3>{farm.name}</h3>
                        <p className="farm-location"><i className="fas fa-map-marker-alt"></i> {farm.location || 'Not specified'}</p>
                        <p className="farm-stats"><i className="fas fa-chicken"></i> {farm.totalBirds} birds</p>
                      </div>
                    </div>
                    <div className="farm-card-actions">
                      <button className="select-farm-btn" onClick={() => handleSelectFarm(farm)}>
                        <i className="fas fa-check"></i> {t.selectFarm}
                      </button>
                      <button className="edit-farm-btn" onClick={() => { setEditingFarm(farm); setFarmForm(farm); setShowFarmForm(true); }}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-farm-btn" onClick={() => handleDeleteFarm(farm.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Daily Records Tab */}
        {activeTab === 'records' && (
          <div className="records-list">
            {dailyRecords.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar-alt"></i>
                <p>{t.noRecords}</p>
              </div>
            ) : (
              <div className="records-table-container">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      <th>🐔 {t.healthyBirds}</th>
                      <th>🤒 {t.sickBirds}</th>
                      <th>💀 {t.deadBirds}</th>
                      <th>🥚 {t.eggsCollected}</th>
                      <th>💰 {t.profit}</th>
                      <th>📊</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyRecords.map(record => {
                      const profit = (record.eggsSold || 0) * (record.eggPrice || 5) - ((record.feedCost || 0) + (record.medicineCost || 0) + (record.otherExpenses || 0));
                      return (
                        <tr key={record.id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.healthyBirds || '-'}</td>
                          <td className="warning">{record.sickBirds || 0}</td>
                          <td className="danger">{record.deadBirds || 0}</td>
                          <td>{record.eggsCollected || 0}</td>
                          <td className={profit >= 0 ? 'profit' : 'loss'}>ETB {profit}</td>
                          <td>
                            <button className="view-details-btn" onClick={() => {
                              toast.success(`Record for ${new Date(record.date).toLocaleDateString()}`);
                            }}>
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Financial Summary */}
            {dailyRecords.length > 0 && (
              <div className="financial-summary">
                <h3><i className="fas fa-chart-line"></i> {t.profit}</h3>
                <div className="summary-stats">
                  <div className="summary-card">
                    <span className="summary-label">{t.income}</span>
                    <span className="summary-value income">ETB {financials.totalIncome.toFixed(0)}</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">{t.expenses}</span>
                    <span className="summary-value expense">ETB {financials.totalExpenses.toFixed(0)}</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">{t.profit}</span>
                    <span className={`summary-value ${financials.profit >= 0 ? 'profit' : 'loss'}`}>
                      ETB {financials.profit.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* AI Insights Tab */}
        {activeTab === 'ai' && (
          <div className="ai-insights">
            {aiSuggestions ? (
              <div className="ai-summary-card">
                <div className="ai-summary">
                  <i className="fas fa-robot"></i>
                  <p>{aiSuggestions.summary}</p>
                </div>
                
                {aiSuggestions.suggestions.length > 0 && (
                  <div className="ai-suggestions-list">
                    <h3><i className="fas fa-lightbulb"></i> {t.suggestions}</h3>
                    {aiSuggestions.suggestions.map((s, idx) => (
                      <div key={idx} className="suggestion-card" style={{ borderLeftColor: getPriorityColor(s.priority) }}>
                        <div className="suggestion-header">
                          <span className="suggestion-icon">{s.icon}</span>
                          <div className="suggestion-title">
                            <h4>{language === 'en' ? s.titleEn : s.titleAm}</h4>
                            <span className={`priority-badge ${s.priority}`}>{t.priority}: {s.priority.toUpperCase()}</span>
                          </div>
                        </div>
                        <p className="suggestion-message">{language === 'en' ? s.messageEn : s.messageAm}</p>
                        <div className="suggestion-actions">
                          <strong>📋 {language === 'en' ? 'Recommended Actions:' : 'የሚመከሩ እርምጃዎች:'}</strong>
                          <ul>
                            {s.actions.slice(0, 4).map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-brain"></i>
                <p>{dailyRecords.length === 0 ? 'Add daily records to get AI insights!' : 'Click AI Insights tab to generate suggestions'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmManagement;
