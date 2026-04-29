const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/submit', async (req, res) => {
  console.log('📝 Contact form submission received:', req.body);
  
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, subject, and message' 
      });
    }
    
    const contact = new Contact({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'unread'
    });
    
    await contact.save();
    console.log('✅ Contact saved successfully:', contact._id);
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      data: contact 
    });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message',
      error: error.message 
    });
  }
});

// Get all contacts (admin only - protected by admin route)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
