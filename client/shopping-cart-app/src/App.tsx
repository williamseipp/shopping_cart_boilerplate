import { useContext, useEffect, useReducer } from "react";
import ToggleableAddProductForm from "./components/ToggleableAddProductForm";
import ShoppingCart from "./components/ShoppingCart";
import ProductListing from './components/ProductListing';
import productsReducer from "./reducers/productsReducer.tsx"
import cartItemsReducer from "./reducers/cartItemsReducer.tsx"
import { Product, CartItem, BaseProduct } from "./types";
import { ThemeContext } from "./providers/ThemeProvider.jsx";

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
  const [products, dispatchProducts] = useReducer(productsReducer, [] as Product[]);
  const [cartItems, dispatchCartItems] = useReducer(cartItemsReducer, [] as CartItem[]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      dispatchProducts({
        type: 'productsLoaded',
        payload: data,
      });
    };
    const fetchCartItems = async () => {
      const data = await getCartItems();
      dispatchCartItems({
        type: 'cartItemsLoaded',
        payload: data,
      });
    };

    try {
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
      dispatchProducts({
        type: 'updateProduct',
        payload: data,
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
      dispatchProducts({
        type: 'addProduct',
        payload: data,
      });

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
      dispatchProducts({
        type: 'deleteProduct',
        payload: productId,
      });
    } catch (e) {
      console.error(e);
    }
  };
  const handleCheckout = async () => {
    try {
      await checkout();
      dispatchCartItems({
        type: 'cartItemsCheckedOut',
      });
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
      dispatchProducts({
        type: "updateProduct",
        payload: updatedProduct,
      });
      if (existingItem) {
        dispatchCartItems({
          type: "updateCartItem",
          payload: item,
        });
      } else {
        dispatchCartItems({
          type: "addCartItem",
          payload: item,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="app" data-theme={theme}>    <!-- data attr for theme -->
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
