import { CartItem } from "../types";
import CartItems from "./CartItems";

interface ShoppingCartProps {
  cartItems: CartItem[];
  onCheckout: () => void;
}

const ShoppingCart = ({ cartItems, onCheckout }: ShoppingCartProps) => {
  return (
    <header>
      <h1>The Shop!</h1>
      <div className="cart">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="cart">
            <p>Your cart is empty</p>
            <p>Total: $0</p>
          </div>
        ) : (
          <CartItems cartItems={cartItems} />
        )}
        <div className="checkout-button">
          <button
            className="checkout"
            disabled={cartItems.length === 0}
            onClick={onCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </header >
  );
};

export default ShoppingCart;
