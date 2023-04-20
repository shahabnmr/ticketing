import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';
import { Order } from '../../models/order';
import { OrderStatus } from '@mrshahabtickets/common';

it('return a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'asdasdasda',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it('return a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'asdasdasda',
      orderId: order.id,
    })
    .expect(401);
});
it('return a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'asdasdasda',
      orderId: order.id,
    })
    .expect(400);
});