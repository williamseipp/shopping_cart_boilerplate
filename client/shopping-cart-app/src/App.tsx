import React from "react";
import Header from './components/Header'
import ProductList from './components/ProductList'
import AddProductSection from './components/AddProductSection'
import './App.css'
import { createProduct, getProducts } from "./services";
import type { Product, ProductList as ProductListData } from "./types";
import { ZodError } from "zod";

function App() {
  const [products, setProducts] = React.useState<ProductListData>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e: unknown) {
        if (e instanceof ZodError) {
          console.error("Invalid products response", e.issues);
          return;
        }

        console.error(e);
      }
    };

    void fetchProducts();
  }, []);

  const handleSubmit = async (
    newProduct: Product,
    callback?: () => void,
  ) => {
    try {
      const data = await createProduct(newProduct);
      setProducts((currentProducts: ProductListData) => currentProducts.concat(data));
      if (callback) {
        callback();
      }
    } catch (e: unknown) {
      console.error(e);
    }
  };


  return (
    <div id="app">
      <Header title="the shop!" cartItems={[]} />

      <main>
        <ProductList products={products} />
        <AddProductSection onSubmit={handleSubmit} />
      </main>
    </div>
  )
}

export default App
