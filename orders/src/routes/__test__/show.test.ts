import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/setup';

it('fetches the order', async () => {
  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 22,
  });
  await ticket.save();

  const user = signin();

  // make a request to build an order with this Ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  //make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.order.id);
});

it('return a error if one user tries to fetch another users order', async () => {
  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 22,
  });
  await ticket.save();

  const user = signin();

  // make a request to build an order with this Ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  //make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.order.id}`)
    .set('Cookie', signin())
    .send()
    .expect(401);
});
