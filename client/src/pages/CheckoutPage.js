import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, payOrder } from "../api/orderApi";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    setStatus("");
    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      const orderResponse = await createOrder(orderPayload);
      const orderId = orderResponse.data._id;
      const paymentResponse = await payOrder(orderId);

      if (paymentResponse.data.status === "Paid") {
        setStatus("Payment successful. Order confirmed.");
        clearCart();
        setTimeout(() => navigate("/orders"), 1000);
      } else {
        setStatus("Payment failed or pending. Try again from Orders.");
      }
    } catch (err) {
      setStatus("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">No items to checkout.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Total payable: ₹{total}
      </Typography>
      <Button variant="contained" size="large" onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Pay & place order"}
      </Button>
      {status && (
        <Box sx={{ mt: 2 }}>
          <Typography>{status}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CheckoutPage;
