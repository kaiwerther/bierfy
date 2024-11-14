// src/app.js
import 'dotenv/config';

import express from 'express';

import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

// Import routes
import authRoutes from './routes/authRoutes.js';
import beerRoutes from './routes/beerRoutes.js';
import tastingRoutes from './routes/tastingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

import passport from './config/passport.js';

const { PORT, FRONTEND_URL } = process.env;
const app = express();

// Configure Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  })
);
app.use(compression());
app.use(helmet());
app.use(express.json());

// Routes with JWT Authentication Middleware
app.use(passport.initialize());


app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/beers', beerRoutes);
app.use('/api/tastings', tastingRoutes);
app.use('/api/payments', paymentRoutes);

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Load Prompts and Start Server
try {
  // Start the server
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} for frontend at ${FRONTEND_URL}`
    );
  });
} catch (error) {
  console.error('Unable to start the server:', error);
  process.exit(1); // Exit the process with failure
}