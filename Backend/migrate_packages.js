const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:@Arjun_2801@db.gjwmdpredjpezfdkxwwe.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE photographer_packages 
      ADD COLUMN IF NOT EXISTS duration_hrs DECIMAL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS edited_photos INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS raw_files BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS max_revisions INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS travel_included BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS add_ons JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
    `);
    console.log("photographer_packages table migrated successfully.");
  } catch (e) {
    console.error("Migration failed:", e);
  }
  process.exit();
}
migrate();
