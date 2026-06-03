import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChartLine, FaGift, FaLayerGroup, FaMagic, FaTruck } from 'react-icons/fa'
import publicStoreService from '../services/publicStoreService'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [products, cats] = await Promise.all([
          publicStoreService.getFeaturedProducts(),
          publicStoreService.getCategories(),
        ])
        setFeaturedProducts(products)
        setCategories(cats)
      } catch (error) {
        console.error('Error cargando inicio:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const metrics = [
    { label: 'Categorías disponibles', value: categories.length || 0, meta: 'Opciones para cada ocasión' },
    { label: 'Productos destacados', value: featuredProducts.length || 0, meta: 'Los favoritos de esta semana' },
    { label: 'Entrega local', value: '24h', meta: 'Coordinación rápida y clara' },
  ]

  return (
    <div className="page-container d-flex flex-column gap-4">
      <section className="hero-panel">
        <div className="row g-4 align-items-center position-relative">
          <div className="col-lg-7">
            <span className="eyebrow">
              <FaGift /> Regalos para momentos importantes
            </span>
            <h1 className="hero-title">Encuentra un regalo bonito, resuélvelo rápido y envíalo con confianza.</h1>
            <p className="hero-copy fs-5 mb-4">
              En Giftora reunimos flores, desayunos sorpresa, chocolates, pasteles y detalles personalizados para que regalar se sienta fácil, especial y bien organizado.
            </p>
            <div className="hero-actions">
              <Link to="/productos" className="btn-emerald">
                Ver catálogo <FaArrowRight className="ms-2" />
              </Link>
              <Link to="/recomendador" className="btn-ghost">
                Ayúdame a elegir
              </Link>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="stats-grid">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <div className="metric-label">{metric.label}</div>
                  <p className="metric-value">{metric.value}</p>
                  <div className="metric-meta">{metric.meta}</div>
                </div>
              ))}
            </div>

            <div className="panel mt-3">
              <div className="d-flex align-items-start gap-3">
                <div>
                  <div className="panel-title">Compra guiada</div>
                  <p className="muted-copy mb-0">
                    Desde el catálogo hasta el seguimiento del pedido, todo está pensado para que encuentres, compres y confirmes sin complicarte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2 className="section-title">Lo que puedes hacer</h2>
            <p className="page-copy mb-0">Accesos rápidos a las secciones que más vas a usar al momento de comprar.</p>
          </div>
        </div>

        <div className="row g-3">
          {[
            { icon: FaGift, title: 'Explorar productos', text: 'Revisa opciones por categoría, ocasión o presupuesto.', to: '/productos' },
            { icon: FaMagic, title: 'Recibir sugerencias', text: 'Obtén ideas según la persona, la ocasión y el estilo de regalo.', to: '/recomendador' },
            { icon: FaTruck, title: 'Seguir tu pedido', text: 'Consulta el estado de entrega con tu código de seguimiento.', to: '/seguimiento' },
            { icon: FaLayerGroup, title: 'Completar tu compra', text: 'Revisa el resumen y confirma los datos de entrega en un solo lugar.', to: '/checkout' },
          ].map(({ icon: Icon, title, text, to }) => (
            <div key={title} className="col-md-6 col-xl-3">
              <Link to={to} className="panel h-100 d-block">
                <div className="brand-mark mb-3">
                  <Icon />
                </div>
                <div className="panel-title">{title}</div>
                <p className="muted-copy mb-0">{text}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2 className="section-title">Productos destacados</h2>
            <p className="page-copy mb-0">Una selección pensada para fechas especiales, regalos de último momento y detalles que siempre funcionan.</p>
          </div>
          <Link to="/productos" className="btn-soft">Ver todo el catálogo</Link>
        </div>

        {loading ? (
          <div className="panel text-center">Cargando productos...</div>
        ) : featuredProducts.length > 0 ? (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-md-6 col-xl-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Todavía no hay productos destacados cargados.</div>
        )}
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2 className="section-title">Categorías</h2>
            <p className="page-copy mb-0">Empieza por el tipo de regalo que tienes en mente y ve afinando tu elección.</p>
          </div>
        </div>

        <div className="row g-3">
          {categories.map((category) => (
            <div key={category.id} className="col-sm-6 col-xl-3">
              <div className="panel h-100">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <div className="panel-title">{category.name}</div>
                    <p className="muted-copy mb-0">{category.description || 'Descubre opciones listas para regalar.'}</p>
                  </div>
                  <span className="pill">Disponible</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
