import { useState } from "react";
import ProductForm from "./ProductForm";
import { BaseProduct, Product } from "../types";

interface EditProductFormProps extends Product {
  onToggleEdit: () => void;
  onUpdateProduct: (
    updatedProduct: BaseProduct,
    productId: string,
    onToggleEdit: () => void
  ) => void;
}

const EditProductForm = ({
  _id,
  title: propTitle,
  price: propPrice,
  quantity: propQuantity,
  onToggleEdit,
  onUpdateProduct,
}: EditProductFormProps) => {
  const [title, setTitle] = useState(propTitle || "");
  const [price, setPrice] = useState(propPrice || 0);
  const [quantity, setQuantity] = useState(propQuantity || 0);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const updatedProduct = {
      title,
      price,
      quantity,
    };

    onUpdateProduct(updatedProduct, _id, onToggleEdit);
  };

  return (
    <div className="edit-form">
      <h3>Edit Product</h3>
      <ProductForm
        title={title}
        price={price}
        quantity={quantity}
        setTitle={setTitle}
        setPrice={setPrice}
        setQuantity={setQuantity}
        onSubmit={handleSubmit}
        onToggleForm={onToggleEdit}
        buttonLabel="Update"
      />
    </div>
  );
};

export default EditProductForm;
