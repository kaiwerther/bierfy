// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import 'express-async-errors';

// Import routes
import authRoutes from './features/auth/index.js';
import beerRoutes from './features/beer/index.js';
import companyRoutes from './features/company/index.js';
import tastingRoutes from './features/tasting/index.js'; // Updated path

import passport from './config/passport.js';

const { PORT, FRONTEND_URL } = process.env;
const app = express();

// Configure Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
  })
);
app.use(compression());
app.use(helmet());
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Serve Static Files
app.use('/uploads', express.static('uploads'));

// Use Routes
app.use('/api/auth/', authRoutes);
app.use('/api/beers/', beerRoutes);
app.use('/api/companies/', companyRoutes);
app.use('/api/tastings/', tastingRoutes);

// Global Error Handler
app.use((err, req, res, _next) => {
  console.log('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
try {
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} for frontend at ${FRONTEND_URL}`
    );
  });
} catch (error) {
  console.error('Unable to start the server:', error);
  process.exit(1); // Exit the process with failure
}
