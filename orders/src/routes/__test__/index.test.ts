import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/setup';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 22,
  });
  await ticket.save();
  return ticket;
};
it('fetches orders for an particular user', async () => {
  //create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = signin();
  const user2 = signin();
  //create one order as user number one
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  //create two orders as user number 2
  const { body: order1 } = await request(app) // inja destructure kardim ke az response.body meghdar ro gereftim va gozashtim dar order1
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // make request to get orders for user number 2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  //make sure we only got the orders for user number 2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.order.id);
  expect(response.body[1].id).toEqual(order2.order.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
