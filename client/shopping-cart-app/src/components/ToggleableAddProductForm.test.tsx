import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ToggleableAddProductForm from "./ToggleableAddProductForm";

describe("ToggleableAddProductForm", () => {
   it("toggles visibility of AddProductForm by clicking Add a Product and Cancel buttons", async () => {
      // creates mock function
      const onAddProduct = vi.fn();

      // mounts componenent, passes props, prepares it for testing
      render(<ToggleableAddProductForm onAddProduct={onAddProduct} />);

      // add handler for button component
      const addButton = screen.getByRole("button", { name: /add a product/i });

      // assertion that the form is not visible yet
      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();

      // simulates addButton click
      await userEvent.click(addButton);

      // assertion that button is no longer visible
      expect(addButton).not.toBeInTheDocument();

      // add handler for cancel button
      const cancelButton = screen.getByRole("button", { name: /cancel/i });

      // simulates cancel Button click
      await userEvent.click(cancelButton);

      // assertion that the 'Add A Product' button is visible after clicking cancel
      expect(
         screen.getByRole("button", { name: /add a product/i })
      ).toBeInTheDocument();

      // assertion that form is no longer visible
      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
   });
});


// go through every line and attempt to run this
