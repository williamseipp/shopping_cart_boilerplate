import { BaseProduct, Product } from "../types";
import EditableProduct from "./EditableProduct";

interface ProductListingProps {
  products: Product[];
  onUpdateProduct: (
    updatedProduct: BaseProduct,
    productId: string,
    onToggleEdit: () => void
  ) => void;
  onDeleteProduct: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const ProductListing = ({
  products,
  onUpdateProduct,
  onDeleteProduct,
  onAddToCart,
}: ProductListingProps) => {
  return (
    <div className="product-listing">
      <h2>Products</h2>
      <ul className="product-list">
        {products.map((product) => (
          <EditableProduct
            key={product._id}
            product={product}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProductListing;
