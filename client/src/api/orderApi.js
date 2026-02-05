import api from "./axios";

export const createOrder = (payload) => api.post("/orders", payload);
export const fetchOrders = () => api.get("/orders");
export const payOrder = (orderId) => api.post(`/orders/${orderId}/pay`);
