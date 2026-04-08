import ProductItemRow from './ProductItemRow'
import type { ProductItem } from "./../types/index.ts"

const ProductList = () => {
  console.log('foo fi fo fum');

  return (
    <div className="product-list">
      <h2>Products</h2>
      <ul className="product-list">

        <li className="product">
          <div className="product-details">
            <h3>Amazon Kindle E-reader</h3>
            <p className="price">$79.99</p>
            <p className="quantity">5 left in stock</p>
            <div className="actions product-actions">
              <button className="add-to-cart">Add to Cart</button>
              <button className="edit">Edit</button>
            </div>
            <button className="delete-button"><span>X</span></button>
          </div>
        </li>

        <li className="product">
          <div className="product-details">
            <h3>Apple 10.5-Inch iPad Pro</h3>
            <p className="price">$649.99</p>
            <p className="quantity">2 left in stock</p>
            <div className="actions product-actions">
              <button className="add-to-cart">Add to Cart</button>
              <button className="edit">Edit</button>
            </div>
            <button className="delete-button"><span>X</span></button>
          </div>
        </li>

        <li className="product">
          <div className="product-details">
            <h3>Yamaha Portable Keyboard</h3>
            <p className="price">$155.99</p>
            <p className="quantity">0 left in stock</p>
            <div className="actions product-actions">
              <button className="add-to-cart" disabled>Add to Cart</button>
              <button className="edit">Edit</button>
            </div>
            <button className="delete-button"><span>X</span></button>
          </div>
        </li>

      </ul>
    </div>
  )
}

export default ProductList
