const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  ssl: false,  // Disable SSL for the connection
});

// Initialize tables flag to prevent running it multiple times
let tablesInitialized = false;

// Log the connection success
pool.on('connect', () => {
  console.log('✅ Connected to the PostgreSQL database');
  if (!tablesInitialized) {
    initializeTables().then(() => {
      tablesInitialized = true;
    });
  }
});

// Function to execute SQL queries
const executeQuery = async (query, values = []) => {
  try {
    const result = await pool.query(query, values);
    return result;
  } catch (err) {
    if (err.code === '23505' || err.code === '42P07') {
      console.warn(`Warning: Already exists - ignoring: ${err.detail || err.message}`);
    } else {
      throw err;
    }
  }
};

// Function to initialize tables (only called once)
const initializeTables = async () => {
  try {
    await executeQuery(`CREATE TABLE IF NOT EXISTS public.users (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password TEXT NOT NULL, is_admin BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());`);
    console.log('✅ "users" table ensured.');

    await executeQuery(`CREATE TABLE IF NOT EXISTS public.categories (id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL, description TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());`);
    console.log('✅ "categories" table ensured.');

    await executeQuery(`CREATE TABLE IF NOT EXISTS public.products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT, price NUMERIC(10,2) NOT NULL, stock_quantity INT DEFAULT 0, category_id INT REFERENCES public.categories(id), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());`);
    console.log('✅ "products" table ensured.');

    await executeQuery(`CREATE TABLE IF NOT EXISTS public.sales (id SERIAL PRIMARY KEY, product_id INT REFERENCES public.products(id), quantity INT NOT NULL, total_price NUMERIC(10,2), sale_date TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());`);
    console.log('✅ "sales" table ensured.');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  }
};

// Export the pool and initialization function
module.exports = {
  pool,
  initializeTables,
};
