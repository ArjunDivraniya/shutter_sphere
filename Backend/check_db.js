const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:@Arjun_2801@db.gjwmdpredjpezfdkxwwe.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'photographers';
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  }
  process.exit();
}
check();
