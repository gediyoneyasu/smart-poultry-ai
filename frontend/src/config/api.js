<<<<<<< HEAD
const API_URL = 'http://localhost:5001/api';
=======
// API Configuration - Works for both local and production
const getApiUrl = () => {
  // Production (Vercel)
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return 'https://smart-poultry-ai-backend.onrender.com/api';
  }
  // Local development
  return 'http://localhost:5001/api';
};

const API_URL = getApiUrl();
>>>>>>> ab02156fa4aab92fdc2ce2181c2e0fda42de43f9
export default API_URL;
