const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const { verifyToken, verifyTokenIfNeeded } = require("./middlewares/auth");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "gateway" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const services = {
  auth: process.env.AUTH_SERVICE_URL,
  product: process.env.PRODUCT_SERVICE_URL,
  order: process.env.ORDER_SERVICE_URL,
  payment: process.env.PAYMENT_SERVICE_URL
};

const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  proxyTimeout: 5000,
  timeout: 5000,
  onError: (err, req, res) => {
    res.status(502).json({ message: "Bad gateway", error: err.message });
  },
  onProxyReq: () => {}
});

const proxyOptionsWithPrefix = (target, prefix) => ({
  ...proxyOptions(target),
  pathRewrite: (path) => `${prefix}${path === "/" ? "" : path}`
});

const proxyOptionsForPayments = (target) => ({
  ...proxyOptions(target),
  pathRewrite: (path) => (path.startsWith("/pay") ? path : `/pay${path === "/" ? "" : path}`)
});

app.use("/api/auth", createProxyMiddleware(proxyOptionsWithPrefix(services.auth, "/auth")));
app.use(
  "/api/products",
  verifyTokenIfNeeded,
  createProxyMiddleware(proxyOptionsWithPrefix(services.product, "/products"))
);
app.use(
  "/api/orders",
  verifyToken,
  createProxyMiddleware(proxyOptionsWithPrefix(services.order, "/orders"))
);
app.use("/api/payments", verifyToken, createProxyMiddleware(proxyOptionsForPayments(services.payment)));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
