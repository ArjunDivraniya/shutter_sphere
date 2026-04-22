const { pool } = require("../config/db");

const monthKey = (dateValue) => {
  const d = new Date(dateValue);
  return d.toLocaleString("en-US", { month: "short" });
};

const getClientDashboard = async (req, res) => {
  try {
    const signupId = Number(req.params.signupId);
    if (!signupId) {
      return res.status(400).json({ message: "Valid signupId is required" });
    }

    const bookingsResult = await pool.query(
      `SELECT e.id, e.title, e.date, e.location, COALESCE(e.status, 'Pending') AS status,
              COALESCE(e.client_name, u_client.name, 'Client Booking') AS client_name,
              COALESCE(p.full_name, u_photo.name, 'Photographer') AS photographer_name,
              e.created_at
       FROM events e
       LEFT JOIN users u_client ON u_client.id = e.client_id
       LEFT JOIN users u_photo ON u_photo.id = e.photographer_id
       LEFT JOIN photographers p ON p.signup_id = e.photographer_id
       WHERE e.client_id = $1 OR e.signup_id = $1
       ORDER BY e.date ASC`,
      [signupId]
    );

    const recommendedResult = await pool.query(
      `SELECT id, signup_id, full_name, city, specialization, rating, price_per_hour
       FROM photographers
       ORDER BY rating DESC, id DESC
       LIMIT 6`
    );

    const reviewCountResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM reviews WHERE client_id = $1`,
      [signupId]
    );

    const bookings = bookingsResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      date: row.date,
      location: row.location,
      status: row.status,
      clientName: row.client_name,
      photographerName: row.photographer_name,
      createdAt: row.created_at,
    }));

    const recentActivity = bookings
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((b) => ({
        id: `booking-${b.id}`,
        title: "Booking updated",
        detail: `${b.photographerName} • ${b.status}`,
        time: new Date(b.createdAt).toISOString(),
      }));

    const upcomingBookings = bookings.filter((b) => new Date(b.date) >= new Date() && b.status !== "Cancelled");

    const recommendedPhotographers = recommendedResult.rows.map((row) => ({
      id: row.id,
      signupId: row.signup_id,
      name: row.full_name || "Photographer",
      city: row.city || "",
      specialization: row.specialization || "",
      rating: Number(row.rating) || 5,
      pricePerHour: Number(row.price_per_hour) || 0,
    }));

    return res.status(200).json({
      stats: {
        upcomingBookings: upcomingBookings.length,
        totalBookings: bookings.length,
        favoritePhotographers: reviewCountResult.rows[0]?.total || 0,
      },
      upcomingBookings: bookings.slice(0, 10),
      recommendedPhotographers,
      recentActivity,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load client dashboard", error: error.message });
  }
};

const getPhotographerDashboard = async (req, res) => {
  try {
    const signupId = Number(req.params.signupId);
    if (!signupId) {
      return res.status(400).json({ message: "Valid signupId is required" });
    }

    const bookingsResult = await pool.query(
      `SELECT e.id, e.title, e.date, e.location, COALESCE(e.status, 'Pending') AS status,
              COALESCE(e.client_name, u_client.name, e.title, 'Client') AS client_name,
              e.created_at
       FROM events e
       LEFT JOIN users u_client ON u_client.id = e.client_id
       WHERE e.signup_id = $1 OR e.photographer_id = $1
       ORDER BY e.date ASC`,
      [signupId]
    );

    const priceResult = await pool.query(
      `SELECT COALESCE(MAX(price_per_hour), 0) AS price_per_hour
       FROM photographers
       WHERE signup_id = $1`,
      [signupId]
    );

    const reviewResult = await pool.query(
      `SELECT id, rating, created_at FROM reviews WHERE photographer_id = $1 ORDER BY created_at DESC LIMIT 5`,
      [signupId]
    );

    const bookings = bookingsResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      clientName: row.client_name,
      date: row.date,
      location: row.location,
      status: row.status,
      createdAt: row.created_at,
    }));

    const pricePerHour = Number(priceResult.rows[0]?.price_per_hour) || 100;

    const earningsByMonthMap = new Map();
    bookings.forEach((booking) => {
      if (booking.status === "Cancelled") return;
      const key = monthKey(booking.date);
      const prev = earningsByMonthMap.get(key) || 0;
      earningsByMonthMap.set(key, prev + pricePerHour);
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const earnings = monthOrder
      .filter((m) => earningsByMonthMap.has(m))
      .map((m) => ({ month: m, amount: earningsByMonthMap.get(m) }));

    const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);

    const recentActivity = [
      ...bookings
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
        .map((b) => ({
          id: `booking-${b.id}`,
          title: b.status === "Confirmed" ? "Booking accepted" : "Booking received",
          detail: `${b.clientName} • ${b.status}`,
          time: new Date(b.createdAt).toISOString(),
        })),
      ...reviewResult.rows.map((r) => ({
        id: `review-${r.id}`,
        title: "Review received",
        detail: `${r.rating} star rating submitted`,
        time: new Date(r.created_at).toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 7);

    return res.status(200).json({
      stats: {
        totalBookings: bookings.length,
        upcomingEvents: bookings.filter((b) => new Date(b.date) >= new Date() && b.status !== "Cancelled").length,
        totalEarnings,
        profileViews: 0,
      },
      bookings,
      calendarDates: bookings.map((b) => b.date),
      earnings,
      recentActivity,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load photographer dashboard", error: error.message });
  }
};

module.exports = {
  getClientDashboard,
  getPhotographerDashboard,
};
