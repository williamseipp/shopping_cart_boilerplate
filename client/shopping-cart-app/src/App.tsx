import Header from './components/Header'
import ProductList from './components/ProductList'
import AddProductSection from './components/AddProductSection'
import './App.css'
import { mockProducts, mockCart } from '../../mockData/data.js'

function App() {
  return (

    <div id="app">
      <Header title="the shop!" cartItems={mockCart} />

      <main>
        <ProductList products={mockProducts} />
        <AddProductSection />
      </main>
    </div>
    // implement edit product button click ( edit form should appear below product )
    // page with _edit form
  )
}

export default App
