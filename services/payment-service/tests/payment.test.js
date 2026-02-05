const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

let mongo;
const userToken = jwt.sign({ id: "user1", role: "user" }, "testsecret");

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  process.env.MONGO_DB = "test_payment";
  process.env.JWT_SECRET = "testsecret";
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe("Payment Service", () => {
  it("accepts INR payment", async () => {
    const response = await request(app)
      .post("/pay")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 500, currency: "INR" });
    expect(response.status).toBe(200);
    expect(response.body.transactionId).toBeTruthy();
  });
});
