import type { ProductRecord } from '../types/index.ts'

type EditProductFormProps = {
  product: ProductRecord
  onCancel: () => void
}

const EditProductForm = ({ product, onCancel }: EditProductFormProps) => {
  return (
    <>
      <h3>Edit Product</h3>
      <form>
        <div className="input-group">
          <label htmlFor={`product-name-${product._id}`}>Product Name</label>
          <input
            type="text"
            id={`product-name-${product._id}`}
            defaultValue={product.title}
            aria-label="Product Name"
          />
        </div>

        <div className="input-group">
          <label htmlFor={`product-price-${product._id}`}>Price</label>
          <input
            type="number"
            id={`product-price-${product._id}`}
            defaultValue={product.price}
            aria-label="Product Price"
          />
        </div>

        <div className="input-group">
          <label htmlFor={`product-quantity-${product._id}`}>Quantity</label>
          <input
            type="number"
            id={`product-quantity-${product._id}`}
            defaultValue={product.quantity}
            aria-label="Product Quantity"
          />
        </div>

        <div className="actions form-actions">
          <button type="submit">Update</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </>
  )
}

export default EditProductForm
