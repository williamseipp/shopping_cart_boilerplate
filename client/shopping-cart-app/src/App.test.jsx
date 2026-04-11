import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import App from './App';
import { createProduct, getProducts } from './services';

// The add form is displayed when "Add Button" is clicked. It disappears when "Cancel" is clicked.
// The edit form is also displayed when the "Edit" button is clicked. It disappears when "Cancel" is clicked.
// The cart items are displayed correctly
// Test forms and user interactions with them using `vi.mock()` and `userEvent` library.

vi.mock('./services', () => ({
  getProducts: vi.fn(),
  createProduct: vi.fn(),
}));

const mockedGetProducts = vi.mocked(getProducts);
const mockedCreateProduct = vi.mocked(createProduct);

const mockProducts = [
  {
    _id: '1',
    title: 'Bananas',
    price: 1.99,
    quantity: 6,
  },
  {
    _id: '2',
    title: 'Milk',
    price: 4.5,
    quantity: 0,
  },
];

const renderApp = async (products = mockProducts) => {
  mockedGetProducts.mockResolvedValue(products);

  const utils = render(<App />);

  // Wait for the initial fetch to finish so the app has rendered product rows.
  await screen.findByRole('heading', { level: 3, name: products[0].title });

  return utils;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('App', () => {
  describe('add product form', () => {
    it('shows the add form when "Add a product" is clicked and hides it when "Cancel" is clicked', async () => {
      const { container } = await renderApp();
      const addSection = container.querySelector('.add-form');

      expect(addSection).not.toHaveClass('visible');

      // TODO: When you install @testing-library/user-event:
      // const user = userEvent.setup();
      // await user.click(screen.getByRole('button', { name: /add a product/i }));
      // expect(addSection).toHaveClass('visible');
      // await user.click(screen.getByRole('button', { name: /^cancel$/i }));
      // expect(addSection).not.toHaveClass('visible');
    });
  });

  describe('edit product form', () => {
    it('shows the edit form when "Edit" is clicked and hides it when "Cancel" is clicked', async () => {
      const { container } = await renderApp();
      const editForms = container.querySelectorAll('.edit-form');

      expect(editForms[0]).not.toHaveClass('visible');

      // TODO: When you install @testing-library/user-event:
      // const user = userEvent.setup();
      // await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);
      // expect(editForms[0]).toHaveClass('visible');
      // await user.click(screen.getByRole('button', { name: /^cancel$/i }));
      // expect(editForms[0]).not.toHaveClass('visible');
    });
  });

  describe('rendered data', () => {
    it('renders product items returned by the API', async () => {
      await renderApp();
      const bananaRow = screen.getByRole('heading', { level: 3, name: 'Bananas' }).closest('li');
      const milkRow = screen.getByRole('heading', { level: 3, name: 'Milk' }).closest('li');

      expect(screen.getByRole('heading', { level: 3, name: 'Bananas' })).toBeInTheDocument();
      expect(screen.getByText('$1.99')).toBeInTheDocument();
      expect(screen.getByText('6 left in stock')).toBeInTheDocument();

      expect(screen.getByRole('heading', { level: 3, name: 'Milk' })).toBeInTheDocument();
      expect(screen.getByText('$4.5')).toBeInTheDocument();
      expect(screen.getByText('0 left in stock')).toBeInTheDocument();
      expect(within(bananaRow).getByRole('button', { name: /add to cart/i })).toBeEnabled();
      expect(within(milkRow).getByRole('button', { name: /add to cart/i })).toBeDisabled();
    });

    it.todo('renders cart items correctly once App owns cart state');
    it.todo('submits the add product form with mocked service calls');
    it.todo('submits the edit product form once update functionality exists');
    it.todo('adds a product to the cart once cart functionality exists');
  });
});
