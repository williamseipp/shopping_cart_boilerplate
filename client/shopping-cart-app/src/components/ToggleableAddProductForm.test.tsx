import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ToggleableAddProductForm from "./ToggleableAddProductForm";

describe("ToggleableAddProductForm", () => {
   it("toggles visibility of AddProductForm by clicking Add a Product and Cancel buttons", async () => {
      const onAddProduct = vi.fn();

      render(<ToggleableAddProductForm onAddProduct={onAddProduct} />);

      const addButton = screen.getByRole("button", { name: /add a product/i });

      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();

      await userEvent.click(addButton);
      expect(addButton).not.toBeInTheDocument();

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(
         screen.getByRole("button", { name: /add a product/i })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
   });
});


// go through every line and attempt to run this
