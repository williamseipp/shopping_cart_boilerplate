import { CartItem } from "../types";

export const calculateTotal = (cartItems: CartItem[]) => {
  return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
};
