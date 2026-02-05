import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Chip, CircularProgress, Grid, Paper, Rating, Typography } from "@mui/material";
import { fetchProductById } from "../api/productApi";
import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchProductById(id);
        setProduct(response.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">Product not found.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{ width: "100%", borderRadius: 2, objectFit: "cover" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
            <Chip label={product.category || "General"} color="secondary" size="small" />
            <Rating value={4} readOnly size="small" />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            ₹{product.price}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Stock: {product.stock}
          </Typography>
          {product.colors && product.colors.length > 0 && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Colors: {product.colors.join(", ")}
            </Typography>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sizes: {product.sizes.join(", ")}
            </Typography>
          )}
          <Button variant="contained" size="large" onClick={() => addItem(product)}>
            Add to cart
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductDetailsPage;
