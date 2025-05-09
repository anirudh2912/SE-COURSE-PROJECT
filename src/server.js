const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Security Middleware
app.use(helmet()); // Adds security headers
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.29.164:3001',
    // Add other allowed origins as needed
  ],
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});
app.use("/api", limiter);

// Logging
app.use(morgan("dev")); // HTTP request logger

// Body Parsing
app.use(express.json({ limit: "10kb" }));

// API status route
app.get("/api", (req, res) => {
  res.status(200).json({
    status: "API is running",
    message: "Welcome to MU Connect API",
    documentation: {
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register"
      }
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "UP",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/auth", authRoutes);

// Request Logging Middleware (for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    suggestion: "Check /api for available endpoints",
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// MongoDB Connection with retry logic
const connectDB = async (retries = 5, interval = 5000) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    console.log("MongoDB Atlas connected successfully");

    // Initial data check
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));

  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    if (retries > 0) {
      console.log(`Retrying connection (${retries} attempts left)...`);
      setTimeout(() => connectDB(retries - 1, interval), interval);
    } else {
      console.error("Failed to connect to MongoDB after multiple attempts");
      process.exit(1);
    }
  }
};

// Database connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB cluster');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Start server only after DB connection
mongoose.connection.once('open', () => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the API: http://localhost:${PORT}/api`);
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
});

// Graceful shutdown
const shutdown = async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Initialize DB connection
connectDB();
