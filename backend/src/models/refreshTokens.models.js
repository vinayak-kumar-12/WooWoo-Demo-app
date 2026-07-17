const { pool } = require("../config/db");

/**
 * Inserts a new refresh token hash into the database
 * @param {number} userId - ID of the user
 * @param {string} tokenHash - SHA-256 hash of the token
 * @param {Date} expiresAt - Expiry date of the token
 * @returns {object} The created database row
 */
const saveRefreshToken = async (userId, tokenHash, expiresAt) => {
  const result = await pool.query(
    `
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [userId, tokenHash, expiresAt]
  );
  return result.rows[0];
};

/**
 * Finds a refresh token by its SHA-256 hash
 * @param {string} tokenHash - SHA-256 hash of the token
 * @returns {object|null} The matching token row, if found
 */
const findRefreshToken = async (tokenHash) => {
  const result = await pool.query(
    `
    SELECT * FROM refresh_tokens
    WHERE token_hash = $1;
    `,
    [tokenHash]
  );
  return result.rows[0] || null;
};

/**
 * Revokes a specific refresh token by marking it revoked
 * @param {string} tokenHash - SHA-256 hash of the token
 * @returns {boolean} True if successfully revoked
 */
const revokeRefreshToken = async (tokenHash) => {
  const result = await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked_at = CURRENT_TIMESTAMP
    WHERE token_hash = $1
    RETURNING id;
    `,
    [tokenHash]
  );
  return result.rowCount > 0;
};

/**
 * Increments user token version, revoking all outstanding tokens immediately
 * @param {number} userId - ID of the user
 * @returns {number} The new token version
 */
const incrementUserTokenVersion = async (userId) => {
  const result = await pool.query(
    `
    UPDATE users
    SET token_version = COALESCE(token_version, 1) + 1
    WHERE id = $1
    RETURNING token_version;
    `,
    [userId]
  );
  return result.rows[0]?.token_version || 1;
};

module.exports = {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  incrementUserTokenVersion,
};
