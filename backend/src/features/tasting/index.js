// src/features/tasting/index.js
import express from 'express';

import addTastingRouter from './addTasting.js';
import deleteTastingRouter from './deleteTasting.js';
import getTastingsRouter from './getTastings.js';
import getTastersRouter from './getTasters.js';
import getTastingImageRouter from './getTastingImage.js';

const router = express.Router();

// Combine routes
router.use('/', getTastingsRouter); // GET '/'
router.use('/', addTastingRouter); // POST '/'
router.use('/', deleteTastingRouter); // DELETE '/:tasting_id'
router.use('/', getTastersRouter); // GET '/tasters'
router.use('/', getTastingImageRouter); // GET '/:tasting_id/image'

export default router;
