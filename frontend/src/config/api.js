const getApiUrl = () => {
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return 'https://YOUR_BACKEND_URL.onrender.com/api';  // Replace with your backend URL
  }
  return 'http://localhost:5001/api';
};

const API_URL = getApiUrl();
export default API_URL;