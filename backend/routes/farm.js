const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Farm = require('../models/Farm');
const PoultryHouse = require('../models/PoultryHouse');

// Get user's farm
router.get('/my-farm', auth, async (req, res) => {
  try {
    let farm = await Farm.findOne({ farmerId: req.user.id });
    if (!farm) {
      farm = new Farm({ farmerId: req.user.id, farmName: 'My Farm' });
      await farm.save();
    }
    res.json(farm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update farm
router.put('/my-farm', auth, async (req, res) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { farmerId: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(farm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all houses for user's farm
router.get('/houses', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({ farmerId: req.user.id });
    if (!farm) return res.json([]);
    const houses = await PoultryHouse.find({ farmId: farm._id });
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update house
router.post('/houses', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({ farmerId: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    const house = new PoultryHouse({ ...req.body, farmId: farm._id });
    await house.save();
    res.status(201).json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update house
router.put('/houses/:id', auth, async (req, res) => {
  try {
    const house = await PoultryHouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete house
router.delete('/houses/:id', auth, async (req, res) => {
  try {
    await PoultryHouse.findByIdAndDelete(req.params.id);
    res.json({ message: 'House deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
