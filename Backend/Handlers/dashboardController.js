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

const toMessageTime = (timestamp) => {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getPhotographerRealtimeData = async (req, res) => {
  try {
    const signupId = Number(req.params.signupId);
    if (!signupId) {
      return res.status(400).json({ message: "Valid signupId is required" });
    }

    const cityResult = await pool.query(
      `SELECT COALESCE(city, '') AS city
       FROM photographers
       WHERE signup_id = $1
       ORDER BY id DESC
       LIMIT 1`,
      [signupId]
    );
    const myCity = cityResult.rows[0]?.city || "";

    const communityResult = await pool.query(
      `SELECT p.id, p.signup_id, COALESCE(p.full_name, u.name, 'Photographer') AS name,
              COALESCE(p.city, '') AS city,
              COALESCE(p.specialization, 'General') AS specialty,
              COALESCE(p.rating, 5) AS rating,
              COALESCE(p.availability, true) AS online
       FROM photographers p
       LEFT JOIN users u ON u.id = p.signup_id
       WHERE p.signup_id IS NOT NULL AND p.signup_id <> $1
       ORDER BY p.rating DESC, p.id DESC
       LIMIT 100`,
      [signupId]
    );

    const community = communityResult.rows.map((row) => ({
      id: `P-${row.signup_id || row.id}`,
      userId: row.signup_id,
      name: row.name,
      city: row.city,
      specialty: row.specialty,
      rating: Number(row.rating) || 5,
      online: Boolean(row.online),
      distanceKm: row.city && myCity && row.city.toLowerCase() === myCity.toLowerCase() ? 5 : ((Number(row.id) % 90) + 10),
    }));

    const settingsResult = await pool.query(
      `SELECT language, timezone, dark_mode, two_factor_auth,
              notify_bookings, notify_payouts, notify_chat, auto_reply,
              payout_method, gst_number
       FROM user_settings
       WHERE user_id = $1
       LIMIT 1`,
      [signupId]
    );

    const userResult = await pool.query(
      `SELECT name, email FROM users WHERE id = $1 LIMIT 1`,
      [signupId]
    );

    const settingsRow = settingsResult.rows[0] || {};
    const user = userResult.rows[0] || {};

    const threadResult = await pool.query(
      `SELECT t.id AS thread_id,
              u.id AS other_user_id,
              COALESCE(p.full_name, u.name, 'User') AS other_name,
              COALESCE(
                (
                  SELECT COUNT(*)::int
                  FROM chat_messages m
                  WHERE m.thread_id = t.id
                    AND m.sender_id <> $1
                    AND m.created_at > COALESCE(cp_self.last_read_at, 'epoch'::timestamp)
                ),
                0
              ) AS unread_count
       FROM chat_threads t
       JOIN chat_participants cp_self ON cp_self.thread_id = t.id AND cp_self.user_id = $1
       JOIN chat_participants cp_other ON cp_other.thread_id = t.id AND cp_other.user_id <> $1
       JOIN users u ON u.id = cp_other.user_id
       LEFT JOIN photographers p ON p.signup_id = u.id
       ORDER BY COALESCE(
         (
          SELECT MAX(created_at) FROM chat_messages m2 WHERE m2.thread_id = t.id
         ),
         t.created_at
       ) DESC`,
      [signupId]
    );

    const conversations = [];
    for (const thread of threadResult.rows) {
      const msgResult = await pool.query(
        `SELECT sender_id, content, created_at
         FROM chat_messages
         WHERE thread_id = $1
         ORDER BY created_at ASC
         LIMIT 200`,
        [thread.thread_id]
      );

      conversations.push({
        id: `C-${thread.thread_id}`,
        threadId: thread.thread_id,
        userId: thread.other_user_id,
        name: thread.other_name,
        unread: Number(thread.unread_count) || 0,
        online: false,
        pinned: false,
        messages: msgResult.rows.map((m) => ({
          fromMe: Number(m.sender_id) === signupId,
          text: m.content,
          time: toMessageTime(m.created_at),
          createdAt: m.created_at,
        })),
      });
    }

    return res.status(200).json({
      settings: {
        fullName: user.name || "",
        email: user.email || "",
        language: settingsRow.language || "English",
        timezone: settingsRow.timezone || "Asia/Kolkata",
        darkMode: settingsRow.dark_mode !== false,
        twoFactorAuth: Boolean(settingsRow.two_factor_auth),
        notifyBookings: settingsRow.notify_bookings !== false,
        notifyPayouts: settingsRow.notify_payouts !== false,
        notifyChat: settingsRow.notify_chat !== false,
        autoReply: Boolean(settingsRow.auto_reply),
        payoutMethod: settingsRow.payout_method || "Bank Transfer",
        gstNumber: settingsRow.gst_number || "",
      },
      community,
      conversations,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load realtime dashboard data", error: error.message });
  }
};

const upsertPhotographerSettings = async (req, res) => {
  try {
    const signupId = Number(req.params.signupId);
    if (!signupId) {
      return res.status(400).json({ message: "Valid signupId is required" });
    }

    const {
      fullName,
      email,
      language,
      timezone,
      darkMode,
      twoFactorAuth,
      notifyBookings,
      notifyPayouts,
      notifyChat,
      autoReply,
      payoutMethod,
      gstNumber,
    } = req.body || {};

    await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email)
       WHERE id = $3`,
      [fullName || null, email || null, signupId]
    );

    await pool.query(
      `INSERT INTO user_settings (
         user_id, language, timezone, dark_mode, two_factor_auth,
         notify_bookings, notify_payouts, notify_chat, auto_reply,
         payout_method, gst_number, updated_at
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP)
       ON CONFLICT (user_id)
       DO UPDATE SET
         language = COALESCE(EXCLUDED.language, user_settings.language),
         timezone = COALESCE(EXCLUDED.timezone, user_settings.timezone),
         dark_mode = COALESCE(EXCLUDED.dark_mode, user_settings.dark_mode),
         two_factor_auth = COALESCE(EXCLUDED.two_factor_auth, user_settings.two_factor_auth),
         notify_bookings = COALESCE(EXCLUDED.notify_bookings, user_settings.notify_bookings),
         notify_payouts = COALESCE(EXCLUDED.notify_payouts, user_settings.notify_payouts),
         notify_chat = COALESCE(EXCLUDED.notify_chat, user_settings.notify_chat),
         auto_reply = COALESCE(EXCLUDED.auto_reply, user_settings.auto_reply),
         payout_method = COALESCE(EXCLUDED.payout_method, user_settings.payout_method),
         gst_number = COALESCE(EXCLUDED.gst_number, user_settings.gst_number),
         updated_at = CURRENT_TIMESTAMP`,
      [
        signupId,
        language || null,
        timezone || null,
        darkMode,
        twoFactorAuth,
        notifyBookings,
        notifyPayouts,
        notifyChat,
        autoReply,
        payoutMethod || null,
        gstNumber || null,
      ]
    );

    return res.status(200).json({ message: "Settings saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save settings", error: error.message });
  }
};

const sendConversationMessage = async (req, res) => {
  try {
    const signupId = Number(req.params.signupId);
    const { threadId, toUserId, text } = req.body || {};

    if (!signupId || !text || !String(text).trim()) {
      return res.status(400).json({ message: "signupId and message text are required" });
    }

    let resolvedThreadId = Number(threadId) || null;

    if (!resolvedThreadId) {
      const peerId = Number(toUserId);
      if (!peerId) {
        return res.status(400).json({ message: "toUserId is required when threadId is not provided" });
      }

      const existingThread = await pool.query(
        `SELECT t.id
         FROM chat_threads t
         JOIN chat_participants p1 ON p1.thread_id = t.id AND p1.user_id = $1
         JOIN chat_participants p2 ON p2.thread_id = t.id AND p2.user_id = $2
         LIMIT 1`,
        [signupId, peerId]
      );

      if (existingThread.rows.length > 0) {
        resolvedThreadId = Number(existingThread.rows[0].id);
      } else {
        const insertedThread = await pool.query(
          `INSERT INTO chat_threads DEFAULT VALUES RETURNING id`
        );
        resolvedThreadId = Number(insertedThread.rows[0].id);

        await pool.query(
          `INSERT INTO chat_participants (thread_id, user_id)
           VALUES ($1, $2), ($1, $3)
           ON CONFLICT (thread_id, user_id) DO NOTHING`,
          [resolvedThreadId, signupId, peerId]
        );
      }
    }

    const participantCheck = await pool.query(
      `SELECT 1
       FROM chat_participants
       WHERE thread_id = $1 AND user_id = $2
       LIMIT 1`,
      [resolvedThreadId, signupId]
    );

    if (participantCheck.rows.length === 0) {
      return res.status(403).json({ message: "User is not a participant in this conversation" });
    }

    const insertedMessage = await pool.query(
      `INSERT INTO chat_messages (thread_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [resolvedThreadId, signupId, String(text).trim()]
    );

    await pool.query(
      `UPDATE chat_participants
       SET last_read_at = CURRENT_TIMESTAMP
       WHERE thread_id = $1 AND user_id = $2`,
      [resolvedThreadId, signupId]
    );

    return res.status(201).json({
      message: "Message sent",
      threadId: resolvedThreadId,
      data: {
        id: insertedMessage.rows[0].id,
        createdAt: insertedMessage.rows[0].created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

const markConversationRead = async (req, res) => {
  try {
    const signupId = Number(req.params.signupId);
    const threadId = Number(req.params.threadId);

    if (!signupId || !threadId) {
      return res.status(400).json({ message: "Valid signupId and threadId are required" });
    }

    await pool.query(
      `UPDATE chat_participants
       SET last_read_at = CURRENT_TIMESTAMP
       WHERE thread_id = $1 AND user_id = $2`,
      [threadId, signupId]
    );

    return res.status(200).json({ message: "Conversation marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to mark conversation as read", error: error.message });
  }
};

module.exports = {
  getClientDashboard,
  getPhotographerDashboard,
  getPhotographerRealtimeData,
  upsertPhotographerSettings,
  sendConversationMessage,
  markConversationRead,
};
