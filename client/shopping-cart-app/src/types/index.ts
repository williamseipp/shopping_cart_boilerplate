export interface Product {
  _id: string;
  title: string;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  _v?: number;
}

export type BaseProduct = Omit<Product, "_id">;

export interface CartItem extends Product {
  productId: string;
}
