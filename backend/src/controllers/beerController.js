// src/controllers/beerController.js
import beerService from '../services/beerService.js';

class BeerController {
  async searchCompanies(req, res) {
    const companies = await beerService.searchCompanies(req.query.search || '');
    res.json(companies);
  }

  async addCompany(req, res) {
    const company = await beerService.addCompany(req.body.name, req.user.id);
    res.status(201).json(company);
  }

  async searchBeers(req, res) {
    const { company_id, search } = req.query;
    if (!company_id) {
      return res.status(400).json({ error: 'Company ID is required' });
    }
    const beers = await beerService.searchBeers(company_id, search || '');
    res.json(beers);
  }

  async addBeer(req, res) {
    const { company_id, name } = req.body;
    if (!company_id || !name) {
      return res
        .status(400)
        .json({ error: 'Company ID and name are required' });
    }
    const beer = await beerService.addBeer(company_id, name, req.user.id);
    res.status(201).json(beer);
  }

  async getAllBeersWithRatings(req, res) {
    if (!req.user.is_pro) {
      return res
        .status(403)
        .json({ message: 'Upgrade to Pro to access this feature' });
    }
    const beers = await beerService.getAllBeersWithRatings();
    res.json(beers);
  }

  async getBeerDetails(req, res) {
    if (!req.user.is_pro) {
      return res
        .status(403)
        .json({ message: 'Upgrade to Pro to access this feature' });
    }
    const beerDetails = await beerService.getBeerDetails(req.params.beer_id);
    res.json(beerDetails);
  }
}

export default new BeerController();
