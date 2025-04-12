// src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');


// Only admins should be allowed to create, update, or delete categories.
// For simplicity, we'll assume that the authMiddleware provides req.user with an is_admin flag.
// In production, add a separate middleware to check for admin privileges.

const adminOnly = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authMiddleware, adminOnly, categoryController.createCategory);
router.patch('/:id', authMiddleware, adminOnly, categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminOnly, categoryController.deleteCategory);

module.exports = router;
