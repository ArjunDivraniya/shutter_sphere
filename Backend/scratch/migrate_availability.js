const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:@Arjun_2801@db.gjwmdpredjpezfdkxwwe.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('availability_blocks', 'recurring_schedule');
    `);
    console.log("Existing Tables:", res.rows);

    if (res.rows.length < 2) {
      console.log("Creating tables...");
      
      // Availability Blocks
      await pool.query(`
        CREATE TABLE IF NOT EXISTS availability_blocks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          photographer_id UUID NOT NULL,
          date DATE NOT NULL,
          start_time TIME,
          end_time TIME,
          status TEXT CHECK (status IN ('available', 'blocked', 'booked')) DEFAULT 'blocked',
          booking_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(photographer_id, date)
        );
      `);

      // Recurring Schedule
      await pool.query(`
        CREATE TABLE IF NOT EXISTS recurring_schedule (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          photographer_id UUID NOT NULL,
          day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
          start_time TIME DEFAULT '09:00',
          end_time TIME DEFAULT '18:00',
          is_active BOOLEAN DEFAULT true,
          UNIQUE(photographer_id, day_of_week)
        );
      `);

      // Seed some recurring schedule if needed? No, let's leave it to the UI.
      console.log("Tables created successfully.");
    }
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
}

run();
