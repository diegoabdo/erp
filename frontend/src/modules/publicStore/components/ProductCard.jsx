import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaCheck, FaShoppingBag, FaStar } from 'react-icons/fa'
import cartService from '../services/cartService'

const formatPrice = (value) => Number(value || 0).toFixed(2)

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false)
  const tags = Array.isArray(product.tags) ? product.tags.slice(0, 2) : []

  const handleAddToCart = () => {
    cartService.addItem(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="product-card">
      <Link to={`/productos/${product.slug}`} className="product-media">
        {product.image ? <img src={product.image} alt={product.name} /> : <span>Vista previa</span>}
      </Link>

      <div className="product-body d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <div className="tag-row mb-2">
              {product.is_featured && (
                <span className="pill">
                  <FaStar /> Destacado
                </span>
              )}
              <span className={`status-pill ${product.stock <= 0 ? 'danger' : product.stock < 5 ? 'warn' : ''}`}>
                {product.stock <= 0 ? 'Sin stock' : `${product.stock} disponibles`}
              </span>
            </div>
            <h3 className="h5 mb-1 fw-bold">{product.name}</h3>
            <p className="muted-copy mb-0">
              {product.description ? `${product.description.slice(0, 100)}${product.description.length > 100 ? '...' : ''}` : 'Regalo listo para personalizar y enviar.'}
            </p>
          </div>
        </div>

        <div className="meta-row">
          {product.category_name && <span className="pill">{product.category_name}</span>}
          {product.occasion && <span className="pill">{product.occasion}</span>}
          {tags.map((tag) => (
            <span key={tag} className="pill">{tag}</span>
          ))}
        </div>

        <div className="price-row mt-auto">
          <div>
            <div className="muted-copy small">Precio base</div>
            <div className="price-main">${formatPrice(product.price)}</div>
          </div>
        </div>

        <div className="product-actions">
          <Link to={`/productos/${product.slug}`} className="btn-ghost text-center">
            Ver detalle <FaArrowRight className="ms-2" />
          </Link>
          <button
            type="button"
            className={added ? 'btn-slate' : 'btn-emerald'}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {added ? <FaCheck /> : <FaShoppingBag />} {added ? 'Agregado' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}
