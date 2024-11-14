// src/routes/beerRoutes.js
import express from 'express';
const router = express.Router();
import beerController from '../controllers/beerController.js';
import authenticateToken from '../middleware/auth.js';

router.get('/', authenticateToken, beerController.searchBeers);
router.post('/', authenticateToken, beerController.addBeer);
router.get('/companies', authenticateToken, beerController.searchCompanies);
router.post('/companies', authenticateToken, beerController.addCompany);
router.get('/all', authenticateToken, beerController.getAllBeersWithRatings);
router.get('/:beer_id', authenticateToken, beerController.getBeerDetails);

export default router;
