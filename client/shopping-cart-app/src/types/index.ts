import { z } from "zod";

const productSchema = z.object({
  _id: z.string(),
  title: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const productListSchema = z.array(productSchema);

export const cartItemSchema = productSchema.extend({
  productId: z.string(),
});

const newProductSchema = productSchema.pick({
  title: true,
  quantity: true,
  price: true,
});

export const createProductSchema = z.object({
  title: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export type Product = z.infer<typeof newProductSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ProductRecord = z.infer<typeof productSchema>;
export type ProductList = z.infer<typeof productListSchema>;


// export interface Product {
//   _id: string;
//   title: string;
//   quantity: number
//   price: number;
// }
//
// export interface CartItem {
//   _id: string;
//   productId: string;
//   title: string;
//   quantity: number
//   price: number;
// }
//
//
