import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../../services/apiService';
import { toast } from 'react-toastify';
import './Home.css';

// Import hero background images
import heroImg1 from '../../assets/images/hero-section/Hero-background-image-1.jpg';
import heroImg2 from '../../assets/images/hero-section/Hero-background-image-2.jpg';
import heroImg3 from '../../assets/images/hero-section/Hero-background-image-3.jpg';
import heroImg4 from '../../assets/images/hero-section/Hero-background-image-4.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Hero slides data matching D1 structure
  const heroSlides = [
    {
      title: "Find Your Perfect Rental Car",
      description: "Discover our wide range of premium vehicles for every journey. Book now and drive with confidence.",
      buttonText: "Browse Cars",
      buttonLink: "/cars",
      backgroundImage: heroImg1
    },
    {
      title: "Premium Cars, Affordable Prices",
      description: "Experience luxury without breaking the bank. Choose from our fleet of premium vehicles at competitive rates.",
      buttonText: "View Our Fleet",
      buttonLink: "#featured-cars",
      backgroundImage: heroImg2
    },
    {
      title: "Electric & Eco-Friendly Options",
      description: "Go green with our selection of electric and hybrid vehicles. Perfect for the environmentally conscious traveler.",
      buttonText: "Explore Electric Cars",
      buttonLink: "/cars?filter=electric",
      backgroundImage: heroImg3
    },
    {
      title: "24/7 Support & Service",
      description: "Travel with peace of mind. Our customer support team is available around the clock to assist you.",
      buttonText: "Contact Support",
      buttonLink: "/contact",
      backgroundImage: heroImg4
    }
  ];

  // Load featured cars from backend
  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);
        const cars = await carService.getFeaturedCars();
        setFeaturedCars(cars.slice(0, 8)); // Show 8 cars initially
      } catch (error) {
        console.error('Error fetching featured cars:', error);
        toast.error('Failed to load featured cars');
        setFeaturedCars([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const filterCarsByCategory = async (category) => {
    setActiveCategory(category);
    
    try {
      let cars;
      if (category === 'all') {
        cars = await carService.getFeaturedCars();
        setFeaturedCars(cars.slice(0, 8));
      } else {
        // Get cars by category
        const response = await carService.getCars({ category });
        setFeaturedCars(response.cars.slice(0, 8));
      }
    } catch (error) {
      console.error('Error filtering cars:', error);
      toast.error('Failed to filter cars');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section with Slider */}
      <section className="hero">
        {/* Background Images */}
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-background hero-background-${index + 1} ${currentSlide === index ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          ></div>
        ))}
        
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div key={index} className={`hero-slide ${currentSlide === index ? 'active' : ''}`}>
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <Link to={slide.buttonLink} className="btn hero-btn-force">
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className="hero-nav">
          {heroSlides.map((_, index) => (
            <span 
              key={index}
              className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="services-overview">
        <div className="container">
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <span>🚗</span>
              </div>
              <h3>Choose Your Car</h3>
              <p>Browse our premium fleet of vehicles from economy to luxury</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <span>📅</span>
              </div>
              <h3>Pick Date & Time</h3>
              <p>Select your rental period and pickup location with ease</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <span>💳</span>
              </div>
              <h3>Book & Pay</h3>
              <p>Secure payment processing with instant confirmation</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <span>🔑</span>
              </div>
              <h3>Drive Away</h3>
              <p>Quick pickup process and hit the road in minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="featured-cars-section" id="featured-cars">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Premium Fleet</h2>
            <p className="section-subtitle">Discover our carefully curated selection of vehicles for every journey</p>
          </div>
          
          {/* Car Categories Tabs */}
          <div className="car-categories">
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => filterCarsByCategory('all')}
            >
              All Cars
            </button>
            <button 
              className={`category-btn ${activeCategory === 'luxury' ? 'active' : ''}`}
              onClick={() => filterCarsByCategory('luxury')}
            >
              Luxury
            </button>
            <button 
              className={`category-btn ${activeCategory === 'suv' ? 'active' : ''}`}
              onClick={() => filterCarsByCategory('suv')}
            >
              SUVs
            </button>
            <button 
              className={`category-btn ${activeCategory === 'electric' ? 'active' : ''}`}
              onClick={() => filterCarsByCategory('electric')}
            >
              Electric
            </button>
            <button 
              className={`category-btn ${activeCategory === 'economy' ? 'active' : ''}`}
              onClick={() => filterCarsByCategory('economy')}
            >
              Economy
            </button>
          </div>

          <div className="cars-grid-container">
            <div className="cars-grid">
              {loading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                  <p>Loading featured cars...</p>
                </div>
              ) : featuredCars.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                  <p>No cars available at the moment.</p>
                </div>
              ) : (
                featuredCars.map((car) => (
                  <div key={car._id} className="car-card">
                    <Link to={`/car-details/${car._id}`} className="car-card-link">
                      <div className="car-image">
                        <img src={`/images/${car.image}`} alt={`${car.brand} ${car.model}`} />
                        <div className="car-badge">{car.category}</div>
                      </div>
                      <div className="car-info">
                        <h3 className="car-name">{car.brand} {car.model}</h3>
                        <p className="car-model">{car.year}</p>
                        <div className="car-specs">
                          <span>👥 {car.seats} Seats</span>
                          <span>⚙️ {car.transmission}</span>
                          <span>⛽ {car.fuelType}</span>
                        </div>
                        <div className="car-footer">
                          <div className="car-price">
                            <span className="price">${car.price}</span>
                            <span className="price-unit">/day</span>
                          </div>
                        <div className="rent-btn">
                          Rent Now
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
              )}
            </div>
          </div>

          <div className="view-all-container">
            <Link to="/cars" className="btn btn-primary view-all-btn">
              View Complete Fleet
              <span className="btn-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="container">
          <div className="stats-header">
            <h2 className="stats-title">Trusted by Thousands</h2>
            <p className="stats-subtitle">Join our growing community of satisfied customers who choose RentaCar for their travel needs</p>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <span>👥</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Happy Customers</div>
                <div className="stat-description">Satisfied clients worldwide</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <span>🚗</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">500+</div>
                <div className="stat-label">Premium Cars</div>
                <div className="stat-description">Latest models available</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <span>📍</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">50+</div>
                <div className="stat-label">Pickup Locations</div>
                <div className="stat-description">Convenient locations</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <span>🕐</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Customer Support</div>
                <div className="stat-description">Always here to help</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header">
            <div className="testimonials-badge">Customer Stories</div>
            <h2 className="testimonials-title">Trusted by thousands</h2>
            <p className="testimonials-subtitle">See what our customers say about their rental experience</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <span>"</span>
                </div>
                <p className="testimonial-quote">Outstanding service and premium vehicles. The booking process was seamless and the car exceeded my expectations.</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Michael Chen" />
                </div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <span>CEO, TechCorp</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card testimonial-featured">
              <div className="featured-label">Most Helpful</div>
              <div className="testimonial-content">
                <div className="quote-icon">
                  <span>"</span>
                </div>
                <p className="testimonial-quote">Perfect for our family vacation! Clean, reliable, and affordable. The customer support team was incredibly helpful throughout our trip.</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face" alt="Sarah Johnson" />
                </div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>Marketing Director</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <span>"</span>
                </div>
                <p className="testimonial-quote">Amazing experience! The luxury sedan was pristine and the pickup process was quick and professional. Will definitely rent again.</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="David Rodriguez" />
                </div>
                <div className="author-info">
                  <h4>David Rodriguez</h4>
                  <span>Business Owner</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <span>"</span>
                </div>
                <p className="testimonial-quote">Great variety of cars and transparent pricing. The mobile app made everything convenient. Excellent customer service throughout!</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Emily Davis" />
                </div>
                <div className="author-info">
                  <h4>Emily Davis</h4>
                  <span>Travel Blogger</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <span>"</span>
                </div>
                <p className="testimonial-quote">Smooth rental process and excellent vehicle quality. The team went above and beyond to ensure our business trip was successful.</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" alt="James Wilson" />
                </div>
                <div className="author-info">
                  <h4>James Wilson</h4>
                  <span>Project Manager</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <span>"</span>
                </div>
                <p className="testimonial-quote">Reliable and affordable. The SUV was perfect for our road trip and the pickup locations were very convenient. Highly recommended!</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" alt="Lisa Thompson" />
                </div>
                <div className="author-info">
                  <h4>Lisa Thompson</h4>
                  <span>Photographer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="floating-element">🚗</div>
        <div className="floating-element">🌟</div>
        <div className="floating-element">🔑</div>
        <div className="floating-element">💨</div>
        
        <div className="container">
          <h2 className="cta-title">Ready to Hit the Road?</h2>
          <p className="cta-text">Join thousands of satisfied customers who trust RentaCar for their premium travel experience. Your perfect journey starts with just one click.</p>
          
          <div className="cta-buttons">
            <Link to="/cars" className="cta-btn-primary">
              <span>Browse All Cars</span>
              <i className="btn-icon">→</i>
            </Link>
            <Link to="/contact" className="cta-btn-secondary">
              <span>Contact Us</span>
              <i className="btn-icon">✉</i>
            </Link>
          </div>
          
          <div className="cta-features">
            <div className="cta-feature">
              <span className="feature-icon">⚡</span>
              <span className="feature-text">Instant Booking</span>
            </div>
            <div className="cta-feature">
              <span className="feature-icon">🛡️</span>
              <span className="feature-text">Fully Insured</span>
            </div>
            <div className="cta-feature">
              <span className="feature-icon">📱</span>
              <span className="feature-text">Mobile Keys</span>
            </div>
            <div className="cta-feature">
              <span className="feature-icon">🕐</span>
              <span className="feature-text">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
