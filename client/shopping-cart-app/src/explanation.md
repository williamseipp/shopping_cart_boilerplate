Here is the prop flow, top to bottom, with the exact handoff points.

----

`App.tsx` is where the props object for `ProductListing` is created:

```tsx
const handleUpdateProduct = async (
  updatedProduct: BaseProduct,
  productId: string,
  callback?: () => void
) => {
  try {
    const data = await updateProduct(updatedProduct, productId);

    setProducts((prevState) => {
      return prevState.map((product) => {
        if (product._id === data._id) {
          return data;
        } else {
          return product;
        }
      });
    });

    if (callback) {
      callback();
    }
  } catch (e) {
    console.error(e);
  }
};

const handleDeleteProduct = async (productId: string) => {
  try {
    await deleteProduct(productId);
    setProducts((prevState) =>
      prevState.filter((product) => product._id !== productId)
    );
  } catch (e) {
    console.error(e);
  }
};

const handleAddToCart = async (productId: string) => {
  // omitted here for brevity, but this is another callback passed down
};

return (
  <ProductListing
    onAddToCart={handleAddToCart}
    products={products}
    onUpdateProduct={handleUpdateProduct}
    onDeleteProduct={handleDeleteProduct}
  />
);
```

The important mental model is: React is calling `ProductListing(...)` with one object. That object is effectively:

```tsx
{
  products: products,
  onUpdateProduct: handleUpdateProduct,
  onDeleteProduct: handleDeleteProduct,
  onAddToCart: handleAddToCart
}
```

So `onUpdateProduct` is not a nested object. It is just one property on the props object, and that property’s value is a function. The “nested-looking” part is only the type annotation for that function signature: it says that this prop must be a function that accepts `updatedProduct`, `productId`, and `onToggleEdit`.

You can see this in [App.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/App.tsx:41) and the JSX pass in [App.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/App.tsx:137).

----

`ProductListing.tsx` receives that one props object and immediately destructures it:

```tsx
interface ProductListingProps {
  products: Product[];
  onUpdateProduct: (
    updatedProduct: BaseProduct,
    productId: string,
    onToggleEdit: () => void
  ) => void;
  onDeleteProduct: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const ProductListing = ({
  products,
  onUpdateProduct,
  onDeleteProduct,
  onAddToCart,
}: ProductListingProps) => {
  return (
    <div className="product-listing">
      <h2>Products</h2>
      <ul className="product-list">
        {products.map((product) => (
          <EditableProduct
            key={product._id}
            product={product}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </ul>
    </div>
  );
};
```

So `ProductListing` does not itself call `onUpdateProduct`. It mostly forwards it. It takes the function it got from `App`, then passes that same function down to each `EditableProduct`. This is the prop drilling you were asking about.

See [ProductListing.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/ProductListing.tsx:4).

----

`EditableProduct.tsx` receives one `product` object plus the callback props, and then splits responsibility between display and editing:

```tsx
interface EditableProductProps {
  product: Product;
  onUpdateProduct: (
    updatedProduct: BaseProduct,
    productId: string,
    onToggleEdit: () => void
  ) => void;
  onDeleteProduct: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const EditableProduct = ({
  product,
  onUpdateProduct,
  onDeleteProduct,
  onAddToCart,
}: EditableProductProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <li className="product">
      <ProductDetails
        {...product}
        onToggleEdit={handleToggleEdit}
        onDeleteProduct={onDeleteProduct}
        onAddToCart={onAddToCart}
      />
      {isEditing ? (
        <EditProductForm
          {...product}
          onToggleEdit={handleToggleEdit}
          onUpdateProduct={onUpdateProduct}
        />
      ) : null}
    </li>
  );
};
```

This component introduces `handleToggleEdit`, which is local state logic for opening and closing the edit form. That function is important because it becomes the third argument eventually passed into `onUpdateProduct`.

So now the chain is:

`App.handleUpdateProduct` -> passed to `ProductListing` as `onUpdateProduct` -> passed to `EditableProduct` as `onUpdateProduct` -> passed to `EditProductForm` as `onUpdateProduct`

See [EditableProduct.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/EditableProduct.tsx:6).

----

`EditProductForm.tsx` is where `onUpdateProduct` is finally called:

```tsx
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
    <div className="edit-form visible">
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
```

This is the part that makes the third parameter click into place. `onUpdateProduct(updatedProduct, _id, onToggleEdit)` means:

- first argument: the new product data
- second argument: which product to update
- third argument: what to do after the update succeeds

That third argument is a callback function. In `App.tsx`, it is named `callback?: () => void`, and if it exists, `App` runs it after the server update succeeds:

```tsx
if (callback) {
  callback();
}
```

In this case, that callback is `onToggleEdit`, so after the product saves successfully, the edit form closes.

See [EditProductForm.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/EditProductForm.tsx:5) and [App.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/App.tsx:41).

----

`ProductDetails.tsx` handles the simpler callbacks:

```tsx
const ProductDetails = ({
  _id,
  title,
  price,
  quantity,
  onToggleEdit,
  onDeleteProduct,
  onAddToCart,
}: ProductDetailsProps) => {
  const handleDelete = () => {
    onDeleteProduct(_id);
  };

  return (
    <div className="product-details">
      <h3>{title}</h3>
      <p className="price">${price}</p>
      <p className="quantity">{quantity} left in stock</p>

      <div className="actions product-actions">
        <button onClick={() => onAddToCart(_id)}>
          Add to Cart
        </button>

        <button onClick={onToggleEdit}>
          Edit
        </button>
      </div>

      <button onClick={handleDelete}>
        <span>X</span>
      </button>
    </div>
  );
};
```

This one is more straightforward:

- `onAddToCart(_id)` sends the current product id upward
- `onDeleteProduct(_id)` sends the current product id upward
- `onToggleEdit()` is local UI behavior from `EditableProduct`, not from `App`

So some props travel all the way from `App`, while `onToggleEdit` is created locally inside `EditableProduct` and passed downward only to the components that need it.

See [ProductDetails.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/ProductDetails.tsx:3).

----

If I compress the whole thing into one sentence: `App` owns the real data-changing functions, `ProductListing` forwards them, `EditableProduct` adds local edit-state behavior, and `EditProductForm` calls `onUpdateProduct(updatedProduct, _id, onToggleEdit)` so `App` can update the product and then close the form.

If you want, I can next rewrite this exact flow as a tiny “who creates what / who passes what / who calls what” table, which is often the cleanest mental model for prop drilling.

----

Yes. The field-level event handlers live near the form elements, but they often trigger behavior that was defined higher in the component tree.

----

In this app, there are really two different layers of behavior happening at once.

At the input level, `ProductForm.tsx` handles browser events like `onChange` and `onClick`. Those are the immediate event handlers attached to actual DOM elements. For example, when you type into the title input, this runs:

```tsx
onChange={(e) => setTitle(e.target.value)}
```

That updates state owned by the parent form component, such as `AddProductForm` or `EditProductForm`.

Then, at submit time, the form component calls a prop like `onAddProduct(...)` or `onUpdateProduct(...)`, and those functions came from higher up the tree. So yes, the local event handlers eventually trigger higher-level behavior in `App.tsx`, but they usually do it through one or two intermediate components.

So the pattern is:

1. A DOM event happens in a low-level component like `ProductForm`.
2. That low-level component calls a setter or callback it received in props.
3. A parent form component packages the current form state into an object.
4. That parent form component calls a higher-level function from `App.tsx`.
5. `App.tsx` performs the real app logic: API call, state update, rerender.

----

Here is the “who owns which state” mental model for this codebase.

`App.tsx`
Owns the application-level state.
It owns `products` and `cartItems`.
It also owns the major app behaviors: add product, update product, delete product, add to cart, checkout.

`ToggleableAddProductForm.tsx`
Owns only whether the add form is visible.
It has `isVisible`.

`AddProductForm.tsx`
Owns temporary form input state for creating a new product.
It has `title`, `price`, and `quantity` for the add form.

`EditableProduct.tsx`
Owns only whether one product is currently in edit mode.
It has `isEditing`.

`EditProductForm.tsx`
Owns temporary form input state for editing an existing product.
It has its own local `title`, `price`, and `quantity` initialized from the product prop.

`ProductForm.tsx`
Owns no state.
It is a presentational form component.
It receives values, setter functions, and submit/cancel handlers through props.

`ProductListing.tsx`
Owns no state.
It mostly forwards props downward.

`ProductDetails.tsx`
Owns no state.
It renders product info and triggers callbacks.

That is the real division: app-wide state high up, temporary UI/form state near where it is used, and pure display components in the middle or bottom.

----

And yes, props are not limited to plain data like strings and numbers. A prop can be any JavaScript value:

- string
- number
- boolean
- array
- object
- function
- even JSX

So when you see this:

```tsx
<ProductListing
  products={products}
  onUpdateProduct={handleUpdateProduct}
  onDeleteProduct={handleDeleteProduct}
  onAddToCart={handleAddToCart}
/>
```

React is just passing one object into `ProductListing`. That object contains both data and functions. Conceptually it is:

```tsx
{
  products: [...],
  onUpdateProduct: handleUpdateProduct,
  onDeleteProduct: handleDeleteProduct,
  onAddToCart: handleAddToCart
}
```

So the important shift is this: props are not “just data for display.” Props are the communication channel between components. Sometimes they carry data. Sometimes they carry functions. Often they carry both.

----

The interfaces make this feel heavier than it really is, because they describe the shape very explicitly. But under the surface, the mechanism is simple:

A component receives one props object.
The interface just tells TypeScript what keys that object must have and what types those values must be.

So this:

```tsx
interface ProductListingProps {
  products: Product[];
  onUpdateProduct: (
    updatedProduct: BaseProduct,
    productId: string,
    onToggleEdit: () => void
  ) => void;
  onDeleteProduct: (productId: string) => void;
}
```

is just TypeScript saying:

“`ProductListing` will receive a props object with a `products` property and some function properties, and those functions must have these parameter types.”

That is all. The interface is not adding runtime behavior. It is only describing the object shape ahead of time.

----

A compact mental model that may help:

- State lives where it needs to be owned.
- Display lives where it needs to be rendered.
- Functions are passed down so lower components can ask higher components to do work.
- Interfaces only describe that arrangement; they do not create it.

----

ASCII map of this component tree:

```text
App
|
+-- products state
+-- cartItems state
+-- handleAddProduct()
+-- handleUpdateProduct()
+-- handleDeleteProduct()
+-- handleAddToCart()
+-- handleCheckout()
|
+-- ShoppingCart
|
+-- ProductListing
|   |
|   +-- receives:
|   |   products
|   |   onUpdateProduct
|   |   onDeleteProduct
|   |   onAddToCart
|   |
|   +-- maps over products
|       |
|       +-- EditableProduct (one per product)
|           |
|           +-- local state: isEditing
|           +-- local function: handleToggleEdit()
|           |
|           +-- ProductDetails
|           |   |
|           |   +-- displays title/price/quantity
|           |   +-- calls onAddToCart(_id)
|           |   +-- calls onDeleteProduct(_id)
|           |   +-- calls onToggleEdit()
|           |
|           +-- EditProductForm (only when isEditing === true)
|               |
|               +-- local state: title, price, quantity
|               +-- calls onUpdateProduct(updatedProduct, _id, onToggleEdit)
|               |
|               +-- ProductForm
|                   |
|                   +-- no state of its own
|                   +-- renders inputs
|                   +-- onChange -> setTitle/setPrice/setQuantity
|                   +-- onSubmit -> handleSubmit
|
+-- ToggleableAddProductForm
    |
    +-- local state: isVisible
    |
    +-- AddProductForm (only when isVisible === true)
        |
        +-- local state: title, price, quantity
        +-- calls onAddProduct(newProduct, onToggleForm)
        |
        +-- ProductForm
            |
            +-- no state of its own
            +-- renders inputs
            +-- onChange -> setTitle/setPrice/setQuantity
            +-- onSubmit -> handleSubmit
```

----

ASCII event flow for editing a product:

```text
User types in input
    |
    v
ProductForm onChange
    |
    v
setTitle / setPrice / setQuantity
    |
    v
EditProductForm local state updates
    |
    v
User clicks "Update"
    |
    v
EditProductForm handleSubmit()
    |
    v
onUpdateProduct(updatedProduct, _id, onToggleEdit)
    |
    v
App.handleUpdateProduct()
    |
    v
API request + setProducts(...)
    |
    v
callback() runs
    |
    v
onToggleEdit()
    |
    v
EditableProduct closes the edit form
```

----

ASCII event flow for adding a product:

```text
User types in input
    |
    v
ProductForm onChange
    |
    v
setTitle / setPrice / setQuantity
    |
    v
AddProductForm local state updates
    |
    v
User clicks "Add"
    |
    v
AddProductForm handleSubmit()
    |
    v
onAddProduct(newProduct, onToggleForm)
    |
    v
App.handleAddProduct()
    |
    v
API request + setProducts(...)
    |
    v
callback() runs
    |
    v
onToggleForm()
    |
    v
ToggleableAddProductForm closes the add form
```
