import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT)ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      //inkaro anjam midim ke ba harbar restart shodane listener dobare ye listener dige nasaze va ghabli ro kill dar nazar nagire
      console.log('NATS connection Closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close()); // ina ham baraye hamon elati ke dar close neveshte shode neveshte shode
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
};

start();
