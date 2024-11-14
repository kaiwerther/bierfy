// src/services/beerService.js
import db from '../models/index.js';
import { Op } from 'sequelize';

class BeerService {
  async searchCompanies(search) {
    return await db.Company.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      attributes: ['id', 'name'],
    });
  }

  async addCompany(name, created_by) {
    let company = await db.Company.findOne({ where: { name } });
    if (!company) {
      company = await db.Company.create({ name, created_by });
    }
    return company;
  }

  async searchBeers(companyId, search) {
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

  async addBeer(companyId, name, createdBy) {
    let beer = await db.Beer.findOne({ where: { company_id: companyId, name } });
    if (!beer) {
      beer = await db.Beer.create({ company_id: companyId, name, created_by: createdBy });
    }
    return beer;
  }

  async getAllBeersWithRatings() {
    return await db.Beer.findAll({
      attributes: [
        'id',
        'name',
        [db.Sequelize.fn('AVG', db.Sequelize.col('Tastings.rating')), 'average_rating']
      ],
      include: [{
        model: db.Tasting,
        attributes: [],
        where: { is_rating_public: true },
        required: false
      }],
      group: ['Beer.id']
    });
  }

  async getBeerDetails(beerId) {
    const beer = await db.Beer.findByPk(beerId);
    if (!beer) {
      throw new Error('Beer not found');
    }
    const ratings = await db.Tasting.findAll({
      where: {
        beer_id: beerId,
        is_rating_public: true
      },
      include: [{
        model: db.User,
        attributes: ['username']
      }],
      attributes: ['rating', 'notes']
    });
    return { beer, ratings };
  }
}
export default new BeerService();
