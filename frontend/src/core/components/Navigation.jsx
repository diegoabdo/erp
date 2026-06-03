import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaGift, FaHome, FaSearch, FaShoppingCart, FaTruck } from 'react-icons/fa'
import cartService from '../../modules/publicStore/services/cartService'

const navItems = [
  { to: '/', label: 'Inicio', icon: FaHome },
  { to: '/productos', label: 'Catálogo', icon: FaSearch },
  { to: '/recomendador', label: 'Recomendador', icon: FaGift },
  { to: '/seguimiento', label: 'Seguimiento', icon: FaTruck },
]

export default function Navigation() {
  const [itemCount, setItemCount] = useState(cartService.getItemCount())

  useEffect(() => {
    const syncCount = () => setItemCount(cartService.getItemCount())

    window.addEventListener('storage', syncCount)
    window.addEventListener('cart-updated', syncCount)

    return () => {
      window.removeEventListener('storage', syncCount)
      window.removeEventListener('cart-updated', syncCount)
    }
  }, [])

  return (
    <div className="topbar-wrap">
      <nav className="topbar navbar navbar-expand-xl">
        <div className="container-fluid px-0 gap-3">
          <Link className="d-flex align-items-center gap-3" to="/">
            <div className="brand-mark">
              <FaGift />
            </div>
            <div className="brand-copy">
              <span className="brand-kicker">Giftora</span>
            </div>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <div className="navbar-nav nav-pills ms-auto me-xl-3">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
                >
                  <Icon />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>

            <Link to="/carrito" className="cart-chip mt-3 mt-xl-0">
              <FaShoppingCart />
              <span>Mi carrito</span>
              <span className="cart-chip-count">{itemCount}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
