import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SmartDashboard from './pages/SmartDashboard';
import Diseases from './pages/Diseases';
import UnifiedFarm from './pages/UnifiedFarm';
import Reports from './pages/Reports';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import HouseDetails from './pages/HouseDetails';
import Admin from './pages/Admin';

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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/diseases" element={<Diseases />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><SmartDashboard /></ProtectedRoute>} />
          <Route path="/analyze" element={<ProtectedRoute><SmartDashboard /></ProtectedRoute>} />
          <Route path="/farm" element={<ProtectedRoute><UnifiedFarm /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/house/:id" element={<ProtectedRoute><HouseDetails /></ProtectedRoute>} />

          {/* Admin Only Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
