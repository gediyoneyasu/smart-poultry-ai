import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Farm.css';

const Farm = () => {
  const [language, setLanguage] = useState('en');
  const [farmInfo, setFarmInfo] = useState({
    farmName: 'Bishoftu Poultry Farm',
    owner: 'Alemitu Tadesse',
    location: 'Bishoftu, Oromia, Ethiopia',
    established: '2020',
    totalArea: '2.5 hectares',
    phone: '+251 911 234 567',
    email: 'info@bishoftupoultry.com'
  });
  
  const [houses, setHouses] = useState([
    { id: 1, name: 'House A', birds: 420, capacity: 500, age: 8, health: 95, vaccinated: true, lastCleaned: '2024-01-15' },
    { id: 2, name: 'House B', birds: 380, capacity: 500, age: 6, health: 82, vaccinated: false, lastCleaned: '2024-01-14' },
    { id: 3, name: 'House C', birds: 440, capacity: 500, age: 10, health: 98, vaccinated: true, lastCleaned: '2024-01-16' }
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(farmInfo);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const translations = {
    en: {
      title: "Farm Management",
      subtitle: "Manage your poultry farm operations",
      farmInfo: "Farm Information",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      farmName: "Farm Name",
      owner: "Owner",
      location: "Location",
      established: "Established",
      totalArea: "Total Area",
      phone: "Phone",
      email: "Email",
      poultryHouses: "Poultry Houses",
      houseName: "House Name",
      birds: "Birds",
      capacity: "Capacity",
      age: "Age (weeks)",
      health: "Health %",
      vaccinated: "Vaccinated",
      lastCleaned: "Last Cleaned",
      actions: "Actions",
      viewDetails: "View Details",
      addNewHouse: "Add New House",
      editHouse: "Edit House",
      deleteHouse: "Delete House",
      healthStatus: "Health Status",
      excellent: "Excellent",
      good: "Good",
      critical: "Critical",
      vaccinationStatus: "Vaccination Status",
      upToDate: "Up to Date",
      pending: "Pending",
      performance: "Farm Performance",
      averageHealth: "Average Health",
      totalBirds: "Total Birds",
      occupancyRate: "Occupancy Rate",
      mortalityRate: "Mortality Rate"
    },
    am: {
      title: "የእርሻ አስተዳደር",
      subtitle: "የዶሮ እርሻ ስራዎችን ያስተዳድሩ",
      farmInfo: "የእርሻ መረጃ",
      editProfile: "መገለጫ አርትዕ",
      saveChanges: "ለውጦችን አስቀምጥ",
      cancel: "ሰርዝ",
      farmName: "የእርሻ ስም",
      owner: "ባለቤት",
      location: "አካባቢ",
      established: "የተመሰረተበት",
      totalArea: "አጠቃላይ ስፋት",
      phone: "ስልክ",
      email: "ኢሜይል",
      poultryHouses: "የዶሮ ቤቶች",
      houseName: "የቤት ስም",
      birds: "ዶሮዎች",
      capacity: "አቅም",
      age: "ዕድሜ (ሳምንት)",
      health: "ጤና %",
      vaccinated: "ክትባት",
      lastCleaned: "የመጨረሻ ጽዳት",
      actions: "ድርጊቶች",
      viewDetails: "ዝርዝር ይመልከቱ",
      addNewHouse: "አዲስ ቤት ጨምር",
      editHouse: "ቤት አርትዕ",
      deleteHouse: "ቤት ሰርዝ",
      healthStatus: "የጤና ሁኔታ",
      excellent: "በጣም ጥሩ",
      good: "ጥሩ",
      critical: "አደገኛ",
      vaccinationStatus: "የክትባት ሁኔታ",
      upToDate: "ወቅታዊ",
      pending: "በመጠባበቅ ላይ",
      performance: "የእርሻ አፈጻጸም",
      averageHealth: "አማካይ ጤና",
      totalBirds: "ጠቅላላ ዶሮዎች",
      occupancyRate: "የመጠን መጠን",
      mortalityRate: "የሞት መጠን"
    }
  };

  const t = translations[language];

  const getHealthColor = (health) => {
    if (health >= 90) return '#10b981';
    if (health >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthText = (health) => {
    if (health >= 90) return t.excellent;
    if (health >= 70) return t.good;
    return t.critical;
  };

  const totalBirds = houses.reduce((sum, house) => sum + house.birds, 0);
  const totalCapacity = houses.reduce((sum, house) => sum + house.capacity, 0);
  const avgHealth = (houses.reduce((sum, house) => sum + house.health, 0) / houses.length).toFixed(1);
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFarmInfo(editForm);
    setIsEditing(false);
    toast.success(language === 'en' ? 'Farm info updated!' : 'የእርሻ መረጃ ተዘምኗል!');
  };

  return (
    <div className="farm-page">
      <div className="farm-container">
        <div className="farm-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Farm Performance Stats */}
        <div className="performance-stats">
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-info">
              <h3>{t.averageHealth}</h3>
              <p className="stat-value" style={{ color: getHealthColor(avgHealth) }}>{avgHealth}%</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🐔</div>
            <div className="stat-info">
              <h3>{t.totalBirds}</h3>
              <p className="stat-value">{totalBirds}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{t.occupancyRate}</h3>
              <p className="stat-value">{((totalBirds / totalCapacity) * 100).toFixed(0)}%</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>{t.mortalityRate}</h3>
              <p className="stat-value">3.2%</p>
            </div>
          </div>
        </div>

        {/* Farm Information Section */}
        <div className="farm-info-section">
          <div className="section-header">
            <h2>{t.farmInfo}</h2>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <i className="fas fa-edit"></i> {t.editProfile}
            </button>
          </div>
          
          {!isEditing ? (
            <div className="farm-info-grid">
              <div className="info-item"><label>{t.farmName}:</label><span>{farmInfo.farmName}</span></div>
              <div className="info-item"><label>{t.owner}:</label><span>{farmInfo.owner}</span></div>
              <div className="info-item"><label>{t.location}:</label><span>{farmInfo.location}</span></div>
              <div className="info-item"><label>{t.established}:</label><span>{farmInfo.established}</span></div>
              <div className="info-item"><label>{t.totalArea}:</label><span>{farmInfo.totalArea}</span></div>
              <div className="info-item"><label>{t.phone}:</label><span>{farmInfo.phone}</span></div>
              <div className="info-item"><label>{t.email}:</label><span>{farmInfo.email}</span></div>
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleEditSubmit}>
              <div className="form-grid">
                <input type="text" value={editForm.farmName} onChange={(e) => setEditForm({...editForm, farmName: e.target.value})} placeholder={t.farmName} />
                <input type="text" value={editForm.owner} onChange={(e) => setEditForm({...editForm, owner: e.target.value})} placeholder={t.owner} />
                <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder={t.location} />
                <input type="text" value={editForm.established} onChange={(e) => setEditForm({...editForm, established: e.target.value})} placeholder={t.established} />
                <input type="text" value={editForm.totalArea} onChange={(e) => setEditForm({...editForm, totalArea: e.target.value})} placeholder={t.totalArea} />
                <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder={t.phone} />
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} placeholder={t.email} />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn"><i className="fas fa-save"></i> {t.saveChanges}</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>{t.cancel}</button>
              </div>
            </form>
          )}
        </div>

        {/* Poultry Houses Section */}
        <div className="houses-section">
          <div className="section-header">
            <h2>{t.poultryHouses}</h2>
            <button className="add-btn"><i className="fas fa-plus"></i> {t.addNewHouse}</button>
          </div>
          
          <div className="houses-grid">
            {houses.map(house => (
              <div key={house.id} className="house-card">
                <div className="house-header">
                  <h3>{house.name}</h3>
                  <div className="house-actions">
                    <button className="icon-btn edit"><i className="fas fa-edit"></i></button>
                    <button className="icon-btn delete"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
                <div className="house-stats">
                  <div className="stat"><span>🐔 {t.birds}:</span> <strong>{house.birds}/{house.capacity}</strong></div>
                  <div className="stat"><span>📅 {t.age}:</span> <strong>{house.age} weeks</strong></div>
                  <div className="stat"><span>💉 {t.vaccinated}:</span> <strong className={house.vaccinated ? 'success' : 'warning'}>{house.vaccinated ? t.upToDate : t.pending}</strong></div>
                  <div className="stat"><span>🧹 {t.lastCleaned}:</span> <strong>{house.lastCleaned}</strong></div>
                </div>
                <div className="health-bar">
                  <div className="health-fill" style={{ width: `${house.health}%`, backgroundColor: getHealthColor(house.health) }}></div>
                  <span className="health-text">{getHealthText(house.health)} ({house.health}%)</span>
                </div>
                <Link to={`/house/${house.id}`} className="view-details">{t.viewDetails} <i className="fas fa-arrow-right"></i></Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Farm;
