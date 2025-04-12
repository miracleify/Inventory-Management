// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Example of a protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

module.exports = router;
