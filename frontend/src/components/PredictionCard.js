import React from 'react';

const PredictionCard = ({ predictions, loading }) => {
  if (loading) {
    return (
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ height: '4px', backgroundColor: '#e5e7eb', width: '50%', marginBottom: '16px' }}></div>
        <div style={{ height: '128px', backgroundColor: '#e5e7eb', marginBottom: '16px' }}></div>
        <p>Analyzing image...</p>
      </div>
    );
  }

  if (!predictions) {
    return (
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', color: '#9ca3af' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🤖</div>
        <p>Upload an image to see AI predictions</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>🔮 AI Analysis Result</h2>
      
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
        <p style={{ fontWeight: 'bold', color: '#dc2626' }}>Detected: {predictions.disease}</p>
        <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px', marginTop: '8px' }}>
          <div style={{ width: `${predictions.confidence}%`, backgroundColor: '#ef4444', height: '8px', borderRadius: '4px' }}></div>
        </div>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Confidence: {predictions.confidence}%</p>
      </div>

      {predictions.symptoms && predictions.symptoms.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Symptoms detected:</p>
          <ul style={{ fontSize: '14px', color: '#4b5563', marginLeft: '20px' }}>
            {predictions.symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Recommendations:</p>
        <ul style={{ fontSize: '14px', color: '#4b5563', marginLeft: '20px' }}>
          {predictions.recommendations && predictions.recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      {predictions.requiresVet && (
        <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#fef3c7', borderRadius: '8px', textAlign: 'center', fontSize: '14px' }}>
          📞 Recommended: Contact a veterinarian
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
