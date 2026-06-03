import { useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaMagic, FaRedo } from 'react-icons/fa'
import publicStoreService from '../services/publicStoreService'
import ProductCard from '../components/ProductCard'

const steps = [
  {
    key: 'occasion',
    title: 'Ocasión',
    copy: 'Cuéntanos para qué momento estás buscando el regalo.',
    options: [
      { value: 'cumpleanos', label: 'Cumpleaños', detail: 'Para celebrar con algo alegre, dulce o especial.' },
      { value: 'aniversario', label: 'Aniversario', detail: 'Opciones con un tono más romántico o elegante.' },
      { value: 'graduacion', label: 'Graduación', detail: 'Regalos para felicitar un logro importante.' },
      { value: 'agradecimiento', label: 'Agradecimiento', detail: 'Detalles sobrios para decir gracias con gusto.' },
    ],
  },
  {
    key: 'budget',
    title: 'Presupuesto',
    copy: 'Así podemos mostrarte opciones que sí encajen con lo que planeas gastar.',
    options: [
      { value: 'bajo', label: 'Bajo', detail: 'Hasta 100' },
      { value: 'medio', label: 'Medio', detail: 'Entre 100 y 300' },
      { value: 'alto', label: 'Alto', detail: 'Más de 300' },
    ],
  },
  {
    key: 'recipient_type',
    title: 'Destinatario',
    copy: 'No es lo mismo regalarle a una pareja que a una mamá o a un cliente.',
    options: [
      { value: 'pareja', label: 'Pareja', detail: 'Detalles románticos, delicados o memorables.' },
      { value: 'mama', label: 'Mamá', detail: 'Regalos cálidos, bonitos y con cariño.' },
      { value: 'amigo', label: 'Amigo o amiga', detail: 'Opciones más relajadas, divertidas o versátiles.' },
      { value: 'cliente', label: 'Cliente', detail: 'Presentación cuidada y tono más profesional.' },
    ],
  },
  {
    key: 'preference',
    title: 'Estilo del regalo',
    copy: 'Elige qué tipo de detalle te gustaría priorizar.',
    options: [
      { value: 'flores', label: 'Flores', detail: 'Clásicas, delicadas y siempre bien recibidas.' },
      { value: 'dulce', label: 'Dulce', detail: 'Chocolates, postres o desayunos sorpresa.' },
      { value: 'elegante', label: 'Elegante', detail: 'Una opción más sobria, fina o premium.' },
      { value: 'personalizado', label: 'Personalizado', detail: 'Regalos con un toque más único y especial.' },
    ],
  },
]

export default function RecommenderPage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState({
    occasion: '',
    budget: '',
    recipient_type: '',
    preference: '',
  })
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentStep = steps[stepIndex]
  const progress = ((stepIndex + 1) / steps.length) * 100

  const selectOption = (value) => {
    setFormData((current) => ({ ...current, [currentStep.key]: value }))
    setError('')
  }

  const nextStep = async () => {
    const currentValue = formData[currentStep.key]
    if (!currentValue) {
      setError('Selecciona una opción para continuar.')
      return
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1)
      return
    }

    try {
      setLoading(true)
      setError('')
      const result = await publicStoreService.getRecommendations(formData)
      setRecommendations(result.results || [])
      setStepIndex(steps.length)
    } catch (requestError) {
      console.error('Error obteniendo recomendaciones:', requestError)
      setError('No pudimos cargar recomendaciones en este momento.')
    } finally {
      setLoading(false)
    }
  }

  const resetWizard = () => {
    setFormData({ occasion: '', budget: '', recipient_type: '', preference: '' })
    setRecommendations([])
    setError('')
    setStepIndex(0)
  }

  return (
    <div className="page-container d-flex flex-column gap-4">
      <section className="hero-panel">
        <span className="eyebrow"><FaMagic /> Recomendador de regalos</span>
        <h1 className="page-title mt-3">Te ayudamos a elegir un regalo con más claridad y menos vueltas.</h1>
        <p className="page-copy mt-3 mb-4">Responde unas preguntas rápidas y te mostraremos opciones alineadas con la ocasión, el presupuesto y el estilo que buscas.</p>
        {stepIndex < steps.length && (
          <div className="progress-shell">
            <div className="progress-bar-custom" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </section>

      {stepIndex < steps.length ? (
        <section className="row g-4 align-items-start">
          <div className="col-lg-4">
            <div className="summary-card">
              <div className="panel-title">Paso {stepIndex + 1} de {steps.length}</div>
              <div className="summary-line"><span>Ocasión</span><strong>{formData.occasion || 'Pendiente'}</strong></div>
              <div className="summary-line"><span>Presupuesto</span><strong>{formData.budget || 'Pendiente'}</strong></div>
              <div className="summary-line"><span>Destinatario</span><strong>{formData.recipient_type || 'Pendiente'}</strong></div>
              <div className="summary-line"><span>Estilo</span><strong>{formData.preference || 'Pendiente'}</strong></div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="panel">
              <div className="panel-title mb-1">{currentStep.title}</div>
              <p className="muted-copy mb-4">{currentStep.copy}</p>
              <div className="choice-grid">
                {currentStep.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`choice-card text-start ${formData[currentStep.key] === option.value ? 'active' : ''}`}
                    onClick={() => selectOption(option.value)}
                  >
                    <div className="fw-bold mb-1">{option.label}</div>
                    <div className="muted-copy small">{option.detail}</div>
                  </button>
                ))}
              </div>

              {error && <div className="alert-surface error mt-4">{error}</div>}

              <div className="wizard-actions mt-4">
                {stepIndex > 0 && (
                  <button type="button" className="btn-soft" onClick={() => setStepIndex((current) => current - 1)}>
                    <FaArrowLeft className="me-2" /> Anterior
                  </button>
                )}
                <button type="button" className="btn-emerald" onClick={nextStep} disabled={loading}>
                  {loading ? 'Buscando opciones...' : stepIndex === steps.length - 1 ? 'Ver recomendaciones' : 'Siguiente'}
                  {!loading && <FaArrowRight className="ms-2" />}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="d-flex flex-column gap-4">
          <div className="panel d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h2 className="section-title">Opciones para ti</h2>
              <p className="page-copy mb-0">Encontramos {recommendations.length} sugerencia{recommendations.length !== 1 ? 's' : ''} según lo que nos contaste.</p>
            </div>
            <button type="button" className="btn-soft" onClick={resetWizard}>
              <FaRedo className="me-2" /> Empezar de nuevo
            </button>
          </div>

          {recommendations.length > 0 ? (
            <div className="row g-4">
              {recommendations.map((product) => (
                <div key={product.id} className="col-md-6 col-xl-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No encontramos sugerencias para esta combinación. Prueba con otra preferencia o con un presupuesto más amplio.</div>
          )}
        </section>
      )}
    </div>
  )
}
