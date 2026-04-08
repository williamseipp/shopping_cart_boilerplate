import { useState } from 'react'
import AddForm from './AddForm'
import Button from './Button'
import type { Product } from "../types";

interface AddProductSectionProps {
  onSubmit: (newProduct: Product, callback?: () => void) => void;
}

const AddProductSection = ({ onSubmit }: AddProductSectionProps) => {
  const [showForm, setShowForm] = useState(false);

  const toggleVisible = () => setShowForm(current => !current)

  return (
    <div className={showForm ? "add-form visible" : "add-form"}>
      <Button className="add-product-button" onClick={toggleVisible}>
        Add a product
      </Button>
      <AddForm className="add-form" onSubmit={onSubmit} onCancel={toggleVisible} />
    </div>
  )
}

export default AddProductSection;
