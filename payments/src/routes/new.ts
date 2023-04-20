import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@mrshahabtickets/common';
import { stripe } from '../stripe';
import { Order } from '../models/order';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('cannot pay for an cancelled order');
    }
    console.log({
      amount: order.price * 100, //because base on cents
      currency: 'usd',
      source: token,
    });

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100, //because base on cents
      source: token,
    });

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
