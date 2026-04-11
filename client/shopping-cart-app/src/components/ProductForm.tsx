interface ProductFormProps {
  title: string;
  price: number;
  quantity: number;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (e: React.SyntheticEvent) => void;
  onToggleForm: () => void;
  buttonLabel: string;
}

const ProductForm = ({
  title,
  price,
  quantity,
  setTitle,
  setPrice,
  setQuantity,
  onSubmit,
  onToggleForm,
  buttonLabel,
}: ProductFormProps) => {
  return (
    <form>
      <div className="input-group">
        <label htmlFor="product-name">Product Name:</label>
        <input
          type="text"
          id="product-name"
          name="product-name"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          required
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="product-quantity">Quantity:</label>
        <input
          type="number"
          id="product-quantity"
          name="product-quantity"
          min="0"
          required
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
        />
      </div>
      <div className="actions form-actions">
        <button type="submit" onClick={onSubmit}>
          {buttonLabel}
        </button>
        <button type="button" onClick={onToggleForm}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
