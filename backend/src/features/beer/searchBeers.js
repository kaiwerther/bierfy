// src/features/beer/searchBeers.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Route Definition
router.get('/', authenticateToken, searchBeersHandler);

// Controller Function
async function searchBeersHandler(req, res) {
  try {
    const { company_id, search } = req.query;
    if (!company_id) {
      return res.status(400).json({ error: 'Company ID is required' });
    }
    const beers = await searchBeersService(company_id, search || '');
    res.json(beers);
  } catch (error) {
    console.error('Error searching beers:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Service Function
async function searchBeersService(companyId, search) {
  return await db.Beer.findAll({
    where: {
      company_id: companyId,
      name: {
        [Op.like]: `%${search}%`,
      },
    },
    attributes: ['id', 'name'],
  });
}

export default router;
