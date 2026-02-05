import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";

const renderPage = () =>
  render(
    <AuthProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthProvider>
  );

test("renders login form", () => {
  renderPage();
  expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});
