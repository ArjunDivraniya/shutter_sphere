const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_DAYS = 7;
const EMAIL_VERIFY_HOURS = 24;
const RESET_HOURS = 1;

const signAccessToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      emailVerified: user.email_verified,
    },
    process.env.JWT_SECRET || "secretKey",
    { expiresIn: ACCESS_TOKEN_TTL }
  );

const hashToken = (value) => crypto.createHash("sha256").update(value).digest("hex");

const issueRefreshToken = async (userId) => {
  const raw = crypto.randomBytes(48).toString("hex");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  return raw;
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["client", "photographer"].includes(String(role).toLowerCase())) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const createdUser = await pool.query(
      `INSERT INTO users (name, email, password, role, email_verified)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, role, email, email_verified`,
      [name.trim(), normalizedEmail, passwordHash, String(role).toLowerCase()]
    );

    const user = createdUser.rows[0];
    const verifyToken = jwt.sign(
      { id: user.id, type: "email-verify" },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: `${EMAIL_VERIFY_HOURS}h` }
    );

    await pool.query(
      `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [
        user.id,
        hashToken(verifyToken),
        new Date(Date.now() + EMAIL_VERIFY_HOURS * 60 * 60 * 1000),
      ]
    );

    const accessToken = signAccessToken(user);
    const refreshToken = await issueRefreshToken(user.id);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      role: user.role,
      userId: user.id,
      accessToken,
      verifyToken,
      profileComplete: false
    });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const userResult = await pool.query(
      `SELECT id, email, password, role, email_verified
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [normalizedEmail]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await pool.query(`UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`, [user.id]);

    const accessToken = signAccessToken(user);
    const refreshToken = await issueRefreshToken(user.id);
    setRefreshCookie(res, refreshToken);

    // Check if profile is complete
    let profileComplete = false;
    if (user.role === 'client') {
      const profileResult = await pool.query("SELECT profile_complete FROM client_profiles WHERE user_id = $1", [user.id]);
      profileComplete = profileResult.rows[0]?.profile_complete || false;
    } else if (user.role === 'photographer') {
      // For photographers, we check if they have a record in photographers table
      const profileResult = await pool.query("SELECT id FROM photographers WHERE signup_id = $1", [user.id]);
      profileComplete = profileResult.rows.length > 0;
    }

    return res.status(200).json({
      accessToken,
      role: user.role,
      userId: user.id,
      emailVerified: user.email_verified,
      profileComplete: profileComplete
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await pool.query(
        `UPDATE refresh_tokens
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE token_hash = $1 AND revoked_at IS NULL`,
        [hashToken(refreshToken)]
      );
    }

    clearRefreshCookie(res);
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const tokenHash = hashToken(refreshToken);
    const result = await pool.query(
      `SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at, u.role, u.email, u.email_verified
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1
       LIMIT 1`,
      [tokenHash]
    );

    const row = result.rows[0];
    if (!row || row.revoked_at || new Date(row.expires_at) < new Date()) {
      clearRefreshCookie(res);
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    await pool.query(`UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE id = $1`, [row.id]);
    const nextRefreshToken = await issueRefreshToken(row.user_id);
    setRefreshCookie(res, nextRefreshToken);

    const accessToken = signAccessToken({
      id: row.user_id,
      role: row.role,
      email: row.email,
      email_verified: row.email_verified,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Token refresh failed", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    if (payload.type !== "email-verify") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const tokenHash = hashToken(token);
    const record = await pool.query(
      `SELECT id, user_id, expires_at, used_at
       FROM email_verification_tokens
       WHERE token_hash = $1
       LIMIT 1`,
      [tokenHash]
    );

    const row = record.rows[0];
    if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
      return res.status(400).json({ message: "Verification token expired or invalid" });
    }

    await pool.query(`UPDATE users SET email_verified = true WHERE id = $1`, [row.user_id]);
    await pool.query(`UPDATE email_verification_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1`, [row.id]);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Email verification failed", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();
    if (!normalizedEmail) return res.status(400).json({ message: "Email is required" });

    const userResult = await pool.query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [normalizedEmail]);
    if (userResult.rows.length === 0) {
      return res.status(200).json({ message: "If the email exists, reset instructions have been sent." });
    }

    const userId = userResult.rows[0].id;
    const resetToken = jwt.sign(
      { id: userId, type: "password-reset" },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: `${RESET_HOURS}h` }
    );

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, hashToken(resetToken), new Date(Date.now() + RESET_HOURS * 60 * 60 * 1000)]
    );

    return res.status(200).json({
      message: "If the email exists, reset instructions have been sent.",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Forgot password failed", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    if (payload.type !== "password-reset") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const tokenHash = hashToken(token);
    const record = await pool.query(
      `SELECT id, user_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token_hash = $1
       LIMIT 1`,
      [tokenHash]
    );

    const row = record.rows[0];
    if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
      return res.status(400).json({ message: "Reset token expired or invalid" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [passwordHash, row.user_id]);
    await pool.query(`UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1`, [row.id]);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).json({ message: "Reset password failed", error: error.message });
  }
};

const googleAuth = async (req, res) => {
  return res.status(501).json({ message: "Google OAuth flow is not configured yet" });
};

const googleCallback = async (req, res) => {
  return res.status(501).json({ message: "Google OAuth callback is not configured yet" });
};

module.exports = {
  signup: register,
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
};
