import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful sign up", async () => {
  return request(app)
    .post("/api/users_/signup")
    .send({
      email: "test@test.com",
      password: "123sdf45tf",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users_/signup")
    .send({
      email: "tdfadfd",
      password: "123sdf45tf",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users_/signup")
    .send({
      email: "test@test.com",
      password: "r",
    })
    .expect(400);
});

it("returns a 400 with an missing email and password", async () => {
  return request(app).post("/api/users_/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users_/signup")
    .send({
      email: "asd@asd.com",
      password: "123123",
    })
    .expect(201);

  await request(app)
    .post("/api/users_/signup")
    .send({
      email: "asd@asd.com",
      password: "123123",
    })
    .expect(400);
});

it('sets a cookie after successful signup',async()=>{
    const response = await request(app)
    .post("/api/users_/signup")
    .send({
      email: "asd@asd.com",
      password: "123123",
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined()
})