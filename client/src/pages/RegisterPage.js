import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, maxWidth: 420, width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join MicroECom to start ordering in minutes.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Name" name="name" required onChange={handleChange} />
          <TextField label="Email" name="email" type="email" required onChange={handleChange} />
          <TextField label="Password" name="password" type="password" required onChange={handleChange} />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" size="large">
            Register
          </Button>
          <Button component={Link} to="/login">
            Already have an account?
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
