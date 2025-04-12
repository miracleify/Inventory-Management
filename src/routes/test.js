const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/test-db-connection', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'DB connection successful', time: result.rows[0].now });
    } catch (err) {
        console.error('❌ DB connection failed:', err);
        res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
});

module.exports = router;
