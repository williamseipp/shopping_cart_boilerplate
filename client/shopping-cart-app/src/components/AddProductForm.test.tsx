import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AddProductForm from "./AddProductForm";

describe("AddProductForm", () => {
   it("updates input fields", async () => {
      // creates mock function
      const onAddProduct = vi.fn();
      const onToggleForm = vi.fn();

      // mounts componenent, passes props, prepares it for testing
      render(<AddProductForm onToggleForm={onToggleForm} onAddProduct={onAddProduct} />);

      // create references for the form input fields
      const titleInput = screen.getByLabelText(/name/i);
      const priceInput = screen.getByLabelText(/price/i);
      const quantityInput = screen.getByLabelText(/quantity/i);


      // now that we have fields defined, lets simulate user input
      await userEvent.type(titleInput, "apple");
      await userEvent.type(priceInput, "2");
      await userEvent.type(quantityInput, "3");

      // now check the values in each field
      expect(titleInput).toHaveValue("apple");
      expect(priceInput).toHaveValue(2);
      expect(quantityInput).toHaveValue(3);
   });
});
