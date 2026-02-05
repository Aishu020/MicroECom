const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const axios = require("axios");
const app = require("../src/app");

jest.mock("axios");

let mongo;
const userToken = jwt.sign({ id: "user1", role: "user" }, "testsecret");

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  process.env.MONGO_DB = "test_order";
  process.env.JWT_SECRET = "testsecret";
  process.env.PRODUCT_SERVICE_URL = "http://product-service";
  process.env.PAYMENT_SERVICE_URL = "http://payment-service";
  process.env.SERVICE_KEY = "service_key";
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe("Order Service", () => {
  it("creates order and pays successfully", async () => {
    axios.get.mockResolvedValue({
      data: { _id: "p1", name: "Prod", price: 100, stock: 10 }
    });
    axios.post.mockResolvedValue({
      data: { status: "success", transactionId: "tx1" }
    });
    axios.patch.mockResolvedValue({ data: { ok: true } });

    const create = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ items: [{ productId: "p1", quantity: 2 }] });
    expect(create.status).toBe(201);

    const pay = await request(app)
      .post(`/orders/${create.body._id}/pay`)
      .set("Authorization", `Bearer ${userToken}`)
      .send();
    expect(pay.status).toBe(200);
    expect(pay.body.status).toBe("Paid");
  });
});
