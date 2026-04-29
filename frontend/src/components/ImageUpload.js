import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ImageUpload = ({ setPredictions, setLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [temp, setTemp] = useState('34.5');
  const [humidity, setHumidity] = useState('72');
  const [birdAge, setBirdAge] = useState('6');
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('temperature', temp);
    formData.append('humidity', humidity);
    formData.append('birdAge', birdAge);

    try {
      const response = await axios.post('http://localhost:5000/api/disease/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPredictions(response.data);
      toast.success('Analysis complete!');
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>📸 Upload Chicken Image</h2>
      
      <div 
        style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}
        onClick={() => fileInputRef.current.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" style={{ maxHeight: '192px', margin: '0 auto', borderRadius: '8px' }} />
        ) : (
          <div>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
            <p style={{ color: '#6b7280' }}>Click to upload chicken image</p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
      </div>
      
      {selectedImage && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
            <input type="number" placeholder="Temp °C" value={temp} onChange={(e) => setTemp(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px', fontSize: '14px' }} />
            <input type="number" placeholder="Humidity %" value={humidity} onChange={(e) => setHumidity(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px', fontSize: '14px' }} />
            <input type="number" placeholder="Age (weeks)" value={birdAge} onChange={(e) => setBirdAge(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px', fontSize: '14px' }} />
          </div>
          <button onClick={handleUpload} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Analyze Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
