import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia component="img" height="180" image={product.imageUrl} alt={product.name} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Chip label={product.category || "General"} size="small" color="secondary" />
          <Rating value={4} size="small" readOnly />
        </Box>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          ₹{product.price}
        </Typography>
        {product.colors && product.colors.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Colors: {product.colors.join(", ")}
          </Typography>
        )}
        {product.sizes && product.sizes.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Sizes: {product.sizes.join(", ")}
          </Typography>
        )}
      </CardContent>
      <Box sx={{ display: "flex", gap: 1, p: 2 }}>
        <Button component={Link} to={`/products/${product._id}`} variant="outlined" fullWidth>
          Details
        </Button>
        <Button variant="contained" onClick={() => addItem(product)} fullWidth>
          Add
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
