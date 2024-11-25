// src/features/beer/index.js
import express from 'express';

import searchBeersRouter from './searchBeers.js';
import addBeerRouter from './addBeer.js';

const router = express.Router();

// Combine routes
router.use('/', searchBeersRouter); // GET '/'
router.use('/', addBeerRouter); // POST '/'

export default router;
