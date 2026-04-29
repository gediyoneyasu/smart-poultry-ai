import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Selam! I am your Poultry AI assistant. Ask me anything about chicken health! 🐔' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const userQuestion = input.toLowerCase();
    setInput('');
    
    setTimeout(() => {
      let reply = "For accurate diagnosis, please upload a chicken image using the image analyzer above.";
      
      if (userQuestion.includes('newcastle')) {
        reply = "Newcastle disease symptoms: greenish diarrhea, swollen eyes, nervous signs. Isolate sick birds immediately and vaccinate healthy ones.";
      } else if (userQuestion.includes('egg') || userQuestion.includes('እንቁላል')) {
        reply = "Egg drop causes: stress, high temperature, poor nutrition. Ensure proper feed with 16-18% protein and clean, cool water.";
      } else if (userQuestion.includes('vaccine') || userQuestion.includes('ክትባት')) {
        reply = "Vaccination schedule: Marek's (day 1), Newcastle (day 7 & 21), Gumboro (day 14 & 28), Fowl Pox (week 8).";
      } else if (userQuestion.includes('fever') || userQuestion.includes('temperature')) {
        reply = "Normal chicken temperature: 40-42°C (104-108°F). If temperature is above 33°C in the house, increase ventilation.";
      }
      
      setMessages(prev => [...prev, { role: 'bot', content: reply }]);
    }, 500);
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', height: '400px' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#eff6ff', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <h2 style={{ fontWeight: 'bold' }}>💬 AI Assistant</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
            <div style={{ maxWidth: '80%', padding: '8px', borderRadius: '8px', backgroundColor: msg.role === 'user' ? '#2563eb' : '#f3f4f6', color: msg.role === 'user' ? 'white' : '#1f2937', fontSize: '14px' }}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask in English or Amharic..." style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px', fontSize: '14px' }} />
        <button onClick={sendMessage} style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
