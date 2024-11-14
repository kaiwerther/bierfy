// src/controllers/tastingController.js
import tastingService from '../services/tastingService.js';
import upload from '../utils/multerConfig.js';

class TastingController {
  async getUserTastings(req, res) {
    try {
      const tastings = await tastingService.getUserTastings(req.user.id);
      res.json(tastings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addTasting(req, res) {
    try {
      const data = {
        userId: req.user.id,
        beerId: req.body.beer_id,
        rating: req.body.rating,
        notes: req.body.notes,
        isRatingPublic: req.body.is_rating_public,
        isPicturePublic: req.body.is_picture_public,
      };
      const tasting = await tastingService.addTasting(data);
      res.status(201).json(tasting);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTasting(req, res) {
    try {
      const newTasting = await tastingService.updateTasting(req.params.tasting_id, req.user.id, req.body);
      res.json({ newTasting });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTasting(req, res) {
    try {
      await tastingService.deleteTasting(req.params.tasting_id, req.user.id);
      res.json({ message: 'Tasting deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
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
    try {
      const images = await tastingService.getTastingImages(req.params.tasting_id);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new TastingController();
