// src/routes/salesRoutes.js

const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Define endpoints for sales operations
router.get('/', salesController.getAllSales);
router.get('/:id', salesController.getSaleById);
router.post('/', salesController.createSale);
router.put('/:id', salesController.updateSale);
router.delete('/:id', salesController.deleteSale);

module.exports = router;
