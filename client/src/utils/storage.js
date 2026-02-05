export const getToken = () => localStorage.getItem("microecom_token");
export const setToken = (token) => localStorage.setItem("microecom_token", token);
export const clearToken = () => localStorage.removeItem("microecom_token");

const USER_KEY = "microecom_user";
export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const clearUser = () => localStorage.removeItem(USER_KEY);

const CART_KEY = "microecom_cart";

export const getCart = () => {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const setCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};
