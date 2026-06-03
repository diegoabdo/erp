import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import publicStoreService from '../services/publicStoreService'
import cartService from '../services/cartService'

const buildInitialForm = () => ({
  buyer_name: '',
  buyer_email: '',
  buyer_phone: '',
  recipient_name: '',
  recipient_phone: '',
  delivery_address: '',
  delivery_date: '',
  delivery_time: '',
  gift_message: '',
  notes: '',
  payment_method_id: '',
})

const formatPrice = (value) => Number(value || 0).toFixed(2)

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(cartService.getCart())
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState(buildInitialForm())

  useEffect(() => {
    const nextCart = cartService.getCart()
    setCart(nextCart)

    if (nextCart.items.length === 0) {
      navigate('/carrito')
      return
    }

    const loadPaymentMethods = async () => {
      try {
        setLoading(true)
        const methods = await publicStoreService.getPaymentMethods()
        setPaymentMethods(methods)
        if (methods.length > 0) {
          setFormData((current) => ({ ...current, payment_method_id: String(methods[0].id) }))
        }
      } catch (error) {
        console.error('Error cargando métodos de pago:', error)
        setErrors({ general: 'No pudimos cargar los métodos de pago disponibles.' })
      } finally {
        setLoading(false)
      }
    }

    loadPaymentMethods()
  }, [navigate])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '', general: '' }))
  }

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.buyer_name.trim()) nextErrors.buyer_name = 'Escribe el nombre de quien realiza la compra.'
    if (!formData.recipient_name.trim()) nextErrors.recipient_name = 'Escribe el nombre de la persona que recibirá el regalo.'
    if (!formData.delivery_address.trim()) nextErrors.delivery_address = 'Ingresa la dirección de entrega.'
    if (!formData.delivery_date) nextErrors.delivery_date = 'Selecciona una fecha de entrega.'
    if (!formData.payment_method_id) nextErrors.payment_method_id = 'Selecciona un método de pago.'

    if (formData.buyer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyer_email)) {
      nextErrors.buyer_email = 'Revisa el correo electrónico e inténtalo de nuevo.'
    }

    if (formData.delivery_date) {
      const selectedDate = new Date(formData.delivery_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        nextErrors.delivery_date = 'La fecha de entrega debe ser hoy o una fecha posterior.'
      }
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setSubmitting(true)
      const response = await publicStoreService.createOrder({
        ...formData,
        payment_method_id: Number(formData.payment_method_id),
        items: cartService.getCartForOrder(),
      })

      if (response.success) {
        setSuccessMessage(response.message)
        cartService.clearCart()
        setTimeout(() => navigate(`/seguimiento/${response.order.short_id}`), 1200)
      } else {
        setErrors({ general: response.error || 'No pudimos confirmar tu pedido.' })
      }
    } catch (error) {
      console.error('Error creando pedido:', error)
      setErrors({ general: error.response?.data?.error || 'Ocurrió un error al confirmar el pedido.' })
    } finally {
      setSubmitting(false)
    }
  }

  const sections = [
    {
      title: 'Datos de compra',
      fields: [
        ['buyer_name', 'Nombre completo', 'text'],
        ['buyer_email', 'Correo electrónico', 'email'],
        ['buyer_phone', 'Teléfono', 'tel'],
      ],
    },
    {
      title: 'Datos del destinatario',
      fields: [
        ['recipient_name', 'Nombre completo', 'text'],
        ['recipient_phone', 'Teléfono', 'tel'],
      ],
    },
  ]

  if (loading) {
    return <div className="page-container"><div className="panel text-center">Preparando tu compra...</div></div>
  }

  return (
    <div className="page-container d-flex flex-column gap-4">
      <section className="hero-panel">
        <span className="eyebrow">Finalizar pedido</span>
        <h1 className="page-title mt-3">Completa los datos de entrega y confirma tu regalo.</h1>
        <p className="page-copy mt-3 mb-0">Te pediremos solo la información necesaria para coordinar la entrega y dejar tu pedido listo.</p>
      </section>

      <section className="row g-4">
        <div className="col-lg-8">
          {errors.general && <div className="alert-surface error mb-3">{errors.general}</div>}
          {successMessage && <div className="alert-surface success mb-3">{successMessage}</div>}

          <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            {sections.map((section) => (
              <div key={section.title} className="panel">
                <div className="panel-title mb-3">{section.title}</div>
                <div className="row g-3">
                  {section.fields.map(([name, label, type]) => (
                    <div key={name} className={section.fields.length > 2 ? 'col-md-6' : 'col-md-6'}>
                      <label className="field-label" htmlFor={name}>{label}</label>
                      <input id={name} name={name} type={type} className="field" value={formData[name]} onChange={handleInputChange} />
                      {errors[name] && <div className="field-error">{errors[name]}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="panel">
              <div className="panel-title mb-3">Entrega</div>
              <div className="row g-3">
                <div className="col-12">
                  <label className="field-label" htmlFor="delivery_address">Dirección</label>
                  <input id="delivery_address" name="delivery_address" className="field" value={formData.delivery_address} onChange={handleInputChange} />
                  {errors.delivery_address && <div className="field-error">{errors.delivery_address}</div>}
                </div>
                <div className="col-md-6">
                  <label className="field-label" htmlFor="delivery_date">Fecha</label>
                  <input id="delivery_date" name="delivery_date" type="date" className="field" value={formData.delivery_date} onChange={handleInputChange} />
                  {errors.delivery_date && <div className="field-error">{errors.delivery_date}</div>}
                </div>
                <div className="col-md-6">
                  <label className="field-label" htmlFor="delivery_time">Horario aproximado</label>
                  <input id="delivery_time" name="delivery_time" className="field" placeholder="Ej. 10:00 - 14:00" value={formData.delivery_time} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title mb-3">Mensaje y pago</div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="field-label" htmlFor="gift_message">Mensaje para la tarjeta</label>
                  <textarea id="gift_message" name="gift_message" className="field-textarea" rows="5" value={formData.gift_message} onChange={handleInputChange} />
                </div>
                <div className="col-md-6 d-flex flex-column gap-3">
                  <div>
                    <label className="field-label" htmlFor="notes">Notas adicionales</label>
                    <textarea id="notes" name="notes" className="field-textarea" rows="3" placeholder="Ej. referencia de la dirección o instrucciones especiales" value={formData.notes} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="payment_method_id">Método de pago</label>
                    <select id="payment_method_id" name="payment_method_id" className="field-select" value={formData.payment_method_id} onChange={handleInputChange}>
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>{method.name}</option>
                      ))}
                    </select>
                    {errors.payment_method_id && <div className="field-error">{errors.payment_method_id}</div>}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-emerald" disabled={submitting}>
              {submitting ? 'Confirmando pedido...' : 'Confirmar pedido'}
            </button>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="summary-card">
            <div className="panel-title">Resumen de tu compra</div>
            <div className="d-flex flex-column gap-3 mt-3">
              {cart.items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="d-flex justify-content-between gap-3">
                  <div>
                    <div className="fw-bold">{item.name}</div>
                    <div className="muted-copy small">{item.quantity} x ${formatPrice(item.price)}</div>
                  </div>
                  <div className="fw-bold">${formatPrice(item.quantity * item.price)}</div>
                </div>
              ))}
            </div>
            <hr />
            <div className="summary-line"><span>Subtotal</span><strong>${formatPrice(cart.subtotal)}</strong></div>
            <div className="summary-line"><span>Envío</span><strong>$0.00</strong></div>
            <div className="summary-line"><span>Total</span><span className="summary-total">${formatPrice(cart.total)}</span></div>
          </div>
        </div>
      </section>
    </div>
  )
}
