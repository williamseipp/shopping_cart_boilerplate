import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import EditableProduct from "./EditableProduct";
import { Product } from "../types";

const mockProduct: Product = {
   _id: "123",
   title: "Kindle",
   price: 50,
   quantity: 10,
};

describe("EditableProduct", () => {
   it("displays product details initially", () => {
      // mount the component with props
      render(
         <EditableProduct
            product={mockProduct}
            onUpdateProduct={vi.fn()}
            onDeleteProduct={vi.fn()}
            onAddToCart={vi.fn()}
         />
      );

      // we want to see that the fields ( what fields?)
      expect(screen.getByText(/kindle/i)).toBeInTheDocument();
      expect(screen.getByText(/50/i)).toBeInTheDocument();
      expect(screen.getByText(/10/i)).toBeInTheDocument();

   });



   it("toggles the edit form when edit/cancel buttons are clicked", async () => {
      // mount the component with props
      render(
         <EditableProduct
            product={mockProduct}
            onUpdateProduct={vi.fn()}
            onDeleteProduct={vi.fn()}
            onAddToCart={vi.fn()}
         />
      );

      // reference the heading of the form that we want to see
      const editHeading = screen.queryByRole("heading", {
         name: /edit product/i,
      });
      // at first, it isnt visible
      expect(editHeading).not.toBeInTheDocument();

      // edit button, when clicked, causes edit form heading to appear
      const editButton = screen.getByRole("button", { name: /edit/i });
      await userEvent.click(editButton);
      expect(
         screen.getByRole("heading", { name: /edit product/i })
      ).toBeInTheDocument();


      // cancel button, when clicked, causes edit form heading to dissappear
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(
         screen.queryByRole("heading", { name: /edit product/i })
      ).not.toBeInTheDocument();
   });
});
