import request from "supertest";
import { app } from "../../app";

it("fails when email does not exist supplied", async () => {
  await request(app)
    .post("/api/users_/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is suppleid", async () => {
  await request(app)
    .post("/api/users_/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users_/signin")
    .send({
      email: "test@test.com",
      password: "wrong password",
    })
    .expect(400);
});

it("respons with a cookie when given valid ceridential", async () => {
  await request(app)
    .post("/api/users_/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users_/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
