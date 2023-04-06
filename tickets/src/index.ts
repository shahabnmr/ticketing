import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await natsWrapper.connect('ticketing', 'sdfedfa', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      //inkaro anjam midim ke ba harbar restart shodane listener dobare ye listener dige nasaze va ghabli ro kill dar nazar nagire
      console.log('NATS connection Closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close()); // ina ham baraye hamon elati ke dar close neveshte shode neveshte shode
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb-tickets');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000......');
});

start();
