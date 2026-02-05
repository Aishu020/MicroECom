import React from "react";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Your cart is empty.</Typography>
        <Button component={Link} to="/" sx={{ mt: 2 }}>
          Browse products
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {items.map((item) => (
        <Box key={item.productId} sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
          <Box>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2">₹{item.price}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button variant="outlined" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
              -
            </Button>
            <Typography>{item.quantity}</Typography>
            <Button variant="outlined" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
              +
            </Button>
            <Button color="error" onClick={() => removeItem(item.productId)}>
              Remove
            </Button>
          </Box>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5">Total: ₹{total}</Typography>
      <Button variant="contained" component={Link} to="/checkout" sx={{ mt: 2 }}>
        Proceed to checkout
      </Button>
    </Paper>
  );
};

export default CartPage;
