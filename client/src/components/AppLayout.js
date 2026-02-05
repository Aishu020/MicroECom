import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  InputBase,
  Toolbar,
  Typography
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { items } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f2f4f7" }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Box component={Link} to="/" sx={{ textDecoration: "none", color: "#fff" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
              MicroECom
            </Typography>
          </Box>
          {/* <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 1,
              px: 2,
              height: 40
            }}
          >
            <InputBase placeholder="Search for products, brands and more" fullWidth />
          </Box> */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: "auto" }}>
            <Button component={Link} to="/orders" sx={{ color: "#fff" }}>
              Orders
            </Button>
            {isAdmin && (
              <Button component={Link} to="/admin/products" sx={{ color: "#fff" }}>
                Admin
              </Button>
            )}
            <Button
              component={Link}
              to="/cart"
              sx={{ color: "#fff" }}
              startIcon={
                <Badge badgeContent={items.length} color="secondary">
                  <ShoppingBagIcon />
                </Badge>
              }
            >
              Cart
            </Button>
            {isAuthenticated ? (
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="contained" color="secondary" component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ background: "#3c233eff", color: "#fff", py: 1 }}>
        <Container sx={{ display: "flex", gap: 3, fontSize: 14 }}>
          <Box component={Link} to="/" sx={{ color: "#fff", textDecoration: "none" }}>
            All
          </Box>
          <Box component={Link} to="/?category=Electronics" sx={{ color: "#fff", textDecoration: "none" }}>
            Electronics
          </Box>
          <Box component={Link} to="/?category=Home%20%26%20Living" sx={{ color: "#fff", textDecoration: "none" }}>
            Home & Living
          </Box>
          <Box component={Link} to="/?category=Fashion" sx={{ color: "#fff", textDecoration: "none" }}>
            Fashion
          </Box>
          <Box component={Link} to="/?category=Accessories" sx={{ color: "#fff", textDecoration: "none" }}>
            Accessories
          </Box>
          <Box component={Link} to="/?category=Grocery" sx={{ color: "#fff", textDecoration: "none" }}>
            Grocery
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppLayout;
