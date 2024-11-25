// src/features/beer/index.js
import express from 'express';

import searchCompaniesRouter from './searchCompanies.js';
import addCompanyRouter from './addCompany.js';

const router = express.Router();

// Combine routes
router.use('/', searchCompaniesRouter); // GET '/companies'
router.use('/', addCompanyRouter); // POST '/companies'

export default router;
