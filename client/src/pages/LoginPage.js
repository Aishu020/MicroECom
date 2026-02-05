import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await loginUser(form);
      login(response.data.token, response.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, maxWidth: 420, width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to manage your orders and checkout faster.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Email" name="email" type="email" required onChange={handleChange} />
          <TextField label="Password" name="password" type="password" required onChange={handleChange} />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
          <Button component={Link} to="/register">
            Create an account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
