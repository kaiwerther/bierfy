// src/services/paymentService.js
import stripe  from 'stripe';
import db from '../models/index.js';

class PaymentService {
  async purchasePro(userId, paymentMethodId) {
    const paymentIntent = await stripe(process.env.STRIPE_SECRET_KEY).paymentIntents.create({
      amount: 999, // $9.99
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true
    });

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment failed');
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update({ is_pro: true });
  }
}

export default new PaymentService();
