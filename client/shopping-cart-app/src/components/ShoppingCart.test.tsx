import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, assert } from "vitest";
import ShoppingCart from "./ShoppingCart";
import { CartItem } from "../types";
import { calculateTotal } from "../helpers/helpers";

const mockCartItems: CartItem[] = [
   { _id: "1", title: "Item 1", price: 10, quantity: 1, productId: "1" },
   { _id: "2", title: "Item 2", price: 20, quantity: 2, productId: "2" },
];

describe("ShoppingCart", () => {
   it("displays empty cart message when there are no items", () => {
      render(<ShoppingCart cartItems={[]} onCheckout={vi.fn()} />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
      expect(screen.getByText(/total: \$0/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /checkout/i })).toBeDisabled();
   });

   it("displays cart items and enables checkout button when there are items", () => {
      render(<ShoppingCart cartItems={mockCartItems} onCheckout={vi.fn()} />);

      expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();
      mockCartItems.forEach((item) => {
         expect(screen.getByText(item.title)).toBeInTheDocument();
      })
      expect(screen.getByRole("button", { name: /checkout/i })).toBeEnabled();
   });

   it("displays total price of cart items", () => {
      render(<ShoppingCart cartItems={mockCartItems} onCheckout={vi.fn()} />);

      const total = calculateTotal(mockCartItems);
      expect(screen.getByText(`Total: $${total.toFixed(2)}`)).toBeInTheDocument();
   });
});
