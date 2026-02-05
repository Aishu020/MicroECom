# MicroECom

Production-style, dockerized microservices E-Commerce system with an API Gateway, JWT auth, and a React + MUI frontend.

**Architecture Diagram**
→ Client (React + MUI)
→ API Gateway (Express)
→ Auth Service (MongoDB)
→ Product Service (MongoDB)
→ Order Service (MongoDB)
→ Payment Service (MongoDB, mock)

Each service runs independently in Docker with its own database.

**How To Run (Docker)**
1. Ensure Docker Desktop is running.
2. From the project root:

```bash
docker compose up --build
```

3. Open:
`http://localhost:3000` for the client
`http://localhost:8080/health` for the gateway health check
`http://localhost:8080/docs` for Swagger (gateway)

**Swagger Docs**
- Gateway: `http://localhost:8080/docs`
- Auth Service: `http://localhost:4001/docs`
- Product Service: `http://localhost:4002/docs`
- Order Service: `http://localhost:4003/docs`
- Payment Service: `http://localhost:4004/docs`

**API Endpoints (via Gateway)**
Auth Service
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login and receive JWT

Product Service
- `GET /api/products` — List products
- `GET /api/products/:id` — Product details
- `POST /api/products` — Create product (admin)
- `PUT /api/products/:id` — Update product (admin)
- `DELETE /api/products/:id` — Delete product (admin)

Order Service
- `POST /api/orders` — Create order (auth)
- `GET /api/orders` — Get user orders (auth)
- `POST /api/orders/:id/pay` — Pay for order (auth)
- `PUT /api/orders/:id/status` — Update order status (admin)

Payment Service
- `POST /api/payments/pay` — Mock payment (auth, INR only)

**Env Samples**
Each service includes a `.env.example` with required variables.

**Notes**
- JWT is validated in the gateway.
- Product listing is public; create/update/delete requires admin role.
- Payment service returns mock success/failure with transaction ID.

**Seeds**
- Admin seed: `npm run seed:admin` inside `services/auth-service`
- Product seed: `npm run seed:products` inside `services/product-service`

**Tests**
- Auth: `npm test` inside `services/auth-service`
- Product: `npm test` inside `services/product-service`
- Order: `npm test` inside `services/order-service`
- Payment: `npm test` inside `services/payment-service`
