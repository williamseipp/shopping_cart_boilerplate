import { useState } from "react";
import { BaseProduct } from "../types";
import ProductForm from "./ProductForm";

interface AddProductFormProps {
   onToggleForm: () => void;
   onAddProduct: (product: BaseProduct, onToggleForm: () => void) => void;
}

const AddProductForm = ({
   onToggleForm,
   onAddProduct,
}: AddProductFormProps) => {
   const [title, setTitle] = useState("");
   const [price, setPrice] = useState(0);
   const [quantity, setQuantity] = useState(0);

   const handleSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();
      const newProduct = {
         title,
         price,
         quantity,
      };
      onAddProduct(newProduct, onToggleForm);
   };

   return (
      <div className="add-form">
         <ProductForm
            title={title}
            price={price}
            quantity={quantity}
            setTitle={setTitle}
            setPrice={setPrice}
            setQuantity={setQuantity}
            onSubmit={handleSubmit}
            onToggleForm={onToggleForm}
            buttonLabel="Add"
         />
      </div>
   );
};

export default AddProductForm;
