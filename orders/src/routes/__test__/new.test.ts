import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@mrshahabtickets/common';

it('return an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it('return an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 22,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'asdad143ad',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('reserved a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 22,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it.todo('emit an order created event');
