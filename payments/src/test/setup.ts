import { MongoMemoryServer } from 'mongodb-memory-server-global-4.4';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(id?: string): Promise<string[]>;
//     }
//   }
// }

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'secrasdetasd';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

export const signin = (id?: string) => {
  // build a jwt payload. {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'tesast@test.com',
  };

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object. {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into json
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
