import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../api/productApi";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  imageUrl: "",
  stock: "",
  sizes: "",
  colors: ""
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const response = await fetchProducts();
    setProducts(response.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      sizes: form.sizes
        ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      colors: form.colors
        ? form.colors.split(",").map((c) => c.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage("Product updated");
      } else {
        await createProduct(payload);
        setMessage("Product created");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category || "",
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      sizes: (product.sizes || []).join(", "),
      colors: (product.colors || []).join(", ")
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setMessage("Product deleted");
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Product Manager
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Edit Product" : "Create Product"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Name" name="name" fullWidth value={form.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Image URL" name="imageUrl" fullWidth value={form.imageUrl} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
                name="category"
                value={form.category}
                onChange={handleChange}
                displayEmpty
                fullWidth
                required
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Home & Living">Home & Living</MenuItem>
                <MenuItem value="Fashion">Fashion</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
                <MenuItem value="Grocery">Grocery</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" name="description" fullWidth value={form.description} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Sizes (comma separated)"
                name="sizes"
                fullWidth
                value={form.sizes}
                onChange={handleChange}
                placeholder="S, M, L"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Colors (comma separated)"
                name="colors"
                fullWidth
                value={form.colors}
                onChange={handleChange}
                placeholder="Black, Blue"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Price (INR)" name="price" type="number" fullWidth value={form.price} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Stock" name="stock" type="number" fullWidth value={form.stock} onChange={handleChange} required />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" type="submit">
              {editingId ? "Update" : "Create"}
            </Button>
            {editingId && (
              <Button variant="outlined" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancel
              </Button>
            )}
          </Box>
          {message && (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              {message}
            </Typography>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Products
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {products.map((product) => (
          <Box key={product._id} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="subtitle1">{product.name}</Typography>
              <Typography variant="body2">
                ₹{product.price} • {product.category || "General"} • Stock: {product.stock}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" onClick={() => handleEdit(product)}>
                Edit
              </Button>
              <Button color="error" onClick={() => handleDelete(product._id)}>
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default AdminProductsPage;
