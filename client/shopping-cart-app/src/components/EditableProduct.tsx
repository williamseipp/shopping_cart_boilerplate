import { useState } from "react";
import { BaseProduct, Product } from "../types";
import EditProductForm from "./EditProductForm";
import ProductDetails from "./ProductDetails";

interface EditableProductProps {
  product: Product;
  onUpdateProduct: (
    updatedProduct: BaseProduct,
    productId: string,
    onToggleEdit: () => void
  ) => void;
  onDeleteProduct: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const EditableProduct = ({
  product,
  onUpdateProduct,
  onDeleteProduct,
  onAddToCart,
}: EditableProductProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <li className="product">
      <ProductDetails
        {...product}
        onToggleEdit={handleToggleEdit}
        onDeleteProduct={onDeleteProduct}
        onAddToCart={onAddToCart}
      />
      {isEditing ? (
        <EditProductForm
          {...product}
          onToggleEdit={handleToggleEdit}
          onUpdateProduct={onUpdateProduct}
        />
      ) : null}
    </li>
  );
};

export default EditableProduct;
