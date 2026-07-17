require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { pool } = require("./src/config/db");

const app = express();

// Security and CORS middleware
app.use(helmet());

const whitelist = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(",")
  : ["http://localhost:3000", "http://localhost:8081", "http://localhost:19006"];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Import Routes
const userRoutes = require("./src/routes/users.routes");
const authRoutes = require("./src/routes/auth.routes");
const userProfileRoutes = require("./src/routes/user.routes");
const storeRoutes = require("./src/routes/store.routes");

// Mount Routes
app.use("/api/users", userRoutes); // Legacy endpoints
app.use("/api/auth", authRoutes);   // Secure auth endpoints
app.use("/api/user", userProfileRoutes); // User profile endpoints
app.use("/api", storeRoutes);             // Store & payments endpoints

app.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Server & Database Running",
      time: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Centralized error handling middleware
const errorHandler = require("./src/middlewares/error.middleware");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
