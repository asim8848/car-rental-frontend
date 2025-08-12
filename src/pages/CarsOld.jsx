import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { carService } from '../services/apiService'
import { toast } from 'react-toastify'

export default function Cars() {
  const [allCars, setAllCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [filters, setFilters] = useState({ price: [], type: [] })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async (filterParams = {}) => {
    try {
      setLoading(true)
      const response = await carService.getCars(filterParams)
      setAllCars(response.cars)
      setFilteredCars(response.cars)
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      })
    } catch (error) {
      console.error('Error fetching cars:', error)
      toast.error('Failed to load cars. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const normalizeType = (type) => {
    if (!type) return ''
    const t = String(type).toLowerCase()
    if (t.includes('sport') || t.includes('convertible')) return 'sports'
    if (t.includes('electric') || t.includes('ev')) return 'electric'
    if (t.includes('suv')) return 'suv'
    if (t.includes('standard') || t.includes('sedan')) return 'sedan'
    if (t.includes('compact') || t.includes('economy')) return 'economy'
    if (t.includes('luxury')) return 'luxury'
    return t
  }

  const handleFilterChange = async (filterType, value, isChecked) => {
    const newFilters = { ...filters }
    if (isChecked) {
      newFilters[filterType].push(value)
    } else {
      newFilters[filterType] = newFilters[filterType].filter(f => f !== value)
    }
    setFilters(newFilters)
    
    // Convert filter format for API
    const apiFilters = {}
    
    if (newFilters.price.length > 0) {
      const priceRanges = newFilters.price
      if (priceRanges.includes('under-50')) {
        apiFilters.maxPrice = 50
      } else if (priceRanges.includes('50-100')) {
        apiFilters.minPrice = 50
        apiFilters.maxPrice = 100
      } else if (priceRanges.includes('over-100')) {
        apiFilters.minPrice = 100
      }
    }
    
    if (newFilters.type.length > 0) {
      // For now, use the first selected type
      apiFilters.category = newFilters.type[0]
    }
    
    await fetchCars(apiFilters)
  }

  const resetFilters = async () => {
    setFilters({ price: [], type: [] })
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach(cb => (cb.checked = false))
    await fetchCars({}) // Fetch all cars without filters
  }

  const toggleFilters = () => setIsFiltersOpen(v => !v)
  const closeFilters = () => setIsFiltersOpen(false)

  const handleAddToCart = (car) => {
    try {
      if (car && car._id) {
        localStorage.setItem('selectedCarId', String(car._id))
      }
    } catch (e) {}
    navigate('/checkout')
  }

  if (loading) {
    return (
      <main>
        <div className="container cars-container cars-page-guard">
          <div style={{ textAlign: 'center', padding: '2rem', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <h2>Loading cars...</h2>
              <p>Please wait while we fetch the latest vehicles for you.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <div className={`filters-overlay ${isFiltersOpen ? 'active' : ''}`} onClick={closeFilters}></div>
      <main>
  <div className="container cars-container cars-page-guard">
          <button className="filters-toggle" onClick={toggleFilters}>
            <span>🔍</span>
            Filter Cars
          </button>

          <aside className={`filters-sidebar ${isFiltersOpen ? 'active' : ''}`}>
            <div className="filters-sidebar-header">
              <h3 className="filter-header">Filter Cars</h3>
              <div className="filters-close" onClick={closeFilters}>×</div>
            </div>
            <div className="filter-group">
              <h4 className="filter-title">Price Range (per day)</h4>
              <div className="filter-option">
                <input type="checkbox" id="under-50" name="price" value="under-50" onChange={(e) => handleFilterChange('price', 'under-50', e.target.checked)} />
                <label htmlFor="under-50">Under $50</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="50-100" name="price" value="50-100" onChange={(e) => handleFilterChange('price', '50-100', e.target.checked)} />
                <label htmlFor="50-100">$50 - $100</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="over-100" name="price" value="over-100" onChange={(e) => handleFilterChange('price', 'over-100', e.target.checked)} />
                <label htmlFor="over-100">Over $100</label>
              </div>
            </div>
            <div className="filter-group">
              <h4 className="filter-title">Car Type</h4>
              <div className="filter-option">
                <input type="checkbox" id="economy" name="type" value="economy" onChange={(e) => handleFilterChange('type', 'economy', e.target.checked)} />
                <label htmlFor="economy">Economy</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="compact" name="type" value="compact" onChange={(e) => handleFilterChange('type', 'compact', e.target.checked)} />
                <label htmlFor="compact">Compact</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="standard" name="type" value="standard" onChange={(e) => handleFilterChange('type', 'standard', e.target.checked)} />
                <label htmlFor="standard">Standard</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="luxury" name="type" value="luxury" onChange={(e) => handleFilterChange('type', 'luxury', e.target.checked)} />
                <label htmlFor="luxury">Luxury</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="suv" name="type" value="suv" onChange={(e) => handleFilterChange('type', 'suv', e.target.checked)} />
                <label htmlFor="suv">SUV</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="convertible" name="type" value="convertible" onChange={(e) => handleFilterChange('type', 'convertible', e.target.checked)} />
                <label htmlFor="convertible">Convertible</label>
              </div>
            </div>
            <button className="btn btn-secondary reset-filters-btn" onClick={resetFilters}>Reset Filters</button>
          </aside>

          <section className="cars-listing">
            <div className="cars-listing-header">
              <h1>Our Premium Fleet</h1>
              <p>Choose from our wide selection of quality vehicles</p>
            </div>
            <div className="cars-grid" id="cars-list">
              {filteredCars.map(car => (
                <div key={car.id} className="car-card" data-car-id={car.id} data-category={normalizeType(car.type)}>
                  <div className="car-image">
                    <img
                      src={`/images/${car.image}`}
                      alt={`${car.brand} ${car.model}`}
                      onError={(e) => { e.currentTarget.src = '/images/placeholder.png' }}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                  <div className="car-info">
                    <h3 className="car-name">{car.brand} {car.model}</h3>
                    <p className="car-model">{car.year} • {car.category.charAt(0).toUpperCase() + car.category.slice(1)}</p>
                    <div className="car-features">
                      <span>{car.seats} Seats</span>
                      <span>{car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}</span>
                      <span>{car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}</span>
                    </div>
                    <div className="car-price">${car.price}<span className="price-period">/day</span></div>
                    <div className="car-actions" style={{ display: 'flex', gap: '1rem' }}>
                      <Link to={`/car-details/${car._id}`} className="btn btn-secondary">View Details</Link>
                      <button className="btn" onClick={() => handleAddToCart(car)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div id="no-results" className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No cars found</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button className="btn" onClick={resetFilters}>Reset Filters</button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
