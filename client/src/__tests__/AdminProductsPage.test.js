import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as productApi from "../api/productApi";
import AdminProductsPage from "../pages/AdminProductsPage";

test("renders admin product manager", async () => {
  jest.spyOn(productApi, "fetchProducts").mockResolvedValue({ data: [] });
  jest.spyOn(productApi, "createProduct").mockResolvedValue({ data: {} });
  jest.spyOn(productApi, "updateProduct").mockResolvedValue({ data: {} });
  jest.spyOn(productApi, "deleteProduct").mockResolvedValue({ data: {} });

  render(
    <BrowserRouter>
      <AdminProductsPage />
    </BrowserRouter>
  );

  expect(screen.getByText(/Admin Product Manager/i)).toBeInTheDocument();
});
