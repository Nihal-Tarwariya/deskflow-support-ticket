require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const ticketRoutes = require('./src/routes/tickets');
const bfhlRoutes = require('./src/routes/bfhl');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/tickets', ticketRoutes);
app.use('/bfhl', bfhlRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── MongoDB connection (cached for serverless) ───────────────────────────────
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error('MONGO_URI environment variable is not set.');
  await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log('Connected to MongoDB');
}

// ─── Local server start (non-serverless) ─────────────────────────────────────
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV === 'true') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`DeskFlow API running on port ${PORT}`));
  }).catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
}

// ─── Serverless handler export ────────────────────────────────────────────────
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};

module.exports.app = app;
