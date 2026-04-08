export interface Product {
  _id: string;
  title: string;
  quantity: number
  price: number;
}

export interface CartItem {
  _id: string;
  productId: string;
  title: string;
  quantity: number
  price: number;
}
