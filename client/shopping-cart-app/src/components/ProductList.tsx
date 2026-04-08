import ProductItemRow from './ProductItemRow'
import type { Product } from '../types/index.ts'

type ProductListProps = {
  products: Product[]
}

const ProductList = ({ products }: ProductListProps) => {
  console.log(`fiooooo ${products}`);

  return (
    <div className="product-list">
      <h2>Products</h2>
      <ul className="product-list">
        {products.map((product) => (
          <ProductItemRow key={product._id} product={product} />
        ))}
      </ul>
    </div>
  )
}

export default ProductList
