import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { carService } from '../services/apiService'

export default function Cars() {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    price: [],
    type: []
  })

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const data = await carService.getAllCars()
      const carsArray = data.cars || data || []
      setCars(carsArray)
      setFilteredCars(carsArray)
    } catch (error) {
      console.error('Error fetching cars:', error)
      setCars([])
      setFilteredCars([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value, isChecked) => {
    const newFilters = { ...filters }
    
    if (isChecked) {
      newFilters[filterType].push(value)
    } else {
      newFilters[filterType] = newFilters[filterType].filter(f => f !== value)
    }
    
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (activeFilters) => {
    let filtered = [...cars]
    
    // Apply price filters
    if (activeFilters.price.length > 0) {
      filtered = filtered.filter(car => {
        return activeFilters.price.some(range => {
          switch(range) {
            case 'under-50': return car.price < 50
            case '50-100': return car.price >= 50 && car.price <= 100
            case 'over-100': return car.price > 100
            default: return true
          }
        })
      })
    }
    
    // Apply type filters
    if (activeFilters.type.length > 0) {
      filtered = filtered.filter(car => {
        const carType = car.category?.toLowerCase() || ''
        return activeFilters.type.some(filterType => {
          switch(filterType) {
            case 'sedan': return carType === 'standard' || carType === 'sedan'
            case 'suv': return carType === 'suv'
            case 'electric': return car.fuelType === 'electric'
            case 'sports': return carType === 'convertible' || carType === 'sports'
            default: return carType === filterType
          }
        })
      })
    }
    
    setFilteredCars(filtered)
    
    // Close filters on mobile after applying
    if (window.innerWidth <= 768) {
      setIsFiltersOpen(false)
    }
  }

  const resetFilters = () => {
    setFilters({ price: [], type: [] })
    setFilteredCars(cars)
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false
    })
  }

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen)
  }

  const closeFilters = () => {
    setIsFiltersOpen(false)
  }

  const handleAddToCart = (car) => {
    localStorage.setItem('selectedCarId', car._id)
    localStorage.setItem('selectedCarData', JSON.stringify(car))
    navigate('/checkout')
  }

  const handleViewDetails = (carId) => {
    navigate(`/car-details/${carId}`)
  }

  const getImagePath = (imageName) => {
    return `/images/${imageName}`
  }

  if (loading) {
    return (
      <div style={{ 
        marginTop: '100px', 
        padding: '2rem', 
        textAlign: 'center', 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>
          <h2>Loading cars...</h2>
          <p>Please wait while we fetch our premium fleet.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Add D1 styles */}
      <style>{`
        /* Car Rental Website - Cars Page Styles */
        :root {
          --cream: #fffcf2;
          --warm-gray: #ccc5b9;
          --dark-gray: #403d39;
          --charcoal: #252422;
          --warm-orange: #eb5e28;
          --white: #ffffff;
          --light-gray: #f8f9fa;
          --border-gray: #e9ecef;
        }

        /* Cars Container */
        .cars-container {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
          margin-top: 100px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 20px;
        }

        /* Mobile Filter Toggle */
        .filters-toggle {
          display: none;
          padding: 0.8rem 1.2rem;
          background: var(--white);
          border: 1px solid var(--border-gray);
          border-radius: 8px;
          color: var(--charcoal);
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1rem;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .filters-toggle:hover {
          background: var(--light-gray);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .filters-toggle span {
          font-size: 1.2rem;
          display: inline-flex;
        }

        /* Filters Overlay */
        .filters-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 998;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(2px);
        }

        .filters-overlay.active {
          display: block;
          opacity: 1;
        }

        /* Filters Sidebar */
        .filters-sidebar {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .filters-sidebar-header {
          display: none;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border-gray);
          margin-bottom: 1rem;
        }

        .filters-close {
          display: none;
          font-size: 1.5rem;
          cursor: pointer;
          width: 36px;
          height: 36px;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background: rgba(0,0,0,0.05);
        }

        .filters-close:hover {
          background: rgba(235, 94, 40, 0.1);
          color: var(--warm-orange);
        }

        .filter-header {
          margin: 0;
          color: var(--warm-orange);
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .filter-group {
          margin-bottom: 2rem;
        }

        .filter-title {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #333;
        }

        .filter-option {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .filter-option:hover {
          color: var(--warm-orange);
        }

        .filter-option input {
          margin-right: 0.5rem;
        }

        .reset-filters-btn {
          width: 100%;
          margin-top: 1rem;
          display: block;
          text-align: center;
          padding: 0.75rem 1.5rem;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .reset-filters-btn:hover {
          background-color: #5a6268;
        }

        /* Cars Listing */
        .cars-listing {
          min-height: 60vh;
        }

        .cars-listing-header {
          margin-bottom: 2rem;
        }

        .cars-listing-header h1 {
          font-size: 2.5rem;
          color: var(--charcoal);
          margin-bottom: 0.5rem;
        }

        .cars-listing-header p {
          color: var(--warm-gray);
          font-size: 1.1rem;
        }

        /* Cars Grid */
        .cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        /* Car Card */
        .car-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .car-image {
          width: 100%;
          height: 200px;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 1.1rem;
          position: relative;
          overflow: hidden;
        }

        .car-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .car-info {
          padding: 1.5rem;
        }

        .car-name {
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: var(--charcoal);
        }

        .car-model {
          color: var(--warm-gray);
          margin-bottom: 1rem;
        }

        .car-features {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--warm-gray);
          flex-wrap: wrap;
        }

        .car-features span {
          background: var(--light-gray);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .car-price {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--warm-orange);
          margin-bottom: 1rem;
        }

        .price-period {
          font-size: 0.9rem;
          font-weight: normal;
          color: var(--warm-gray);
        }

        .car-actions {
          display: flex;
          gap: 1rem;
        }

        .car-actions .btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
          font-size: 0.9rem;
        }

        .car-actions .btn:hover {
          transform: translateY(-2px);
        }

        .car-actions .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .car-actions .btn-secondary:hover {
          background-color: #5a6268;
        }

        .car-actions .btn:not(.btn-secondary) {
          background-color: var(--warm-orange);
          color: white;
        }

        .car-actions .btn:not(.btn-secondary):hover {
          background-color: #d63916;
        }

        /* No Results */
        .no-results {
          display: none;
          text-align: center;
          background: #f8f9fa;
          border-radius: 10px;
          padding: 3rem 2rem;
          margin-top: 2rem;
        }

        .no-results.show {
          display: block;
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .no-results h3 {
          margin-bottom: 1rem;
          color: var(--charcoal);
        }

        .no-results p {
          color: var(--warm-gray);
          margin-bottom: 1.5rem;
        }

        .no-results .btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--warm-orange);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        .no-results .btn:hover {
          background-color: #d63916;
        }

        /* Mobile Responsive */
        @media screen and (max-width: 768px) {
          .cars-container {
            display: block;
            margin-top: 80px;
          }
          
          .filters-toggle {
            display: flex;
          }
          
          .filters-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 85%;
            max-width: 320px;
            height: 100vh;
            z-index: 999;
            background: var(--white);
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            overflow-y: auto;
            transition: left 0.3s ease;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
          }
          
          .filters-sidebar.active {
            left: 0;
          }

          .filters-sidebar-header {
            display: flex;
          }

          .filters-close {
            display: flex;
          }

          .filter-group {
            padding: 0 1rem;
          }

          .cars-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .cars-listing-header h1 {
            font-size: 2rem;
          }

          .car-actions {
            flex-direction: column;
          }
        }

        @media screen and (max-width: 480px) {
          .cars-listing-header h1 {
            font-size: 1.8rem;
          }
          
          .car-features {
            font-size: 0.8rem;
          }
        }
      `}</style>

      {/* Filters Overlay */}
      <div className={`filters-overlay ${isFiltersOpen ? 'active' : ''}`} onClick={closeFilters}></div>
      
      <main>
        <div className="cars-container">
          {/* Mobile Filter Toggle */}
          <button className="filters-toggle" onClick={toggleFilters}>
            <span>🔍</span>
            Filter Cars
          </button>
          
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${isFiltersOpen ? 'active' : ''}`}>
            <div className="filters-sidebar-header">
              <h3 className="filter-header">Filter Cars</h3>
              <div className="filters-close" onClick={closeFilters}>×</div>
            </div>
            
            {/* Price Range Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Price Range (per day)</h4>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="under-50" 
                  name="price" 
                  value="under-50"
                  onChange={(e) => handleFilterChange('price', 'under-50', e.target.checked)}
                />
                <label htmlFor="under-50">Under $50</label>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="50-100" 
                  name="price" 
                  value="50-100"
                  onChange={(e) => handleFilterChange('price', '50-100', e.target.checked)}
                />
                <label htmlFor="50-100">$50 - $100</label>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="over-100" 
                  name="price" 
                  value="over-100"
                  onChange={(e) => handleFilterChange('price', 'over-100', e.target.checked)}
                />
                <label htmlFor="over-100">Over $100</label>
              </div>
            </div>
            
            {/* Car Type Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Car Type</h4>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="sedan" 
                  name="type" 
                  value="sedan"
                  onChange={(e) => handleFilterChange('type', 'sedan', e.target.checked)}
                />
                <label htmlFor="sedan">Sedan</label>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="suv" 
                  name="type" 
                  value="suv"
                  onChange={(e) => handleFilterChange('type', 'suv', e.target.checked)}
                />
                <label htmlFor="suv">SUV</label>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="electric" 
                  name="type" 
                  value="electric"
                  onChange={(e) => handleFilterChange('type', 'electric', e.target.checked)}
                />
                <label htmlFor="electric">Electric</label>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="sports" 
                  name="type" 
                  value="sports"
                  onChange={(e) => handleFilterChange('type', 'sports', e.target.checked)}
                />
                <label htmlFor="sports">Sports Car</label>
              </div>
            </div>
            
            {/* Reset Filters */}
            <button className="btn btn-secondary reset-filters-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </aside>
          
          {/* Cars Listing */}
          <section className="cars-listing">
            <div className="cars-listing-header">
              <h1>Our Premium Fleet</h1>
              <p>Choose from our wide selection of quality vehicles</p>
            </div>
            
            <div className="cars-grid">
              {filteredCars.map((car) => (
                <div key={car._id} className="car-card" data-car-id={car._id} data-category={car.category}>
                  <div className="car-image">
                    <img 
                      src={getImagePath(car.image)} 
                      alt={`${car.brand} ${car.model}`}
                      onError={(e) => {e.target.src = '/images/placeholder.png'}}
                    />
                  </div>
                  <div className="car-info">
                    <h3 className="car-name">{car.brand} {car.model}</h3>
                    <p className="car-model">{car.year} • {car.transmission} • {car.fuelType}</p>
                    <div className="car-features">
                      {car.features?.slice(0, 3).map((feature, index) => (
                        <span key={index}>{feature}</span>
                      ))}
                    </div>
                    <div className="car-price">
                      ${car.price}<span className="price-period">/day</span>
                    </div>
                    <div className="car-actions">
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleViewDetails(car._id)}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn" 
                        onClick={() => handleAddToCart(car)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* No Results Message */}
            <div className={`no-results ${filteredCars.length === 0 ? 'show' : ''}`}>
              <div className="no-results-icon">🔍</div>
              <h3>No cars found</h3>
              <p>Try adjusting your filters to see more results.</p>
              <button className="btn" onClick={resetFilters}>Reset Filters</button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
