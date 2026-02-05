import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { fetchOrders, payOrder } from "../api/orderApi";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetchOrders();
      setOrders(response.data);
    } catch (err) {
      setMessage("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handlePay = async (orderId) => {
    try {
      await payOrder(orderId);
      loadOrders();
    } catch (err) {
      setMessage("Payment failed");
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading orders...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      {message && (
        <Typography color="error" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      {orders.map((order) => (
        <Paper key={order._id} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6">Order #{order._id.slice(-6)}</Typography>
          <Typography>Status: {order.status}</Typography>
          <Typography>Total: ₹{order.totalAmount}</Typography>
          <Typography sx={{ mt: 1 }}>Items:</Typography>
          {order.items.map((item) => (
            <Typography key={item.productId} variant="body2">
              {item.name} × {item.quantity}
            </Typography>
          ))}
          {order.status !== "Paid" && (
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => handlePay(order._id)}>
              Pay now
            </Button>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default OrdersPage;
