const { pool } = require('../config/db');
async function fix() {
  try {
    console.log("Fixing availability_blocks...");
    await pool.query(`ALTER TABLE availability_blocks ADD COLUMN IF NOT EXISTS booking_id INTEGER;`);
    await pool.query(`ALTER TABLE availability_blocks ADD COLUMN IF NOT EXISTS start_time TIME;`);
    await pool.query(`ALTER TABLE availability_blocks ADD COLUMN IF NOT EXISTS end_time TIME;`);
    
    console.log("Fixing recurring_schedule...");
    // Drop the old one with UUID types
    await pool.query(`DROP TABLE IF EXISTS recurring_schedule;`);
    await pool.query(`
      CREATE TABLE recurring_schedule (
        id SERIAL PRIMARY KEY,
        photographer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        day_of_week INTEGER NOT NULL, -- 0 (Sun) to 6 (Sat)
        start_time TIME,
        end_time TIME,
        is_active BOOLEAN DEFAULT false,
        UNIQUE(photographer_id, day_of_week)
      );
    `);
    
    console.log("Database schema fixed successfully!");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
fix();
