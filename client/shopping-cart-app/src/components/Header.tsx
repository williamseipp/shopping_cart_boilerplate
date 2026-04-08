import type { CartItem } from "../types/index.ts"
import Cart from './Cart'

type HeaderProps = {
  title: string
  cartItems: CartItem[]
}

const Header = ({ title, cartItems }: HeaderProps) => {
  return <header>
    <h1>{title}</h1>
    <Cart total={0} cartItems={cartItems} />
  </header>
}

export default Header
