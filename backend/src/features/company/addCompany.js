// src/features/beer/addCompany.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';

const router = express.Router();

// Route Definition
router.post('/', authenticateToken, addCompanyHandler);

// Controller Function
async function addCompanyHandler(req, res) {
  try {
    const company = await addCompanyService(req.body.name, req.user.id);
    res.status(201).json(company);
  } catch (error) {
    console.error('Error adding company:', error);
    res.status(400).json({ error: error.message });
  }
}

// Service Function
async function addCompanyService(name, createdBy) {
  let company = await db.Company.findOne({ where: { name } });
  if (!company) {
    company = await db.Company.create({ name, created_by: createdBy });
  }
  return company;
}

export default router;
