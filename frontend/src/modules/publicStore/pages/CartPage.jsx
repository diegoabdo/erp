import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaMinusCircle, FaPlusCircle, FaTrash } from 'react-icons/fa'
import cartService from '../services/cartService'

const formatPrice = (value) => Number(value || 0).toFixed(2)

export default function CartPage() {
  const [cart, setCart] = useState(cartService.getCart())

  useEffect(() => {
    const syncCart = () => setCart(cartService.getCart())
    window.addEventListener('cart-updated', syncCart)
    return () => window.removeEventListener('cart-updated', syncCart)
  }, [])

  const updateQuantity = (index, next) => {
    cartService.updateQuantity(index, next)
    setCart(cartService.getCart())
  }

  const removeItem = (index) => {
    cartService.removeItem(index)
    setCart(cartService.getCart())
  }

  const clearCart = () => {
    cartService.clearCart()
    setCart(cartService.getCart())
  }

  if (cart.items.length === 0) {
    return (
      <div className="page-container">
        <div className="hero-panel text-center">
          <h1 className="page-title mb-3">Tu carrito está vacío</h1>
          <p className="page-copy mb-4">Aún no has agregado productos. Explora el catálogo y arma tu pedido cuando quieras.</p>
          <Link to="/productos" className="btn-emerald">Ir al catálogo</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container d-flex flex-column gap-4">
      <section className="hero-panel">
        <div className="section-head mb-0">
          <div>
            <span className="eyebrow">Resumen de compra</span>
            <h1 className="page-title mt-3">Revisa tu pedido antes de continuar.</h1>
            <p className="page-copy mt-3 mb-0">Aquí puedes ajustar cantidades, quitar productos y confirmar el total antes de pasar al checkout.</p>
          </div>
          <div className="metric-card">
            <div className="metric-label">Productos en carrito</div>
            <p className="metric-value">{cart.items.length}</p>
            <div className="metric-meta">Total ${formatPrice(cart.total)}</div>
          </div>
        </div>
      </section>

      <section className="row g-4">
        <div className="col-lg-8">
          <div className="panel p-0 overflow-hidden">
            <div className="table-shell table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item, index) => (
                    <tr key={`${item.type}-${item.id}`}>
                      <td>
                        <div className="fw-bold">{item.name}</div>
                        <div className="muted-copy small">${formatPrice(item.price)} por unidad</div>
                      </td>
                      <td><span className="pill">{item.type === 'bundle' ? 'Combo' : 'Producto'}</span></td>
                      <td>
                        <div className="inline-actions align-items-center">
                          <button type="button" className="btn-soft px-3" onClick={() => updateQuantity(index, item.quantity - 1)}>
                            <FaMinusCircle />
                          </button>
                          <span className="fw-bold px-2">{item.quantity}</span>
                          <button type="button" className="btn-soft px-3" onClick={() => updateQuantity(index, item.quantity + 1)}>
                            <FaPlusCircle />
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold">${formatPrice(item.price * item.quantity)}</td>
                      <td className="text-end">
                        <button type="button" className="btn-danger-soft px-3" onClick={() => removeItem(index)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="summary-card">
            <div className="panel-title">Resumen del pedido</div>
            <div className="summary-line"><span>Subtotal</span><strong>${formatPrice(cart.subtotal)}</strong></div>
            <div className="summary-line"><span>Envío</span><strong>$0.00</strong></div>
            <hr />
            <div className="summary-line"><span className="fw-bold">Total</span><span className="summary-total">${formatPrice(cart.total)}</span></div>
            <div className="d-grid gap-2 mt-4">
              <Link to="/checkout" className="btn-emerald text-center">Continuar con la compra</Link>
              <Link to="/productos" className="btn-ghost text-center">Seguir viendo productos</Link>
              <button type="button" className="btn-danger-soft" onClick={clearCart}>Vaciar carrito</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
