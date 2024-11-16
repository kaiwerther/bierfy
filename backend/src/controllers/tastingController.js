// src/controllers/tastingController.js
import tastingService from '../services/tastingService.js';
import path from 'path';
import fs from 'fs/promises'; // Use the promises API for async/await

class TastingController {
  async getUserTastings(req, res) {
    const tastings = await tastingService.getUserTastings(req.user.id);
    res.json(tastings);
  }

  async addTasting(req, res) {
    try {
      // Extract data from request body
      const { beer_id, ratings } = req.body;

      // Ensure that ratings are provided and are in correct format
      if (!ratings || !Array.isArray(JSON.parse(ratings))) {
        return res
          .status(400)
          .json({ error: 'Ratings must be provided as an array.' });
      }

      // Process the uploaded image
      let imagePath = null;
      if (req.file) {
        imagePath = req.file.filename; // Adjust the path as needed
      }

      // Prepare data for service
      const data = {
        userId: req.user.id, // Assuming authentication middleware sets req.user
        beerId: beer_id,
        ratings: JSON.parse(ratings),
        imagePath: imagePath,
      };

      // Call the service to add tasting
      const tasting = await tastingService.addTasting(data);

      res.status(201).json(tasting);
    } catch (error) {
      console.error('Error adding tasting:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async getTasters(req, res) {
    const tasters = await tastingService.getTasters(req.user.id);
    res.json(tasters);
  }

  async deleteTasting(req, res) {
    await tastingService.deleteTasting(req.params.tasting_id, req.user.id);
    res.json({ message: 'Tasting deleted' });
  }

  // New method to retrieve a specific image for a tasting
  async getTastingImage(req, res) {
    try {
      const tastingId = req.params.tasting_id;

      // Fetch the image record from the database
      const tasting = await tastingService.getTastingById(tastingId);

      if (!tasting) {
        return res.status(404).json({ error: 'Tasting not found.' });
      }

      const image = await tastingService.getImageByTastingId(tastingId);

      if (image === null) {
        return res.status(404).json({ error: 'No Image found for tasting.' });
      }

      if (tasting.user_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: 'Forbidden: You do not have access to this image.' });
      }

      // Construct the absolute path to the image
      const imagePath = path.join(process.env.IMAGE_PATH, image.image_path);

      // Check if the file exists
      await fs.access(imagePath).catch(() => {
        throw new Error('File does not exist.');
      });

      // Send the image file
      res.sendFile(imagePath);
    } catch (error) {
      console.error('Error retrieving image:', error);
      if (error.message === 'File does not exist.') {
        return res
          .status(404)
          .json({ error: 'Image file not found on server.' });
      }
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export default new TastingController();
