const express = require('express');
const router = express.Router();
router.post('/data', (req, res) => res.json({ message: 'Sensor data received' }));
module.exports = router;
