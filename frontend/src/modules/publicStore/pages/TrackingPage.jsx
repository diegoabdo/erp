import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaArrowRight, FaBoxOpen, FaSearch, FaTruck } from 'react-icons/fa'
import publicStoreService from '../services/publicStoreService'

const formatPrice = (value) => Number(value || 0).toFixed(2)
const formatDate = (value) => value ? new Date(value).toLocaleDateString() : 'Pendiente'

export default function TrackingPage() {
  const { short_id: routeShortId } = useParams()
  const [searchCode, setSearchCode] = useState(routeShortId || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadOrder = async (code) => {
    try {
      setLoading(true)
      setError('')
      const result = await publicStoreService.trackOrder(code)
      setOrder(result)
    } catch (err) {
      console.error('Error buscando pedido:', err)
      setOrder(null)
      setError('No encontramos un pedido con ese código. Verifica que esté escrito correctamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (routeShortId) {
      loadOrder(routeShortId)
    }
  }, [routeShortId])

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!searchCode.trim()) {
      setError('Ingresa el código de tu pedido para consultar el estado.')
      return
    }
    await loadOrder(searchCode.trim().toUpperCase())
  }

  return (
    <div className="page-container d-flex flex-column gap-4">
      <section className="hero-panel">
        <span className="eyebrow">
          <FaTruck /> Seguimiento de pedidos
        </span>
        <h1 className="page-title mt-3">Consulta el estado de tu pedido en cualquier momento.</h1>
        <p className="page-copy mt-3">Ingresa tu código de seguimiento para ver el avance, la fecha estimada y el resumen del regalo.</p>

        <form className="toolbar-row mt-4" onSubmit={handleSearch}>
          <div className="flex-grow-1">
            <label className="field-label" htmlFor="tracking-code">Código de pedido</label>
            <input
              id="tracking-code"
              className="field"
              placeholder="Ej. RL-ABC12345"
              value={searchCode}
              onChange={(event) => setSearchCode(event.target.value.toUpperCase())}
            />
          </div>
          <button type="submit" className="btn-emerald align-self-end" disabled={loading}>
            <FaSearch className="me-2" /> {loading ? 'Buscando...' : 'Consultar pedido'}
          </button>
        </form>
      </section>

      {error && <div className="alert-surface error">{error}</div>}

      {order && (
        <section className="row g-4">
          <div className="col-lg-4">
            <div className="summary-card">
              <div className="panel-title">Resumen</div>
              <div className="summary-line"><span>Código</span><strong>{order.short_id}</strong></div>
              <div className="summary-line"><span>Estado actual</span><strong>{order.status_name}</strong></div>
              <div className="summary-line"><span>Entrega estimada</span><strong>{formatDate(order.delivery_date)}</strong></div>
              <div className="summary-line"><span>Total</span><span className="summary-total">${formatPrice(order.total)}</span></div>
            </div>
          </div>

          <div className="col-lg-8 d-flex flex-column gap-3">
            <div className="panel">
              <div className="section-head mb-3">
                <div>
                  <h2 className="section-title">Detalle del pedido</h2>
                  <p className="page-copy mb-0">Información principal de la entrega y del regalo.</p>
                </div>
                <span className="pill"><FaArrowRight /> {order.status_name}</span>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="panel-title mb-1">Destinatario</div>
                  <p className="muted-copy mb-0">{order.recipient_name}</p>
                </div>
                <div className="col-md-6">
                  <div className="panel-title mb-1">Fecha estimada</div>
                  <p className="muted-copy mb-0">{formatDate(order.delivery_date)}</p>
                </div>
                {order.gift_message && (
                  <div className="col-12">
                    <div className="panel-title mb-1">Mensaje incluido</div>
                    <p className="muted-copy mb-0">{order.gift_message}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title mb-3">Historial del pedido</div>
              {order.history && order.history.length > 0 ? (
                <div className="timeline-list">
                  {order.history.map((entry, index) => (
                    <div key={`${entry.status_name}-${index}`} className="timeline-item">
                      <div className="timeline-icon">{index + 1}</div>
                      <div>
                        <div className="fw-bold">{entry.status_name}</div>
                        <div className="muted-copy small">{formatDate(entry.created_at)}</div>
                        {entry.notes && <p className="muted-copy mb-0 mt-2">{entry.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">Todavía no hay actualizaciones visibles para este pedido.</div>
              )}
            </div>

            <div className="panel">
              <div className="panel-title mb-3">Productos incluidos</div>
              {order.items && order.items.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {order.items.map((item, index) => (
                    <div key={`${item.name_snapshot}-${index}`} className="d-flex justify-content-between gap-3 align-items-center">
                      <div>
                        <div className="fw-bold"><FaBoxOpen className="me-2" />{item.name_snapshot}</div>
                        <div className="muted-copy small">{item.quantity} x ${formatPrice(item.unit_price)}</div>
                      </div>
                      <div className="fw-bold">${formatPrice(item.total)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">Este pedido todavía no muestra productos cargados.</div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
