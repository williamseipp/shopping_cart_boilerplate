// need to mount to DOM, also query DOM for inclusion of 'stuff'
import { render, screen } from "@testing-library/react";

// need to simulate clicks
import userEvent from "@testing-library/user-event";

// group tests, test them, make assertions, automated 'tear down' of scaffolding, primary api helper
import { describe, it, expect, afterEach, vi } from "vitest";

// need to import the app of course!
import App from "./App";

// need to import all the helper functions to test behavior
import {
  getProducts,
  getCartItems,
  updateProduct,
  addProduct,
  deleteProduct,
  checkout,
  addToCart,
} from "./services/products";

// need to import types as well
import { Product, CartItem } from "./types";

vi.mock("./services/products.ts");

const mockedProductService = vi.mocked(
  {
    getProducts,
    getCartItems,
    updateProduct,
    addProduct,
    deleteProduct,
    checkout,
    addToCart,
  },
  true
);

afterEach(() => {
  vi.resetAllMocks();
});

// need to mock products and cart items
const mockProductsData: Product[] = [
  { _id: "1", title: "Product 1", price: 10, quantity: 5 },
  { _id: "2", title: "Product 2", price: 20, quantity: 3 },
];

const mockCartItemsData: CartItem[] = [
  { _id: "1", productId: "1", title: "CartItem 1", price: 10, quantity: 1 },
];

describe("App component", () => {
  // tests "READ" of CRUD for both products and cart items
  it("displays products and cart items on initial render", async () => {
    mockedProductService.getProducts.mockResolvedValue(mockProductsData);
    mockedProductService.getCartItems.mockResolvedValue(mockCartItemsData);

    render(<App />);

    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("Product 2")).toBeInTheDocument();
    expect(await screen.findByText("Your Cart")).toBeInTheDocument();
    expect(await screen.findByText("CartItem 1")).toBeInTheDocument();
  });


  // tests "Create" of CRUD for products
  it("allows adding a product", async () => {
    const newProduct = { _id: "3", title: "Product 3", price: 15, quantity: 4 };
    mockedProductService.getProducts.mockResolvedValue(mockProductsData);
    mockedProductService.getCartItems.mockResolvedValue(mockCartItemsData);
    mockedProductService.addProduct.mockResolvedValue(newProduct);

    render(<App />);

    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("Product 2")).toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: /add a product/i });
    await userEvent.click(addButton);

    const titleInput = screen.getByLabelText(/name/i);
    const priceInput = screen.getByLabelText(/price/i);
    const quantityInput = screen.getByLabelText(/quantity/i);

    await userEvent.type(titleInput, "Product 3");
    await userEvent.type(priceInput, "15");
    await userEvent.type(quantityInput, "4");

    const submitButton = screen.getByRole("button", { name: "Add" });
    await userEvent.click(submitButton);

    expect(await screen.findByText("Product 3")).toBeInTheDocument();
  });

  // tests "Update" of CRUD for products
  it("allows updating a product", async () => {
    const updatedProduct = {
      _id: "1",
      title: "Updated Product 1",
      price: 12,
      quantity: 6,
    };
    mockedProductService.getProducts.mockResolvedValue(mockProductsData);
    mockedProductService.getCartItems.mockResolvedValue(mockCartItemsData);
    mockedProductService.updateProduct.mockResolvedValue(updatedProduct);

    render(<App />);
    const editButton = await screen.findByTestId(`edit-${updatedProduct._id}`);

    await userEvent.click(editButton);

    const titleInput = screen.getByLabelText(/name/i);
    const priceInput = screen.getByLabelText(/price/i);
    const quantityInput = screen.getByLabelText(/quantity/i);

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Product 1");
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "12");
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "6");

    const updateButton = screen.getByRole("button", { name: /update/i });
    await userEvent.click(updateButton);

    expect(await screen.findByText("Updated Product 1")).toBeInTheDocument();
  });

  // tests "Delete" of CRUD for products
  it("allows deleting a product", async () => {
    mockedProductService.getProducts.mockResolvedValue(mockProductsData);
    mockedProductService.getCartItems.mockResolvedValue(mockCartItemsData);
    mockedProductService.deleteProduct.mockResolvedValue(null);

    render(<App />);
    const deletedProdId = mockCartItemsData[0]._id;

    expect(await screen.findByText("Product 1")).toBeInTheDocument();

    const deleteButton = await screen.findByTestId(`delete-${deletedProdId}`);
    await userEvent.click(deleteButton);

    await expect(screen.findByText("Product 1")).rejects.toThrow();
  });

  // tests "Create" of CRUD for cart items
  it("allows adding items to the cart", async () => {
    const addedToCartItem = {
      _id: "2",
      productId: "2",
      title: "Product 2",
      price: 20,
      quantity: 1,
    };
    mockedProductService.getProducts.mockResolvedValue(mockProductsData);
    mockedProductService.getCartItems.mockResolvedValue(mockCartItemsData);
    mockedProductService.addToCart.mockResolvedValue({
      product: mockProductsData[1],
      item: addedToCartItem,
    });

    render(<App />);

    expect(await screen.findByText("Product 2")).toBeInTheDocument();
    await expect(
      screen.findByTestId(`cartItem-${addedToCartItem.title}`)
    ).rejects.toThrow();

    const addToCartButton = screen.getByTestId(
      `add-to-cart-${addedToCartItem._id}`
    );
    await userEvent.click(addToCartButton);
    expect(
      await screen.findByTestId(`cartItem-${addedToCartItem.title}`)
    ).toBeInTheDocument();
  });

  // tests that checkout button works
  it("allows checking out", async () => {
    mockedProductService.getProducts.mockResolvedValue(mockProductsData);
    mockedProductService.getCartItems.mockResolvedValue(mockCartItemsData);
    mockedProductService.checkout.mockResolvedValue(null);

    render(<App />);

    const cartItemTitle = mockCartItemsData[0].title;

    expect(await screen.findByText("Your Cart")).toBeInTheDocument();
    expect(
      await screen.findByTestId(`cartItem-${cartItemTitle}`)
    ).toBeInTheDocument();

    const checkoutButton = screen.getByRole("button", { name: /checkout/i });
    await userEvent.click(checkoutButton);

    expect(await screen.findByText("Your cart is empty")).toBeInTheDocument();
  });
});
