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

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS photographers (
        id SERIAL PRIMARY KEY,
        signup_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
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
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS studio_name VARCHAR(255);`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS state VARCHAR(120);`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS lat DECIMAL(10,7);`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS lng DECIMAL(10,7);`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0;`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS languages TEXT DEFAULT '';`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(3,2) DEFAULT 5.0;`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`);
    await pool.query(`ALTER TABLE photographers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
    
    // Ensure signup_id is UNIQUE
    try {
        await pool.query(`ALTER TABLE photographers ADD CONSTRAINT photographers_signup_id_key UNIQUE (signup_id);`);
    } catch (e) {
        // Ignore if constraint already exists
    }

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
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type VARCHAR(80);`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS package_name VARCHAR(120);`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2) DEFAULT 0;`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_name VARCHAR(180);`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_address TEXT;`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS special_requests TEXT;`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        language VARCHAR(40) DEFAULT 'English',
        timezone VARCHAR(80) DEFAULT 'Asia/Kolkata',
        dark_mode BOOLEAN DEFAULT true,
        two_factor_auth BOOLEAN DEFAULT false,
        notify_bookings BOOLEAN DEFAULT true,
        notify_payouts BOOLEAN DEFAULT true,
        notify_chat BOOLEAN DEFAULT true,
        auto_reply BOOLEAN DEFAULT false,
        payout_method VARCHAR(80) DEFAULT 'Bank Transfer',
        gst_number VARCHAR(40) DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_threads (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_participants (
        id SERIAL PRIMARY KEY,
        thread_id INTEGER REFERENCES chat_threads(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(thread_id, user_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        thread_id INTEGER REFERENCES chat_threads(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        revoked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_verification_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_profiles (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(255),
        phone VARCHAR(50),
        avatar_url TEXT,
        bio TEXT,
        city VARCHAR(255),
        state VARCHAR(255),
        lat DECIMAL(10,7),
        lng DECIMAL(10,7),
        profile_complete BOOLEAN DEFAULT false,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS photographer_portfolio (
        id SERIAL PRIMARY KEY,
        photographer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        caption TEXT,
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS photographer_packages (
        id SERIAL PRIMARY KEY,
        photographer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        duration VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS photographer_achievements (
        id SERIAL PRIMARY KEY,
        photographer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        year VARCHAR(20),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS availability_blocks (
        id SERIAL PRIMARY KEY,
        photographer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        blocked_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'booked', -- 'booked' or 'blocked'
        reason TEXT,
        booking_id INTEGER,
        start_time TIME,
        end_time TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(photographer_id, blocked_date)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS recurring_schedule (
        id SERIAL PRIMARY KEY,
        photographer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        day_of_week INTEGER NOT NULL, -- 0 (Sun) to 6 (Sat)
        start_time TIME,
        end_time TIME,
        is_active BOOLEAN DEFAULT false,
        UNIQUE(photographer_id, day_of_week)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        photographer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        package_id INTEGER REFERENCES photographer_packages(id) ON DELETE SET NULL,
        event_date DATE NOT NULL,
        event_start_time TIME NOT NULL,
        event_location TEXT,
        event_lat DECIMAL(10, 7),
        event_lng DECIMAL(10, 7),
        event_type VARCHAR(100),
        description TEXT,
        special_requirements TEXT,
        reference_photos TEXT[],
        selected_addons JSONB DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'
        total_price INTEGER,
        photographer_note TEXT,
        is_custom_request BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmed_at TIMESTAMP,
        completed_at TIMESTAMP
      );
    `);

    console.log("PostgreSQL Connected");
  } catch (error) {
    console.error("PostgreSQL Connection Failed", error);
    process.exit(1);
  }
};

module.exports = { pool, initDatabase };