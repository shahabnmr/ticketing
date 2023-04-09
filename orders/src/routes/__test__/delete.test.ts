import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/setup';
import { Order } from '../../models/order';
import { OrderStatus } from '@mrshahabtickets/common';

it('marks nad order as cancelled', async () => {
  //create a ticket with ticket model
  const ticket = await Ticket.build({
    title: 'concert',
    price: 23,
  });
  await ticket.save();

  const user = signin();

  //make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancell the order
  await request(app)
    .delete(`/api/orders/${order.order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  //expectation to make sure the thin is cancelled
  const updatedOrder = await Order.findById(order.order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit a order cancelled event');
