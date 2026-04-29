import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const LearningFeedback = () => {
  const [feedback, setFeedback] = useState({ wasCorrect: null, comments: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feedback.wasCorrect === null) {
      toast.error('Please tell us if AI was correct');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! This helps AI learn');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>🧠 Help AI Learn</h2>
      {!submitted ? (
        <>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Was the AI prediction correct?</p>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <button onClick={() => setFeedback({ ...feedback, wasCorrect: true })} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', backgroundColor: feedback.wasCorrect === true ? '#22c55e' : 'white', color: feedback.wasCorrect === true ? 'white' : 'black' }}>✅ Yes</button>
            <button onClick={() => setFeedback({ ...feedback, wasCorrect: false })} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', backgroundColor: feedback.wasCorrect === false ? '#ef4444' : 'white', color: feedback.wasCorrect === false ? 'white' : 'black' }}>❌ No</button>
          </div>
          <textarea rows="2" placeholder="Additional comments..." value={feedback.comments} onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px', fontSize: '14px', marginBottom: '12px' }} />
          <button onClick={handleSubmit} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Submit Feedback</button>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#22c55e' }}>✅ Feedback recorded! Model will improve.</div>
      )}
    </div>
  );
};

export default LearningFeedback;
