const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../../config/database');  // Correct import of pool
const sendEmail = require('../utils/emailService');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, password, email, is_admin } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required' });
  }

  try {
    // Check if user exists by username or email
    const userQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    const userResult = await pool.query(userQuery, [username, email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertQuery = `
      INSERT INTO users (username, email, password, is_admin)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, is_admin
    `;
    const insertResult = await pool.query(insertQuery, [username, email, hashedPassword, is_admin || false]);

    // Optionally send a welcome email
    try {
      await sendEmail(email, 'Welcome to Inventory Management System', 'Thank you for registering!');
    } catch (err) {
      console.error('Email sending failed:', err);
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: insertResult.rows[0],
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve user from the database
    const userQuery = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(userQuery, [username]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = result.rows[0];

    // Compare provided password with stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
