// src/features/beer/addBeer.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';

const router = express.Router();

// Route Definition
router.post('/', authenticateToken, addBeerHandler);

// Controller Function
async function addBeerHandler(req, res) {
  try {
    const { company_id, name } = req.body;
    if (!company_id || !name) {
      return res
        .status(400)
        .json({ error: 'Company ID and name are required' });
    }
    const beer = await addBeerService(company_id, name, req.user.id);
    res.status(201).json(beer);
  } catch (error) {
    console.error('Error adding beer:', error);
    res.status(400).json({ error: error.message });
  }
}

// Service Function
async function addBeerService(companyId, name, createdBy) {
  let beer = await db.Beer.findOne({
    where: { company_id: companyId, name },
  });
  if (!beer) {
    beer = await db.Beer.create({
      company_id: companyId,
      name,
      created_by: createdBy,
    });
  }
  return beer;
}

export default router;
