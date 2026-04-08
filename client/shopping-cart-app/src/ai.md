1. Traced the refresh/load path and found that [App.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/App.tsx) calls `getProducts()` from [services/index.ts](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/services/index.ts).

2. Confirmed that `getProducts()` was parsing the response with Zod using `productListSchema.parse(data)`, so the string error meant the HTTP response body was not the expected JSON array.

3. Checked the backend route in `/home/will/shopping_cart_boilerplate/server/routes/api.js` and verified that `GET /api/products` correctly returns an array with `res.json(products)`.

4. Checked the Vite config in `/home/will/shopping_cart_boilerplate/client/shopping-cart-app/vite.config.ts` and found there was no `/api` proxy configured for the frontend dev server.

5. Determined that the frontend request to `"/api/products"` could hit the Vite server during development instead of the Express server, which would return HTML/text. That is why `getProducts()` was receiving a string instead of an array.

6. Fixed the request path in [services/index.ts](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/services/index.ts) by creating an Axios instance with `baseURL: "http://localhost:5001"` so API calls go directly to the Express server.

7. Found a second mismatch in [types/index.ts](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/types/index.ts): the frontend schema expected `id`, but the backend returns Mongo documents with `_id`.

8. Updated the Zod product schema in [types/index.ts](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/types/index.ts) to use `_id`, and separated types for:
   - new product input
   - stored product records returned by the API
   - product lists

9. Fixed [App.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/App.tsx) so fetched products are stored in state and rendered, instead of continuing to render mock data.

10. Fixed async error handling in [App.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/App.tsx). The original outer `try/catch` around `fetchProducts()` would not catch async errors properly, so the error handling was moved inside the async function.

11. Fixed the create-product path in [services/index.ts](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/services/index.ts) to actually `POST` to `/api/products` and return the created product.

12. Fixed [App.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/App.tsx) to append a newly created product to `products` state instead of calling `setComments`, which did not exist in this app.

13. Fixed [components/AddForm.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/AddForm.tsx) because it still used old `NewComment` naming and was submitting string fields instead of a product object with numeric `price` and `quantity`.

14. Fixed product rendering types in:
   - [components/ProductList.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/ProductList.tsx)
   - [components/ProductItemRow.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/ProductItemRow.tsx)
   - [components/EditProductForm.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/EditProductForm.tsx)

15. Fixed [components/Cart.tsx](/home/will/shopping_cart_boilerplate/client/shopping-cart-app/src/components/Cart.tsx) to use its `total` prop so TypeScript would stop flagging it as unused.

16. Ran a no-emit TypeScript check with `./node_modules/.bin/tsc --noEmit -p tsconfig.app.json` and confirmed the client code now typechecks successfully.

Summary of what was wrong:
- The frontend was calling the wrong server in development, so the API response could be HTML/text instead of JSON.
- The frontend schema expected `id`, but the backend returns `_id`.
- The app was still partially wired to old mock/comment code, so the fetched data path was incomplete.

Summary of what resolved it:
- Pointed Axios at the Express server on port `5001`.
- Aligned frontend schemas and component types with the backend response shape.
- Fixed `App.tsx` and the add-product flow to use real product state end-to-end.
