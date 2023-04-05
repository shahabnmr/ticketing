import nats from 'node-nats-streaming';
import { TicketCreatedPublished } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to Nats');

  const publisher = new TicketCreatedPublished(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'asd',
      price: 20,
    });
  } catch (error) {
    console.error(error);
  }
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
