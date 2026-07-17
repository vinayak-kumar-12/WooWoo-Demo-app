const { pool } = require("../config/db");

// Create User
const createUser = async ({ username, email, password = null, firebase_uid = null, provider = 'email' }) => {
  const result = await pool.query(
    `
    INSERT INTO users (username, email, password, firebase_uid, provider)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [username, email, password, firebase_uid, provider]
  );

  return result.rows[0];
};

// Find User by Email
const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT * FROM users
    WHERE email = $1;
    `,
    [email]
  );

  return result.rows[0];
};

// Find User by ID
const findUserById = async (id) => {
  const result = await pool.query(
    `
    SELECT * FROM users
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0];
};

// Find User by Firebase UID
const findUserByFirebaseUid = async (firebaseUid) => {
  const result = await pool.query(
    `
    SELECT * FROM users
    WHERE firebase_uid = $1;
    `,
    [firebaseUid]
  );

  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByFirebaseUid,
};