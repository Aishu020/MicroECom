import api from "./axios";

export const fetchProducts = () => api.get("/products");
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (payload) => api.post("/products", payload);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
