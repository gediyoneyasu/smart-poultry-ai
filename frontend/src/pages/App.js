import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Diseases from './pages/Diseases';
import Farm from './pages/Farm';
import Reports from './pages/Reports';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

// Import Font Awesome
const loadFontAwesome = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(link);
};
loadFontAwesome();

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Dashboard />} />
          <Route path="/diseases" element={<Diseases />} />
          <Route path="/farm" element={<Farm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
