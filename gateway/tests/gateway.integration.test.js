const express = require("express");
const http = require("http");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const makeService = (routes) => {
  const app = express();
  app.use(express.json());
  routes(app);
  const server = http.createServer(app);
  return new Promise((resolve) => {
    server.listen(0, () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
  });
};

describe("Gateway integration", () => {
  let authSvc;
  let productSvc;
  let orderSvc;
  let paymentSvc;
  let app;
  let gatewayServer;
  let gatewayRequest;
  let token;

  beforeAll(async () => {
    authSvc = await makeService((app) => {
      app.post("/auth/login", (req, res) => {
        res.json({ token: "t", user: { id: "1", role: "user" } });
      });
    });

    productSvc = await makeService((app) => {
      app.get("/products", (req, res) => {
        res.json([{ _id: "p1", name: "Mock", price: 1, description: "x", imageUrl: "y", stock: 1 }]);
      });
    });

    orderSvc = await makeService((app) => {
      app.get("/orders", (req, res) => {
        res.json([{ _id: "o1", status: "Pending" }]);
      });
    });

    paymentSvc = await makeService((app) => {
      app.post("/pay", (req, res) => {
        res.json({ status: "success", transactionId: "tx" });
      });
    });

    process.env.AUTH_SERVICE_URL = authSvc.url;
    process.env.PRODUCT_SERVICE_URL = productSvc.url;
    process.env.ORDER_SERVICE_URL = orderSvc.url;
    process.env.PAYMENT_SERVICE_URL = paymentSvc.url;
    process.env.JWT_SECRET = "testsecret";

    // load gateway app after env is set
    app = require("../src/app");
    gatewayServer = http.createServer(app);
    await new Promise((resolve) => gatewayServer.listen(0, resolve));
    gatewayRequest = request(gatewayServer);
    token = jwt.sign({ id: "u1", role: "user" }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await new Promise((resolve) => gatewayServer.close(resolve));
    await new Promise((resolve) => authSvc.server.close(resolve));
    await new Promise((resolve) => productSvc.server.close(resolve));
    await new Promise((resolve) => orderSvc.server.close(resolve));
    await new Promise((resolve) => paymentSvc.server.close(resolve));
  });

  it("proxies auth login", async () => {
    const res = await gatewayRequest.post("/api/auth/login").send({ email: "a", password: "b" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBe("t");
  });

  it("allows public product listing", async () => {
    const res = await gatewayRequest.get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body[0]._id).toBe("p1");
  });

  it("blocks orders without token", async () => {
    const res = await gatewayRequest.get("/api/orders");
    expect(res.status).toBe(401);
  });

  it("rewrites payment route", async () => {
    const res = await gatewayRequest
      .post("/api/payments/pay")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 1, currency: "INR" });
    expect(res.status).toBe(200);
    expect(res.body.transactionId).toBe("tx");
  });
});
