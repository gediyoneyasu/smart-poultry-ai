const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllFarms,
  getAllReports,
  getAllContacts,
  updateContactStatus,
  getDashboardStats
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(auth, isAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/farms', getAllFarms);
router.get('/reports', getAllReports);
router.get('/contacts', getAllContacts);
router.put('/contacts/:id/status', updateContactStatus);
router.get('/stats', getDashboardStats);

module.exports = router;
