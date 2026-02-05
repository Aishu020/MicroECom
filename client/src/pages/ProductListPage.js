import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Select,
  MenuItem,
  Slider,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { fetchProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [sortBy, setSortBy] = useState("featured");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data);
        if (response.data.length > 0) {
          const prices = response.data.map((p) => p.price);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "General"));
    return Array.from(set);
  }, [products]);

  const sizes = useMemo(() => {
    const set = new Set();
    products.forEach((p) => (p.sizes || []).forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  const colors = useMemo(() => {
    const set = new Set();
    products.forEach((p) => (p.colors || []).forEach((c) => set.add(c)));
    return Array.from(set);
  }, [products]);

  const priceLimits = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 10000 };
    }
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const [minPrice, maxPrice] = priceRange;
    let list = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category || "General");
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesSize =
        selectedSizes.length === 0 ||
        (product.sizes || []).some((s) => selectedSizes.includes(s));
      const matchesColor =
        selectedColors.length === 0 ||
        (product.colors || []).some((c) => selectedColors.includes(c));
      return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesColor;
    });

    if (sortBy === "priceLow") {
      list = list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      list = list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [products, search, selectedCategories, selectedSizes, selectedColors, priceRange, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
    setSortBy("featured");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search for products and more..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
        <Select value={sortBy} onChange={(event) => setSortBy(event.target.value)} size="small">
          <MenuItem value="featured">Featured</MenuItem>
          <MenuItem value="priceLow">Price: Low to High</MenuItem>
          <MenuItem value="priceHigh">Price: High to Low</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
        <Button variant="outlined" onClick={clearFilters}>
          Clear
        </Button>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Accordion elevation={0} disableGutters>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="subtitle2">Categories</Typography>
  </AccordionSummary>

  <AccordionDetails>
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {categories.map((category) => (
        <FormControlLabel
          key={category}
          control={
            <Checkbox
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
          }
          label={category}
        />
      ))}
    </Box>
  </AccordionDetails>
</Accordion>
            <Divider sx={{ my: 2 }} />
            <Accordion elevation={0} disableGutters>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Sizes
            </Typography>
            </AccordionSummary>
              <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {sizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                    />
                  }
                  label={size}
                />
              ))}
            </Box>
              </AccordionDetails>
              </Accordion>
            <Divider sx={{ my: 2 }} />
            <Accordion elevation={0} disableGutters>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Colors
            </Typography>
            </AccordionSummary>
              <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {colors.map((color) => (
                <FormControlLabel
                  key={color}
                  control={
                    <Checkbox
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                    />
                  }
                  label={color}
                />
              ))}
            </Box>  </AccordionDetails> </Accordion>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Price Range (₹)
            </Typography>
            <Slider
              value={priceRange}
              onChange={(event, value) => setPriceRange(value)}
              valueLabelDisplay="auto"
              min={priceLimits.min}
              max={priceLimits.max}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom>
            Deals for You
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filteredProducts.length} items found
          </Typography>
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductListPage;
