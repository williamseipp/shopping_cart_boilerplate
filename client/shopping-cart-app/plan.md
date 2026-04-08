### add product: what does this mean?

1. `./src/components/AddForm.tsx` 
    renders a form


2. `{ "title": "Keyboard", "price": 50, "quantity": 3 }` 
    payload extracted with controlled component using that form


3. `<div className="actions form-actions">
      <button type="submit">Add</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </div>`         

    the submit button should trigger some function that sends payload to
    api endpoint


4. `import zod
    export const payloadSchema
    export type newProduct = z.infer<typeof payloadSchema>`

need to perform validation that payload is as intended w/ zod



5. the api endpoint in server/api/routes/api.js line 12 that creates new products

`router.post("/products", (req, res, next) => {
  const { title, price, quantity } = req.body;
  Product.create({ title, price, quantity })
    .then((product) => res.json(product))
    .catch((err) => next(err));
});
`


6.  `{
      "_id": "61d754d72092473d55a809e1",
      "title": "Keyboard",
      "price": 50,
      "quantity": 3,
      "createdAt": "2020-10-04T05:57:02.777Z",
      "updatedAt": "2020-10-04T05:57:02.777Z",
      "_v": 0
    }`

this is the response on success


7.  

`
import zod
export const newProductSchema
export type newProduct = z.infer<typeof newProductSchema>
`

validate the response w/ zod


8. confirm product was added: make GET request to this endpoint in browser

`router.get("/products", (req, res, next) => {
  Product.find({})
    .then((products) => res.json(products))
    .catch(next);
});
`


