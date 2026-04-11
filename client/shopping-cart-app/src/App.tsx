import { useEffect, useState } from "react";
import ToggleableAddProductForm from "./components/ToggleableAddProductForm";
import ShoppingCart from "./components/ShoppingCart";
import ProductListing from './components/ProductListing';
import { Product, CartItem, BaseProduct } from "./types";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCartItems,
  addToCart,
  checkout,
} from "./services/products";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // kass
      const data = await getProducts();
      setProducts(data);
    };
    const fetchCartItems = async () => {
      const data = await getCartItems();
      setCartItems(data);
    };

    try {
      // kass
      fetchProducts();
      fetchCartItems();
    } catch (e) {
      console.error(e);
    }
  }, []);


  const handleUpdateProduct = async (
    updatedProduct: BaseProduct,
    productId: string,
    callback?: () => void
  ) => {
    try {
      const data = await updateProduct(updatedProduct, productId);
      setProducts((prevState) => {
        return prevState.map((product) => {
          if (product._id === data._id) {
            return data;
          } else {
            return product;
          }
        });
      });
      if (callback) {
        callback();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleAddProduct = async (
    newProduct: BaseProduct,
    callback?: () => void
  ) => {
    try {
      const data = await addProduct(newProduct);
      setProducts((prevState) => prevState.
        concat(data));
      if (callback) {
        callback();
      }
    } catch (e) {
      console.error(e);
    }
  }
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts((prevState) =>
        prevState.filter((product) => product._id !== productId)
      );
    } catch (e) {
      console.error(e);
    }
  };
  const handleCheckout = async () => {
    try {
      await checkout();
      setCartItems([]);
    } catch (e) {
      console.error(e);
    }
  };
  const handleAddToCart = async (productId: string) => {
    const product = products.find((product) => product.
      _id === productId);
    const existingItem = cartItems.find(
      (cartItem) => cartItem.productId === productId
    );
    if (!product || product.quantity === 0) return;
    try {
      const { product: updatedProduct, item } = await addToCart(productId);
      setProducts((prevState) => {
        return prevState.map((product) => {
          if (product._id === updatedProduct._id) {
            return updatedProduct;
          } else {
            return product;
          }
        });
      });
      setCartItems((prevState) => {
        if (existingItem) {
          return prevState.map((cartItem) => {
            if (cartItem.productId === productId) {
              return item;
            } else {
              return cartItem;
            }
          });
        } else {
          return prevState.concat(item);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="app">
      <ShoppingCart cartItems={cartItems} onCheckout={handleCheckout} />
      <main>
        <ProductListing
          onAddToCart={handleAddToCart}
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
        <ToggleableAddProductForm onAddProduct={handleAddProduct} />
      </main>
    </div>
  );
}

export default App
