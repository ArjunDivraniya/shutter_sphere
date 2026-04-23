const { pool } = require('../config/db');
async function check() {
  try {
    console.log("Checking availability_blocks:");
    const res1 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'availability_blocks'");
    console.log(JSON.stringify(res1.rows, null, 2));

    console.log("\nChecking recurring_schedule:");
    const res2 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'recurring_schedule'");
    console.log(JSON.stringify(res2.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
check();
