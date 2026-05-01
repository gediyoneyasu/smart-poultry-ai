import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from "../config/api";
import './Profile.css';

const Profile = () => {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  
  const { user, updateUser, token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
    role: '',
    profilePicture: '',
    createdAt: ''
  });
  
  const [editForm, setEditForm] = useState({});
  const [stats, setStats] = useState({ farms: 0, dailyRecords: 0 });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    diseasePredictions: true
  });

  // Load user stats
  const loadUserStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  // Save notification settings
  const saveNotificationSettings = async (newSettings) => {
    try {
      await axios.put(`${API_URL}/auth/notifications`, newSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notification settings saved');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save settings');
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    
    if (!user && !token) {
      navigate('/auth');
      return;
    }
    
    if (token) {
      loadUserProfile();
      loadUserStats();
    }
  }, [user, token, navigate]);

  const loadUserProfile = async () => {
    console.log('Loading profile with token:', token ? 'exists' : 'missing');
    
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setEditForm(response.data);
      
      if (response.data.notificationPreferences) {
        setNotifications(response.data.notificationPreferences);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      console.error('Status:', error.response?.status);
      console.error('Message:', error.response?.data?.message);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/auth');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load profile');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post(`${API_URL}/auth/upload-profile-pic`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setProfile({ ...profile, profilePicture: response.data.profilePicture });
        if (updateUser) {
          updateUser({ ...user, profilePicture: response.data.profilePicture });
        }
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Remove your profile picture?')) return;
    
    try {
      await axios.delete(`${API_URL}/auth/delete-profile-pic`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile({ ...profile, profilePicture: '' });
      if (updateUser) {
        updateUser({ ...user, profilePicture: '' });
      }
      toast.success('Profile picture removed');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(response.data);
      if (updateUser) {
        updateUser({ ...user, ...response.data });
      }
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: "My Profile",
      subtitle: "Manage your account and farm settings",
      profileInfo: "Profile Information",
      notificationPrefs: "Notification Preferences",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      role: "Role",
      bio: "Bio",
      address: "Address",
      memberSince: "Member Since",
      changePhoto: "Change Photo",
      removePhoto: "Remove Photo",
      uploadPhoto: "Click to upload photo",
      emailAlerts: "Email Alerts",
      smsAlerts: "SMS Alerts",
      diseasePredictions: "Disease Predictions",
      stats: "Your Stats",
      totalFarms: "Total Farms",
      totalRecords: "Total Records",
      joinDate: "Join Date"
    },
    am: {
      title: "መገለጫዬ",
      subtitle: "መለያዎን እና የእርሻ ቅንብሮችዎን ያስተዳድሩ",
      profileInfo: "የመገለጫ መረጃ",
      notificationPrefs: "የማሳወቂያ ምርጫዎች",
      editProfile: "መገለጫ አርትዕ",
      saveChanges: "ለውጦችን አስቀምጥ",
      cancel: "ሰርዝ",
      name: "ሙሉ ስም",
      email: "ኢሜይል",
      phone: "ስልክ ቁጥር",
      role: "ሚና",
      bio: "ስለኔ",
      address: "አድራሻ",
      memberSince: "አባል የሆንኩበት",
      changePhoto: "ፎቶ ለውጥ",
      removePhoto: "ፎቶ አስወግድ",
      uploadPhoto: "ፎቶ ለመስቀል ጠቅ ያድርጉ",
      emailAlerts: "የኢሜይል ማንቂያዎች",
      smsAlerts: "የኤስኤምኤስ ማንቂያዎች",
      diseasePredictions: "የበሽታ ትንበያዎች",
      stats: "የእርስዎ ስታቲስቲክስ",
      totalFarms: "ጠቅላላ እርሻዎች",
      totalRecords: "ጠቅላላ መዝገቦች",
      joinDate: "የተቀላቀሉበት"
    }
  };

  const t = translations[language];

  if (!user) {
    return (
      <div className="profile-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-enhanced">
      <div className="profile-container-enhanced">
        <div className="profile-header-enhanced">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="profile-grid-enhanced">
          {/* Sidebar */}
          <div className="profile-sidebar-enhanced">
            <div className="avatar-section-enhanced">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.name} className="avatar-enhanced" />
              ) : (
                <div className="avatar-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
              {uploading && <div className="upload-overlay"><i className="fas fa-spinner fa-spin"></i></div>}
              <div className="avatar-buttons">
                <button className="change-avatar-btn" onClick={() => fileInputRef.current.click()} title={t.changePhoto}>
                  <i className="fas fa-camera"></i>
                </button>
                {profile.profilePicture && (
                  <button className="remove-avatar-btn" onClick={handleDeleteImage} title={t.removePhoto}>
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} hidden />
            </div>
            <h3>{profile.name || user.name}</h3>
            <p className="user-role-enhanced">{profile.role || user.role}</p>
            
            <div className="sidebar-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.farms || 0}</span>
                <span className="stat-label">{t.totalFarms}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.dailyRecords || 0}</span>
                <span className="stat-label">{t.totalRecords}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{new Date(profile.createdAt || user.createdAt).toLocaleDateString()}</span>
                <span className="stat-label">{t.joinDate}</span>
              </div>
            </div>
            
            <div className="sidebar-tabs-enhanced">
              <button className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                <i className="fas fa-user"></i> {t.profileInfo}
              </button>
              <button className={`sidebar-tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                <i className="fas fa-bell"></i> {t.notificationPrefs}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-main-enhanced">
            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div className="profile-content-enhanced">
                <div className="content-header">
                  <h2>{t.profileInfo}</h2>
                  {!isEditing && (
                    <button className="edit-btn-enhanced" onClick={() => setIsEditing(true)}>
                      <i className="fas fa-edit"></i> {t.editProfile}
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="profile-info-display-enhanced">
                    <div className="info-row"><label>{t.name}:</label><span>{profile.name || user.name}</span></div>
                    <div className="info-row"><label>{t.email}:</label><span>{profile.email || user.email}</span></div>
                    <div className="info-row"><label>{t.phone}:</label><span>{profile.phone || 'Not set'}</span></div>
                    <div className="info-row"><label>{t.role}:</label><span>{profile.role || user.role}</span></div>
                    <div className="info-row"><label>{t.address}:</label><span>{profile.address || 'Not set'}</span></div>
                    <div className="info-row full"><label>{t.bio}:</label><span>{profile.bio || 'No bio added yet'}</span></div>
                    <div className="info-row"><label>{t.memberSince}:</label><span>{new Date(profile.createdAt || user.createdAt).toLocaleDateString()}</span></div>
                  </div>
                ) : (
                  <form className="profile-edit-form-enhanced" onSubmit={handleUpdateProfile}>
                    <div className="form-group"><label>{t.name}</label><input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} /></div>
                    <div className="form-group"><label>{t.phone}</label><input type="tel" value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} /></div>
                    <div className="form-group"><label>{t.address}</label><input type="text" value={editForm.address || ''} onChange={(e) => setEditForm({...editForm, address: e.target.value})} /></div>
                    <div className="form-group full"><label>{t.bio}</label><textarea rows="3" value={editForm.bio || ''} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} /></div>
                    <div className="form-actions">
                      <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : t.saveChanges}</button>
                      <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>{t.cancel}</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="profile-content-enhanced">
                <h2>{t.notificationPrefs}</h2>
                <div className="notifications-list-enhanced">
                  <div className="notification-item">
                    <div className="notification-info"><i className="fas fa-envelope"></i><span>{t.emailAlerts}</span></div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.emailAlerts} 
                        onChange={() => {
                          const newSettings = { ...notifications, emailAlerts: !notifications.emailAlerts };
                          setNotifications(newSettings);
                          saveNotificationSettings(newSettings);
                        }} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info"><i className="fas fa-sms"></i><span>{t.smsAlerts}</span></div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.smsAlerts} 
                        onChange={() => {
                          const newSettings = { ...notifications, smsAlerts: !notifications.smsAlerts };
                          setNotifications(newSettings);
                          saveNotificationSettings(newSettings);
                        }} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info"><i className="fas fa-chart-line"></i><span>{t.diseasePredictions}</span></div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.diseasePredictions} 
                        onChange={() => {
                          const newSettings = { ...notifications, diseasePredictions: !notifications.diseasePredictions };
                          setNotifications(newSettings);
                          saveNotificationSettings(newSettings);
                        }} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;