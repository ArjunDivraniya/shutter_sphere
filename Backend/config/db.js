const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false,
});

const initDatabase = async () => {
  try {
    await pool.query("SELECT 1");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) UNIQUE NOT NULL,
        password TEXT,
        role VARCHAR(30) NOT NULL CHECK (role IN ('client', 'photographer')),
        profile_photo TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS photographers (
        id SERIAL PRIMARY KEY,
        signup_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        full_name VARCHAR(120),
        email VARCHAR(190) UNIQUE,
        phone_number VARCHAR(30),
        address TEXT,
        city VARCHAR(120),
        specialization VARCHAR(120),
        experience VARCHAR(120),
        portfolio_links TEXT,
        budget_range VARCHAR(120),
        availability BOOLEAN DEFAULT true,
        languages_spoken TEXT,
        equipment_used TEXT,
        reviews TEXT,
        rating NUMERIC(2,1) DEFAULT 5,
        price_per_hour NUMERIC(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS categories TEXT DEFAULT '';`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        signup_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(120),
        email VARCHAR(190),
        phone_number VARCHAR(30),
        profile_picture TEXT,
        city VARCHAR(120),
        state VARCHAR(120),
        country VARCHAR(120),
        photographer_type VARCHAR(120),
        budget_range VARCHAR(120),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        role VARCHAR(30) NOT NULL,
        review TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
        client_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        photographer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        profile_photo TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        signup_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(180) NOT NULL,
        date TIMESTAMP NOT NULL,
        description TEXT,
        location VARCHAR(180),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Keep schema backward-compatible for existing databases.
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Pending';`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS photographer_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS client_name VARCHAR(180);`);

    console.log("PostgreSQL Connected");
  } catch (error) {
    console.error("PostgreSQL Connection Failed", error);
    process.exit(1);
  }
};

module.exports = { pool, initDatabase };