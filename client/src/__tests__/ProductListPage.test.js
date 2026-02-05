import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as productApi from "../api/productApi";
import ProductListPage from "../pages/ProductListPage";
import { CartProvider } from "../context/CartContext";

test("renders product list", async () => {
  jest.spyOn(productApi, "fetchProducts").mockResolvedValue({
    data: [
      {
        _id: "p1",
        name: "Mock Product",
        description: "Mock Desc",
        price: 100,
        imageUrl: "http://example.com/img.png",
        stock: 1
      }
    ]
  });

  render(
    <CartProvider>
      <BrowserRouter>
        <ProductListPage />
      </BrowserRouter>
    </CartProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/Mock Product/i)).toBeInTheDocument();
  });
});
