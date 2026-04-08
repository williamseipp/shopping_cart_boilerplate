import type { CartItem } from "../types";

type CartItemRowProps = {
  item: CartItem
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  return (
    <tr>
      <td>{item.title}</td>
      <td>{item.quantity}</td>
      <td>{item.price}</td>
    </tr>
  )
}

export default CartItemRow
