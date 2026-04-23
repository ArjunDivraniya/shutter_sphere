const { pool } = require('../config/db');
async function check() {
    try {
        const res = await pool.query("SELECT id, signup_id, photographer_id, date, status, client_name FROM events WHERE date::text LIKE '2026-05-27%'");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
check();
