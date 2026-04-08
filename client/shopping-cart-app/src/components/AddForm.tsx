import React from "react";
import type { Product } from "../types";

interface AddFormProps {
  className: string
  onSubmit: (newProduct: Product, callback?: () => void) => void;
  onCancel: () => void
}

const AddForm = ({ onCancel, onSubmit }: AddFormProps) => {

  const [productName, setProductName] = React.useState("");
  const [productPrice, setProductPrice] = React.useState("");
  const [productQuantity, setProductQuantity] = React.useState("");

  const handleReset = () => {
    setProductName("");
    setProductPrice("");
    setProductQuantity("");
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit(
      {
        title: productName,
        price: Number(productPrice),
        quantity: Number(productQuantity),
      },
      handleReset,
    );
  };


  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="product-name">Product Name:</label>
        <input
          type="text"
          id="product-name"
          name="product-name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="product-price">Price:</label>
        <input
          type="number"
          id="product-price"
          name="product-price"
          min="0"
          step="0.01"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="product-quantity">Quantity:</label>
        <input
          type="number"
          id="product-quantity"
          name="product-quantity"
          min="0"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
          required
        />
      </div>
      <div className="actions form-actions">
        <button type="submit">Add</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default AddForm;

// className of form is 'add-form'
