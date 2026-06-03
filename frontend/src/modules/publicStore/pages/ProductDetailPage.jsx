import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCheck, FaGift, FaShoppingBag, FaStar } from 'react-icons/fa'
import publicStoreService from '../services/publicStoreService'
import cartService from '../services/cartService'

const formatPrice = (value) => Number(value || 0).toFixed(2)

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await publicStoreService.getProductDetail(slug)
        setProduct(data)
      } catch (error) {
        console.error('Error cargando producto:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return
    }

    const safeQuantity = Math.min(quantity, product.stock)
    for (let index = 0; index < safeQuantity; index += 1) {
      cartService.addItem(product)
    }

    setSuccessMessage(`${safeQuantity} unidad${safeQuantity !== 1 ? 'es' : ''} agregadas al carrito.`)
    setTimeout(() => setSuccessMessage(''), 2000)
    setQuantity(1)
  }

  if (loading) {
    return <div className="page-container"><div className="panel text-center">Cargando información del producto...</div></div>
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="panel text-center">
          <h1 className="page-title mb-3">No encontramos este producto</h1>
          <p className="page-copy">Es posible que ya no esté disponible o que el enlace haya cambiado. Puedes volver al catálogo y seguir explorando.</p>
          <button type="button" className="btn-emerald" onClick={() => navigate('/productos')}>
            <FaArrowLeft className="me-2" /> Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  const tags = Array.isArray(product.tags) ? product.tags : []

  return (
    <div className="page-container d-flex flex-column gap-4">
      <div>
        <Link to="/productos" className="btn-soft">
          <FaArrowLeft className="me-2" /> Volver al catálogo
        </Link>
      </div>

      <section className="row g-4 align-items-stretch">
        <div className="col-lg-6">
          <div className="hero-panel h-100 d-flex align-items-center justify-content-center">
            <div className="w-100">
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ borderRadius: '22px', width: '100%', maxHeight: '520px', objectFit: 'cover' }} />
              ) : (
                <div className="product-media" style={{ minHeight: '420px', borderRadius: '22px' }}>
                  <span>Imagen no disponible</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="panel h-100 d-flex flex-column gap-4">
            <div>
              <div className="tag-row mb-3">
                {product.is_featured && (
                  <span className="pill">
                    <FaStar /> Recomendado
                  </span>
                )}
                <span className={`status-pill ${product.stock <= 0 ? 'danger' : product.stock < 5 ? 'warn' : ''}`}>
                  {product.stock <= 0 ? 'Agotado' : `${product.stock} disponible${product.stock !== 1 ? 's' : ''}`}
                </span>
                {product.category_name && <span className="pill">{product.category_name}</span>}
              </div>
              <h1 className="page-title mb-3">{product.name}</h1>
              <p className="page-copy mb-0">
                {product.description || 'Un detalle pensado para sorprender, celebrar o acompañar un momento especial.'}
              </p>
            </div>

            <div className="row g-3">
              <div className="col-sm-6">
                <div className="metric-card h-100">
                  <div className="metric-label">Precio</div>
                  <p className="metric-value">${formatPrice(product.price)}</p>
                  <div className="metric-meta">Valor por unidad</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="metric-card h-100">
                  <div className="metric-label">Ideal para</div>
                  <p className="metric-value" style={{ fontSize: '1.25rem' }}>{product.occasion || 'Toda ocasión'}</p>
                  <div className="metric-meta">Regalo sugerido</div>
                </div>
              </div>
            </div>

            {tags.length > 0 && (
              <div>
                <div className="panel-title mb-2">Detalles del estilo</div>
                <div className="meta-row">
                  {tags.map((tag) => <span key={tag} className="pill">{tag}</span>)}
                </div>
              </div>
            )}

            <div className="summary-card" style={{ position: 'static' }}>
              <div className="panel-title mb-3">Agregar a tu pedido</div>
              <div className="row g-3 align-items-end">
                <div className="col-sm-4">
                  <label className="field-label" htmlFor="quantity">Cantidad</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock || 1}
                    className="field"
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                    disabled={product.stock <= 0}
                  />
                </div>
                <div className="col-sm-8">
                  <button type="button" className="btn-emerald w-100" onClick={handleAddToCart} disabled={product.stock <= 0}>
                    {successMessage ? <FaCheck className="me-2" /> : <FaShoppingBag className="me-2" />}
                    {successMessage || 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            </div>

            <div className="panel" style={{ background: 'rgba(248,250,252,0.8)' }}>
              <div className="d-flex gap-3 align-items-start">
                <div className="brand-mark">
                  <FaGift />
                </div>
                <div>
                  <div className="panel-title">Antes de confirmar</div>
                  <p className="muted-copy mb-0">Revisa cantidad, fecha de entrega y mensaje personalizado para que el regalo llegue justo como lo imaginas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
