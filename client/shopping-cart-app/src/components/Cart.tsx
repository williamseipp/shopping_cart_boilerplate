import type { CartItem } from "../types/index.ts"
import CartItemRow from './CartItemRow'

type CartProps = {
  total: number
  cartItems: CartItem[]
}

const Cart = ({ total, cartItems }: CartProps) => {
  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <table className="cart-items">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <CartItemRow key={item._id} item={item} />
          ))}
        </tbody>


        <tfoot>
          <tr>
            <td colSpan={3} className="total">Total: ${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="checkout-button">
        <button className="checkout">Checkout</button>
      </div>
    </div>
  )
}

export default Cart
