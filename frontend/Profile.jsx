import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const [language, setLanguage] = useState('en');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState({
    name: 'Alemitu Tadesse',
    email: 'alemitu.tadesse@example.com',
    phone: '+251 911 234 567',
    role: 'Farmer',
    farmName: 'Bishoftu Poultry Farm',
    joinDate: 'January 2024',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Experienced poultry farmer with 5+ years in commercial egg production. Passionate about using AI for better farm management.'
  });
  
  const [editForm, setEditForm] = useState(profile);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    diseasePredictions: true,
    weeklyReports: true,
    marketingEmails: false
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const translations = {
    en: {
      title: "My Profile",
      subtitle: "Manage your account settings",
      profileInfo: "Profile Information",
      accountSettings: "Account Settings",
      notificationPrefs: "Notification Preferences",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      role: "Role",
      farmName: "Farm Name",
      joinDate: "Member Since",
      bio: "Bio",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      updatePassword: "Update Password",
      emailAlerts: "Email Alerts",
      smsAlerts: "SMS Alerts",
      diseasePredictions: "Disease Predictions",
      weeklyReports: "Weekly Reports",
      marketingEmails: "Marketing Emails",
      activityLog: "Recent Activity",
      viewAll: "View All",
      noActivity: "No recent activity",
      stats: "Your Stats",
      totalDiagnosis: "Total AI Diagnoses",
      savedBirds: "Birds Saved",
      accuracyRate: "AI Accuracy Rate",
      farmsManaged: "Farms Managed"
    },
    am: {
      title: "መገለጫዬ",
      subtitle: "የአካውንት ቅንብሮችዎን ያስተዳድሩ",
      profileInfo: "የመገለጫ መረጃ",
      accountSettings: "የአካውንት ቅንብሮች",
      notificationPrefs: "የማሳወቂያ ምርጫዎች",
      editProfile: "መገለጫ አርትዕ",
      saveChanges: "ለውጦችን አስቀምጥ",
      cancel: "ሰርዝ",
      name: "ሙሉ ስም",
      email: "ኢሜይል አድራሻ",
      phone: "ስልክ ቁጥር",
      role: "ሚና",
      farmName: "የእርሻ ስም",
      joinDate: "የተቀላቀሉበት",
      bio: "የህይወት ታሪክ",
      changePassword: "የይለፍ ቃል ለውጥ",
      currentPassword: "አሁን ያለው የይለፍ ቃል",
      newPassword: "አዲስ የይለፍ ቃል",
      confirmPassword: "የይለፍ ቃል አረጋግጥ",
      updatePassword: "የይለፍ ቃል አዘምን",
      emailAlerts: "የኢሜይል ማንቂያዎች",
      smsAlerts: "የኤስኤምኤስ ማንቂያዎች",
      diseasePredictions: "የበሽታ ትንበያዎች",
      weeklyReports: "ሳምንታዊ ሪፖርቶች",
      marketingEmails: "የግብይት ኢሜይሎች",
      activityLog: "የቅርብ ጊዜ እንቅስቃሴ",
      viewAll: "ሁሉንም ይመልከቱ",
      noActivity: "ምንም የቅርብ ጊዜ እንቅስቃሴ የለም",
      stats: "የእርስዎ ስታቲስቲክስ",
      totalDiagnosis: "ጠቅላላ ኤአይ ምርመራዎች",
      savedBirds: "የተዳኑ ዶሮዎች",
      accuracyRate: "ኤአይ ትክክለኛነት መጠን",
      farmsManaged: "የሚተዳደሩ እርሻዎች"
    }
  };

  const t = translations[language];

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditing(false);
    toast.success(language === 'en' ? 'Profile updated!' : 'መገለጫ ተዘምኗል!');
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success(language === 'en' ? 'Preferences updated!' : 'ምርጫዎች ተዘምነዋል!');
  };

  const recentActivity = [
    { action: 'AI Disease Detection', detail: 'Newcastle disease detected in House B', date: '2 hours ago', icon: 'fas fa-microscope' },
    { action: 'Report Generated', detail: 'Weekly health report downloaded', date: 'Yesterday', icon: 'fas fa-chart-line' },
    { action: 'Farm Updated', detail: 'Farm profile information changed', date: '3 days ago', icon: 'fas fa-tractor' }
  ];

  const userStats = [
    { label: t.totalDiagnosis, value: '47', icon: 'fas fa-microscope', color: '#ffc107' },
    { label: t.savedBirds, value: '2,340', icon: 'fas fa-heart', color: '#10b981' },
    { label: t.accuracyRate, value: '94%', icon: 'fas fa-chart-line', color: '#3b82f6' },
    { label: t.farmsManaged, value: '1', icon: 'fas fa-tractor', color: '#8b5cf6' }
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="profile-grid">
          <div className="profile-sidebar">
            <div className="avatar-section">
              <img src={profile.avatar} alt={profile.name} className="avatar" />
              <button className="change-avatar-btn"><i className="fas fa-camera"></i></button>
            </div>
            <h3>{profile.name}</h3>
            <p className="user-role">{profile.role}</p>
            <p className="user-farm">{profile.farmName}</p>
            
            <div className="sidebar-tabs">
              <button className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                <i className="fas fa-user"></i> {t.profileInfo}
              </button>
              <button className={`sidebar-tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                <i className="fas fa-bell"></i> {t.notificationPrefs}
              </button>
              <button className={`sidebar-tab ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
                <i className="fas fa-lock"></i> {t.changePassword}
              </button>
            </div>
          </div>

          <div className="profile-main">
            <div className="stats-cards">
              {userStats.map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    <i className={stat.icon}></i>
                  </div>
                  <div className="stat-info">
                    <h4>{stat.value}</h4>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {activeTab === 'profile' && (
              <div className="profile-content">
                <div className="content-header">
                  <h2>{t.profileInfo}</h2>
                  {!isEditing && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      <i className="fas fa-edit"></i> {t.editProfile}
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="profile-info-display">
                    <div className="info-row"><label>{t.name}:</label><span>{profile.name}</span></div>
                    <div className="info-row"><label>{t.email}:</label><span>{profile.email}</span></div>
                    <div className="info-row"><label>{t.phone}:</label><span>{profile.phone}</span></div>
                    <div className="info-row"><label>{t.role}:</label><span>{profile.role}</span></div>
                    <div className="info-row"><label>{t.farmName}:</label><span>{profile.farmName}</span></div>
                    <div className="info-row"><label>{t.joinDate}:</label><span>{profile.joinDate}</span></div>
                    <div className="info-row full"><label>{t.bio}:</label><span>{profile.bio}</span></div>
                  </div>
                ) : (
                  <form className="profile-edit-form" onSubmit={handleEditSubmit}>
                    <div className="form-group"><label>{t.name}</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} /></div>
                    <div className="form-group"><label>{t.email}</label><input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} /></div>
                    <div className="form-group"><label>{t.phone}</label><input type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} /></div>
                    <div className="form-group"><label>{t.farmName}</label><input type="text" value={editForm.farmName} onChange={(e) => setEditForm({...editForm, farmName: e.target.value})} /></div>
                    <div className="form-group full"><label>{t.bio}</label><textarea rows="3" value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} /></div>
                    <div className="form-actions">
                      <button type="submit" className="save-btn"><i className="fas fa-save"></i> {t.saveChanges}</button>
                      <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>{t.cancel}</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="profile-content">
                <h2>{t.notificationPrefs}</h2>
                <div className="notifications-list">
                  <div className="notification-item">
                    <div className="notification-info"><i className="fas fa-envelope"></i><span>{t.emailAlerts}</span></div>
                    <label className="toggle-switch"><input type="checkbox" checked={notifications.emailAlerts} onChange={() => handleNotificationChange('emailAlerts')} /><span className="toggle-slider"></span></label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info"><i className="fas fa-sms"></i><span>{t.smsAlerts}</span></div>
                    <label className="toggle-switch"><input type="checkbox" checked={notifications.smsAlerts} onChange={() => handleNotificationChange('smsAlerts')} /><span className="toggle-slider"></span></label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info"><i className="fas fa-chart-line"></i><span>{t.diseasePredictions}</span></div>
                    <label className="toggle-switch"><input type="checkbox" checked={notifications.diseasePredictions} onChange={() => handleNotificationChange('diseasePredictions')} /><span className="toggle-slider"></span></label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info"><i className="fas fa-file-alt"></i><span>{t.weeklyReports}</span></div>
                    <label className="toggle-switch"><input type="checkbox" checked={notifications.weeklyReports} onChange={() => handleNotificationChange('weeklyReports')} /><span className="toggle-slider"></span></label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info"><i className="fas fa-tag"></i><span>{t.marketingEmails}</span></div>
                    <label className="toggle-switch"><input type="checkbox" checked={notifications.marketingEmails} onChange={() => handleNotificationChange('marketingEmails')} /><span className="toggle-slider"></span></label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="profile-content">
                <h2>{t.changePassword}</h2>
                <form className="password-form">
                  <div className="form-group"><label>{t.currentPassword}</label><input type="password" placeholder="Enter current password" /></div>
                  <div className="form-group"><label>{t.newPassword}</label><input type="password" placeholder="Enter new password" /></div>
                  <div className="form-group"><label>{t.confirmPassword}</label><input type="password" placeholder="Confirm new password" /></div>
                  <button type="submit" className="update-password-btn">{t.updatePassword}</button>
                </form>
              </div>
            )}

            <div className="recent-activity">
              <div className="activity-header">
                <h3><i className="fas fa-history"></i> {t.activityLog}</h3>
                <Link to="/activity" className="view-all">{t.viewAll}</Link>
              </div>
              <div className="activity-list">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="activity-item">
                    <div className="activity-icon"><i className={activity.icon}></i></div>
                    <div className="activity-details">
                      <h4>{activity.action}</h4>
                      <p>{activity.detail}</p>
                      <span>{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
