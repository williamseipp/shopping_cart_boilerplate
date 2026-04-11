import axios from "axios";
import { BaseProduct } from "../types";
import { z } from "zod";

const productSchema = z.object({
  _id: z.string(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

const cartItemSchema = z.object({
  _id: z.string(),
  productId: z.string(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

const getProductsResponseSchema = z.array(productSchema);
const getCartItemsResponseSchema = z.array(cartItemSchema);
const updateProductResponseSchema = productSchema;
const addProductResponseSchema = productSchema;
const addToCartResponseSchema = z.object({
  product: productSchema,
  item: cartItemSchema,
});

export const getProducts = async () => {
  const { data } = await axios.get("/api/products");
  // kass
  return getProductsResponseSchema.parse(data);
};

export const getCartItems = async () => {
  const { data } = await axios.get("/api/cart");
  return getCartItemsResponseSchema.parse(data);
};

export const updateProduct = async (
  updatedProduct: BaseProduct,
  productId: string
) => {
  const { data } = await axios.put(`/api/products/${productId}`, {
    ...updatedProduct,
  });
  return updateProductResponseSchema.parse(data);
};

export const addProduct = async (newProduct: BaseProduct) => {
  const { data } = await axios.post("/api/products", { ...newProduct });
  return addProductResponseSchema.parse(data);
};

export const deleteProduct = async (productId: string) => {
  await axios.delete(`/api/products/${productId}`);
  return null;
};

export const checkout = async () => {
  await axios.post("/api/checkout");
  return null;
};

export const addToCart = async (productId: string) => {
  const { data } = await axios.post(`/api/add-to-cart`, { productId });
  return addToCartResponseSchema.parse(data);
};
