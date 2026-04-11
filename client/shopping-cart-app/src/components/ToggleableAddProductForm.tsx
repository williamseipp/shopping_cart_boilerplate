import { useState } from "react";
import AddProductForm from "./AddProductForm";
import { BaseProduct } from "../types";

interface ToggleableAddProductFormProps {
   onAddProduct: (product: BaseProduct, onToggleForm: () => void) => void;
}

const ToggleableAddProductForm = ({
   onAddProduct,
}: ToggleableAddProductFormProps) => {
   const [isVisible, setIsVisible] = useState(false);
   const handleToggleForm = () => {
      setIsVisible(!isVisible);
   };
   return (
      <>
         {isVisible ? (
            <AddProductForm
               onToggleForm={handleToggleForm}
               onAddProduct={onAddProduct}
            />
         ) : (
            <p>
               <button className="add-product-button" onClick={handleToggleForm}>
                  Add A Product
               </button>
            </p>
         )}
      </>
   );
};

export default ToggleableAddProductForm;
