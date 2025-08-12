import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CarCard.module.css';

const CarCard = ({ car, onAddToCart, isInCart = false, showAddToCart = true }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(car);
    }
  };

  return (
    <div className={styles.carCard}>
      <Link to={`/car-details/${car.id}`} className={styles.cardLink}>
        {/* Car Image */}
        <div className={styles.imageContainer}>
          <img 
            src={car.image} 
            alt={car.name}
            className={styles.carImage}
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
          <div className={styles.imageOverlay}>
            <span className={styles.viewDetails}>View Details</span>
          </div>
        </div>

        {/* Car Info */}
        <div className={styles.cardContent}>
          <div className={styles.carHeader}>
            <h3 className={styles.carName}>{car.name}</h3>
            <span className={styles.carType}>{car.type}</span>
          </div>
          
          <p className={styles.carModel}>{car.model}</p>

          {/* Car Features */}
          <div className={styles.carFeatures}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>👥</span>
              <span className={styles.featureText}>{car.seats} Seats</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚙️</span>
              <span className={styles.featureText}>{car.transmission}</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⛽</span>
              <span className={styles.featureText}>{car.fuelType}</span>
            </div>
            {car.mpg && (
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📊</span>
                <span className={styles.featureText}>{car.mpg} MPG</span>
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className={styles.cardFooter}>
            <div className={styles.priceContainer}>
              <span className={styles.price}>${car.price}</span>
              <span className={styles.priceUnit}>/day</span>
            </div>
            
            {showAddToCart && (
              <button 
                className={`${styles.addToCartBtn} ${isInCart ? styles.inCart : ''}`}
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarCard;
