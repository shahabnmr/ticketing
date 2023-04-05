import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    //inkaro anjam midim ke ba harbar restart shodane listener dobare ye listener dige nasaze va ghabli ro kill dar nazar nagire
    console.log('NATS connection Closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close()); // ina ham baraye hamon elati ke dar close neveshte shode neveshte shode
process.on('SIGTERM', () => stan.close());
