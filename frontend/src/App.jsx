import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './core/components/Navigation'
import HomePage from './modules/publicStore/pages/HomePage'
import ProductListPage from './modules/publicStore/pages/ProductListPage'
import ProductDetailPage from './modules/publicStore/pages/ProductDetailPage'
import CartPage from './modules/publicStore/pages/CartPage'
import CheckoutPage from './modules/publicStore/pages/CheckoutPage'
import TrackingPage from './modules/publicStore/pages/TrackingPage'
import RecommenderPage from './modules/publicStore/pages/RecommenderPage'

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductListPage />} />
            <Route path="/productos/:slug" element={<ProductDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/seguimiento/:short_id" element={<TrackingPage />} />
            <Route path="/seguimiento" element={<TrackingPage />} />
            <Route path="/recomendador" element={<RecommenderPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
