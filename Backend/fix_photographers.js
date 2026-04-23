const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:@Arjun_2801@db.gjwmdpredjpezfdkxwwe.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function fix() {
  try {
    // 1. Set all existing photographers to complete and active
    await pool.query(`
      UPDATE photographers 
      SET profile_complete = true, 
          is_active = true;
    `);
    
    // 2. Ensure price_per_hour is reasonable
    await pool.query(`
      UPDATE photographers 
      SET price_per_hour = 1200 
      WHERE price_per_hour IS NULL OR price_per_hour = 0;
    `);

    // 3. Ensure they have some categories
    await pool.query(`
      UPDATE photographers 
      SET categories = '{"Wedding", "Portrait", "Events"}'::TEXT[]
      WHERE categories IS NULL;
    `);

    console.log("Database photographers updated for visibility (simplified).");
  } catch (e) {
    console.error("Fix failed:", e);
  }
  process.exit();
}
fix();
