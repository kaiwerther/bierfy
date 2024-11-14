// src/controllers/beerController.js
import beerService from '../services/beerService.js';

class BeerController {
  async searchCompanies(req, res) {
    try {
      console.log(req.query.search)
      const companies = await beerService.searchCompanies(req.query.search || '');
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addCompany(req, res) {
    try {
      const company = await beerService.addCompany(req.body.name, req.user.id);
      res.status(201).json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchBeers(req, res) {
    try {
      const { company_id, search } = req.query;
      if (!company_id) {
        return res.status(400).json({ error: 'Company ID is required' });
      }
      const beers = await beerService.searchBeers(company_id, search || '');
      res.json(beers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addBeer(req, res) {
    try {
      const { company_id, name } = req.body;
      if (!company_id || !name) {
        return res.status(400).json({ error: 'Company ID and name are required' });
      }
      const beer = await beerService.addBeer(company_id, name, req.user.id);
      res.status(201).json(beer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllBeersWithRatings(req, res) {
    try {
      if (!req.user.is_pro) {
        return res.status(403).json({ message: 'Upgrade to Pro to access this feature' });
      }
      const beers = await beerService.getAllBeersWithRatings();
      res.json(beers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBeerDetails(req, res) {
    try {
      if (!req.user.is_pro) {
        return res.status(403).json({ message: 'Upgrade to Pro to access this feature' });
      }
      const beerDetails = await beerService.getBeerDetails(req.params.beer_id);
      res.json(beerDetails);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new BeerController();
