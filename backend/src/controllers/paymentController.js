// src/controllers/paymentController.js
import paymentService from '../services/paymentService.js';

class PaymentController {
  async purchasePro(req, res) {
    try {
      await paymentService.purchasePro(req.user.id, req.body.paymentMethodId);
      res.json({ message: 'Pro version purchased' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new PaymentController();
