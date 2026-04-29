const express = require('express');
const router = express.Router();
router.post('/message', (req, res) => res.json({ reply: 'How can I help with your poultry farm?' }));
module.exports = router;
