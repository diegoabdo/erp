import { useEffect, useState } from 'react'
import { FaFilter, FaSearch, FaSlidersH } from 'react-icons/fa'
import publicStoreService from '../services/publicStoreService'
import ProductCard from '../components/ProductCard'

const defaultFilters = {
  category: '',
  occasion: '',
  search: '',
  min_price: '',
  max_price: '',
}

export default function ProductListPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const cats = await publicStoreService.getCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error cargando categorias:', error)
      }
    }

    bootstrap()
    loadProducts(defaultFilters)
  }, [])

  const loadProducts = async (filtersToApply) => {
    try {
      setLoading(true)
      const prods = await publicStoreService.getProducts(filtersToApply)
      setProducts(prods)
    } catch (error) {
      console.error('Error cargando productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const nextFilters = { ...filters, [event.target.name]: event.target.value }
    setFilters(nextFilters)
    loadProducts(nextFilters)
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    loadProducts(defaultFilters)
  }

  const activeFilters = Object.values(filters).filter(Boolean).length

  return (
    <div className="page-container d-flex flex-column gap-4">
      <section className="hero-panel">
        <span className="eyebrow">
          <FaSlidersH /> Catálogo de regalos
        </span>
        <div className="section-head mt-3 mb-0">
          <div>
            <h1 className="page-title">Encuentra el detalle ideal para la ocasión que tienes en mente.</h1>
            <p className="page-copy mt-3 mb-0">Filtra por categoría, ocasión o rango de precio para ver opciones que sí encajen con lo que buscas.</p>
          </div>
          <div className="metric-card">
            <div className="metric-label">Resultados</div>
            <p className="metric-value">{products.length}</p>
            <div className="metric-meta">{activeFilters} filtro{activeFilters !== 1 ? 's' : ''} activo{activeFilters !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </section>

      <section className="split-layout">
        <aside className="panel">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <div className="panel-title mb-1">Filtrar resultados</div>
              <p className="muted-copy mb-0">Ajusta la búsqueda para llegar más rápido al regalo correcto.</p>
            </div>
            <FaFilter className="text-secondary" />
          </div>

          <div className="mb-3">
            <label className="field-label" htmlFor="search">Buscar</label>
            <div className="position-relative">
              <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-secondary" />
              <input id="search" name="search" className="field ps-5" value={filters.search} onChange={handleChange} placeholder="Ej. rosas, desayuno, chocolate" />
            </div>
          </div>

          <div className="mb-3">
            <label className="field-label" htmlFor="category">Categoría</label>
            <select id="category" name="category" className="field-select" value={filters.category} onChange={handleChange}>
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="field-label" htmlFor="occasion">Ocasión</label>
            <select id="occasion" name="occasion" className="field-select" value={filters.occasion} onChange={handleChange}>
              <option value="">Todas</option>
              <option value="cumpleanos">Cumpleaños</option>
              <option value="aniversario">Aniversario</option>
              <option value="graduacion">Graduación</option>
              <option value="amor">Amor y amistad</option>
              <option value="madre">Día de la madre</option>
            </select>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <label className="field-label" htmlFor="min_price">Desde</label>
              <input id="min_price" name="min_price" type="number" className="field" value={filters.min_price} onChange={handleChange} placeholder="0" />
            </div>
            <div className="col-6">
              <label className="field-label" htmlFor="max_price">Hasta</label>
              <input id="max_price" name="max_price" type="number" className="field" value={filters.max_price} onChange={handleChange} placeholder="999" />
            </div>
          </div>

          <div className="filter-actions mt-4">
            <button type="button" className="btn-emerald flex-grow-1" onClick={() => loadProducts(filters)}>Aplicar filtros</button>
            <button type="button" className="btn-soft" onClick={resetFilters}>Limpiar</button>
          </div>
        </aside>

        <div className="d-flex flex-column gap-3">
          <div className="panel d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <div className="panel-title mb-1">Resultados de la búsqueda</div>
              <p className="muted-copy mb-0">{products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''} con los filtros actuales.</p>
            </div>
            <div className="meta-row">
              {filters.category && <span className="pill">Categoría: {filters.category}</span>}
              {filters.occasion && <span className="pill">Ocasión: {filters.occasion}</span>}
              {filters.search && <span className="pill">Búsqueda: {filters.search}</span>}
            </div>
          </div>

          {loading ? (
            <div className="panel text-center">Cargando productos...</div>
          ) : products.length > 0 ? (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product.id} className="col-md-6 col-xl-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No encontramos productos con esos filtros. Prueba con otra categoría, otra ocasión o un rango de precio más amplio.</div>
          )}
        </div>
      </section>
    </div>
  )
}
