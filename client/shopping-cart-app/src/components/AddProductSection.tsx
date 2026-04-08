import { useState } from 'react'
import AddForm from './AddForm'
import Button from './Button'

const AddProductSection = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleVisible = () => setShowForm(current => !current)

  return (
    <div className={showForm ? "add-form visible" : "add-form"}>
      <Button className="add-product-button" onClick={toggleVisible}>
        Add a product
      </Button>
      <AddForm className="add-form" onCancel={toggleVisible}>
      </AddForm >
    </div>
  )
}

export default AddProductSection;
