import axios from "axios";
import {
  productListSchema,
  type Product,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:5001",
});

export const getProducts = async () => {
  const { data } = await api.get("/api/products");
  return productListSchema.parse(data);
};

// export const getMoreReplies = async (commentId: string) => {
//   const { data } = await axios.get(
//     `/api/comment_replies?comment_id=${commentId}`,
//   );
//   return repliesSchema.parse(data);
// };
//
export const createProduct = async (newProduct: Product) => {
  const { data } = await api.post("/api/products", newProduct);
  return data;
};
