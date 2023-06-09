import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('return a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'asdasd',
      price: 20,
    })
    .expect(404);
});
it('return a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdasd',
      price: 20,
    })
    .expect(401);
});
it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'asds', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'asdasd',
      price: 10000000,
    })
    .expect(401);
});
it('returns a 400 if the user provided an invalid title or price', async () => {
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asds', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 10000000 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'dfdfdfsfdf', price: -10 })
    .expect(400);
});
it('updates the ticket provided valid inputs', async () => {
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asds', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100000 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100000);
});

it('publishes and event', async () => {
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asds', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100000 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asds', price: 20 });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100000 })
    .expect(400);
});
