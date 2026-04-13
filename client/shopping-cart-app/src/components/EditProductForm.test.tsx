import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import EditProductForm from "./EditProductForm";
import { Product } from "../types";

const mockProduct: Product = {
   _id: "123",
   title: "Kindle",
   price: 50,
   quantity: 10,
};

describe("EditProductForm", async () => {
   it("displays the current product details", () => {
      render(
         <EditProductForm
            {...mockProduct}
            onToggleEdit={vi.fn()}
            onUpdateProduct={vi.fn()}
         />
      );

      expect(screen.getByLabelText(/name/i)).toHaveValue(mockProduct.title);
      expect(screen.getByLabelText(/price/i)).toHaveValue(mockProduct.price);
      expect(screen.getByLabelText(/quantity/i)).toHaveValue(mockProduct.quantity);
   });

   it("it updates input fields", async () => {
      // mount the component with expected props
      render(
         <EditProductForm
            {...mockProduct}
            onToggleEdit={vi.fn()}
            onUpdateProduct={vi.fn()}
         />
      );

      // create references for the form input fields
      const titleInput = screen.getByLabelText(/name/i);
      const priceInput = screen.getByLabelText(/price/i);
      const quantityInput = screen.getByLabelText(/quantity/i);

      // have user clear input fields first
      await userEvent.clear(titleInput);
      await userEvent.clear(priceInput);
      await userEvent.clear(quantityInput);

      // and then type in inputs
      await userEvent.type(titleInput, "apple");
      await userEvent.type(priceInput, "2");
      await userEvent.type(quantityInput, "3");

      // confirm fields have expected value
      expect(titleInput).toHaveValue("apple");
      expect(priceInput).toHaveValue(2);
      expect(quantityInput).toHaveValue(3);
   });
});
