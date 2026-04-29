import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';
import PredictionCard from '../components/PredictionCard';
import Chatbot from '../components/Chatbot';
import LearningFeedback from '../components/LearningFeedback';

const Dashboard = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);

  const farmData = {
    totalBirds: 1240,
    healthy: 1180,
    sick: 48,
    dead: 12
  };

  const sensorData = {
    houseA: { temp: 31.2, humidity: 68 },
    houseB: { temp: 34.5, humidity: 72 },
    houseC: { temp: 29.8, humidity: 55 }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🐔 Smart Poultry AI</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Bishoftu Poultry Farm | Farmer: Alemitu Tadesse</p>
          </div>
          <div>
            <span style={{ padding: '4px 12px', backgroundColor: '#d1fae5', borderRadius: '999px', fontSize: '14px' }}>Online</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🐔</span>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Total Birds</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{farmData.totalBirds}</p>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>❤️</span>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Healthy</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{farmData.healthy}</p>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🤒</span>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Sick</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{farmData.sick}</p>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>💀</span>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Dead (24h)</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{farmData.dead}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(sensorData).map(([house, data]) => (
            <div key={house} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: data.temp > 33 ? '4px solid #ef4444' : 'none' }}>
              <h3 style={{ fontWeight: 'bold' }}>House {house}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span>🌡️ {data.temp}°C</span>
                <span>💧 {data.humidity}%</span>
              </div>
              {data.temp > 33 && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px' }}>⚠️ High temperature risk</p>}
            </div>
          ))}
        </div>

        {/* AI Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <ImageUpload setPredictions={setPredictions} setLoading={setLoading} />
          <PredictionCard predictions={predictions} loading={loading} />
        </div>

        {/* Chatbot & Feedback */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '24px' }}>
          <Chatbot />
          <LearningFeedback />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
