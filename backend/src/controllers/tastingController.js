// src/controllers/tastingController.js
import tastingService from '../services/tastingService.js';
import upload from '../utils/multerConfig.js';

class TastingController {
  async getUserTastings(req, res) {
    const tastings = await tastingService.getUserTastings(req.user.id);
    res.json(tastings);
  }

  async addTasting(req, res) {
      const data = {
        userId: req.user.id,
        beerId: req.body.beer_id,
        ratings: req.body.ratings,
      };
      const tasting = await tastingService.addTasting(data);
      res.status(201).json(tasting);

  }

  async getTasters(req, res) {
      const tasters = await tastingService.getTasters(req.user.id);
      res.json(tasters);

  }

  async updateTasting(req, res) {
      const newTasting = await tastingService.updateTasting(req.params.tasting_id, req.user.id, req.body);
      res.json({ newTasting });

  }

  async deleteTasting(req, res) {
      await tastingService.deleteTasting(req.params.tasting_id, req.user.id);
      res.json({ message: 'Tasting deleted' });

  }

  async uploadImage(req, res) {
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      try {
        await tastingService.uploadImage(req.params.tasting_id, req.user.id, req.file.path);
        res.json({ message: 'Image uploaded', imagePath: req.file.path });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
  }

  async getTastingImages(req, res) {
      const images = await tastingService.getTastingImages(req.params.tasting_id);
      res.json(images);

  }
}

export default new TastingController();
