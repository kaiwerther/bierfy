// src/features/beer/searchCompanies.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Route Definition
router.get('/', authenticateToken, searchCompaniesHandler);

// Controller Function
async function searchCompaniesHandler(req, res) {
  try {
    const companies = await searchCompaniesService(req.query.search || '');
    res.json(companies);
  } catch (error) {
    console.error('Error searching companies:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Service Function
async function searchCompaniesService(search) {
  return await db.Company.findAll({
    where: {
      name: {
        [Op.like]: `%${search}%`,
      },
    },
    attributes: ['id', 'name'],
  });
}

export default router;
