import { useState } from 'react'
import type { ProductRecord } from '../types/index.ts'
import EditProductForm from './EditProductForm'

type ProductItemRowProps = {
  product: ProductRecord
}

const ProductItemRow = ({ product }: ProductItemRowProps) => {
  const [showEditForm, setShowEditForm] = useState(false)

  // The product item owns this state because it coordinates
  // both the Edit button and the edit form for this one product.
  const toggleEditForm = () => {
    setShowEditForm(current => !current)
  }

  return (
    <li className="product">
      <div className="product-details">
        <h3>{product.title}</h3>
        <p className="price">${product.price}</p>
        <p className="quantity">{product.quantity} left in stock</p>
        <div className="actions product-actions">
          <button className="add-to-cart" disabled={product.quantity === 0}>Add to Cart</button>
          <button className="edit" onClick={toggleEditForm}>Edit</button>
        </div>
        <button className="delete-button"><span>X</span></button>
      </div>

      <div className={showEditForm ? 'edit-form visible' : 'edit-form'}>
        {/*
          The callback is defined here, where the state lives,
          and passed down so the child form can close itself.
        */}
        <EditProductForm product={product} onCancel={toggleEditForm} />
      </div>
    </li>
  )
}

export default ProductItemRow
