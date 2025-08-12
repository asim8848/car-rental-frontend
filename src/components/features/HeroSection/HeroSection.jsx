import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      id: 1,
      image: '/images/Hero section/Hero-background-image-1.jpg',
      title: 'Premium Car Rental Service',
      subtitle: 'Experience luxury and comfort with our premium fleet',
      description: 'Choose from our wide selection of premium vehicles for your next journey'
    },
    {
      id: 2,
      image: '/images/Hero section/Hero-background-image-2.jpg',
      title: 'Affordable Luxury Cars',
      subtitle: 'Best prices guaranteed on all our vehicles',
      description: 'Rent the car of your dreams at unbeatable prices'
    },
    {
      id: 3,
      image: '/images/Hero section/Hero-background-image-3.jpg',
      title: 'Book Your Perfect Ride',
      subtitle: 'Easy booking process with instant confirmation',
      description: 'Get behind the wheel in just a few simple steps'
    },
    {
      id: 4,
      image: '/images/Hero section/Hero-background-image-4.jpg',
      title: 'Explore With Confidence',
      subtitle: '24/7 customer support and roadside assistance',
      description: 'Travel with peace of mind knowing we\'ve got you covered'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroSlider}>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.heroSlide} ${index === currentSlide ? styles.active : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>{slide.title}</h1>
                <h2 className={styles.heroSubtitle}>{slide.subtitle}</h2>
                <p className={styles.heroDescription}>{slide.description}</p>
                <div className={styles.heroButtons}>
                  <Link to="/cars" className={`${styles.heroBtn} ${styles.primary}`}>
                    Browse Cars
                  </Link>
                  <Link to="/contact" className={`${styles.heroBtn} ${styles.secondary}`}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        className={`${styles.sliderBtn} ${styles.prevBtn}`}
        onClick={goToPrevSlide}
        aria-label="Previous slide"
      >
        &#8249;
      </button>
      <button 
        className={`${styles.sliderBtn} ${styles.nextBtn}`}
        onClick={goToNextSlide}
        aria-label="Next slide"
      >
        &#8250;
      </button>

      {/* Slide Indicators */}
      <div className={styles.sliderIndicators}>
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
