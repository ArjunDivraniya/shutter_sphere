const { pool } = require('../config/db');

exports.getAvailability = async (req, res) => {
    const { signupId } = req.query;
    const { month } = req.query; // Format: YYYY-MM

    if (!signupId || !month) {
        return res.status(400).json({ message: "Missing signupId or month" });
    }

    try {
        const [year, monthNum] = month.split('-').map(Number);
        const startDate = `${month}-01`;
        const lastDay = new Date(Date.UTC(year, monthNum, 0));
        const endDate = lastDay.toISOString().split('T')[0];

        // 1. Fetch manual blocks
        const blocksRes = await pool.query(
            `SELECT blocked_date as date, status, booking_id, start_time, end_time 
             FROM availability_blocks 
             WHERE photographer_id = $1 AND blocked_date BETWEEN $2 AND $3`,
            [signupId, startDate, endDate]
        );

        // 2. Fetch confirmed and pending events (bookings)
        const eventsRes = await pool.query(
            `SELECT e.date, e.id, e.status, 
                    COALESCE(cp.full_name, u.name, e.client_name, 'Client') AS client_name
             FROM events e
             LEFT JOIN users u ON u.id = e.client_id
             LEFT JOIN client_profiles cp ON cp.user_id = e.client_id
             WHERE (e.signup_id = $1 OR e.photographer_id = $1) 
               AND e.status IN ('Confirmed', 'Pending') 
               AND e.date BETWEEN $2 AND $3`,
            [signupId, startDate, endDate]
        );

        // 3. Fetch recurring schedule
        const recurringRes = await pool.query(
            `SELECT day_of_week, start_time, end_time, is_active 
             FROM recurring_schedule 
             WHERE photographer_id = $1`,
            [signupId]
        );

        const blocksMap = {};
        
        // Helper to get YYYY-MM-DD from date object without timezone shift
        const toKey = (d) => {
            const dateObj = new Date(d);
            return `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}-${String(dateObj.getUTCDate()).padStart(2, '0')}`;
        };

        // Merge manual blocks
        blocksRes.rows.forEach(b => {
            blocksMap[toKey(b.date)] = {
                status: b.status,
                booking_id: b.booking_id,
                startTime: b.start_time,
                endTime: b.end_time
            };
        });

        // Merge events (override if not already manually set)
        eventsRes.rows.forEach(e => {
            const key = toKey(e.date);
            const statusLabel = e.status === 'Confirmed' ? 'booked' : 'pending';
            
            // Priority: Manual Block > Confirmed Booking > Pending Booking
            if (!blocksMap[key] || (blocksMap[key].status === 'available' || blocksMap[key].status === 'none')) {
                blocksMap[key] = {
                    status: statusLabel,
                    booking_id: e.id,
                    clientName: e.client_name,
                    eventStatus: e.status
                };
            }
        });

        const recurringMap = {};
        recurringRes.rows.forEach(r => {
            recurringMap[r.day_of_week] = {
                active: r.is_active,
                startTime: r.start_time,
                endTime: r.end_time
            };
        });

        // Generate response for entire month?
        // Actually, the client calendar can do the merging logic or we can send the two sets.
        // The request says: "Returns a map of {date: status} for the entire month."
        
        const finalMap = {};
        let d = new Date(Date.UTC(year, monthNum - 1, 1));
        while (d.toISOString().split('T')[0] <= endDate) {
            const dateStr = d.toISOString().split('T')[0];
            const dow = d.getUTCDay(); // 0 is Sunday
            
            if (blocksMap[dateStr]) {
                finalMap[dateStr] = blocksMap[dateStr];
            } else if (recurringMap[dow] && recurringMap[dow].active) {
                finalMap[dateStr] = {
                    status: 'available',
                    startTime: recurringMap[dow].startTime,
                    endTime: recurringMap[dow].endTime
                };
            } else {
                finalMap[dateStr] = { status: 'none' };
            }
            
            d.setUTCDate(d.getUTCDate() + 1);
        }

        res.json(finalMap);
    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateBlock = async (req, res) => {
    const { signupId, date, status, startTime, endTime, booking_id } = req.body;

    try {
        await pool.query(
            `INSERT INTO availability_blocks (photographer_id, blocked_date, status, start_time, end_time, booking_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (photographer_id, blocked_date) 
             DO UPDATE SET status = EXCLUDED.status, start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, booking_id = EXCLUDED.booking_id`,
            [signupId, date, status, startTime || null, endTime || null, booking_id || null]
        );
        res.json({ message: "Block updated successfully" });
    } catch (error) {
        console.error("Error updating block:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteBlock = async (req, res) => {
    const { signupId, date } = req.params;

    try {
        await pool.query(
            `DELETE FROM availability_blocks WHERE photographer_id = $1 AND blocked_date = $2`,
            [signupId, date]
        );
        res.json({ message: "Block removed successfully" });
    } catch (error) {
        console.error("Error deleting block:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getRecurringSchedule = async (req, res) => {
    const { signupId } = req.query;

    try {
        const result = await pool.query(
            `SELECT day_of_week, start_time, end_time, is_active FROM recurring_schedule WHERE photographer_id = $1`,
            [signupId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching recurring schedule:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateRecurringSchedule = async (req, res) => {
    const { signupId, schedule } = req.body; // schedule is array of {day_of_week, start_time, end_time, is_active}

    try {
        // Use a transaction for bulk update
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            for (const day of schedule) {
                await client.query(
                    `INSERT INTO recurring_schedule (photographer_id, day_of_week, start_time, end_time, is_active)
                     VALUES ($1, $2, $3, $4, $5)
                     ON CONFLICT (photographer_id, day_of_week)
                     DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_active = EXCLUDED.is_active`,
                    [signupId, day.day_of_week, day.start_time, day.end_time, day.is_active]
                );
            }
            await client.query('COMMIT');
            res.json({ message: "Recurring schedule updated successfully" });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error updating recurring schedule:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
