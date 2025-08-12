import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.navbar}>
      {/* Mobile overlay */}
      <div 
        className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.active : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className={styles.navContainer}>
        {/* Logo */}
        <Link to="/" className={styles.navLogo}>
          <img 
            src="/images/rentacar_logo_150x50.png" 
            alt="Car Rental Logo" 
            className={styles.logoImage}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <Link 
              to="/" 
              className={`${styles.navLink} ${isActive('/')}`}
            >
              Home
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link 
              to="/cars" 
              className={`${styles.navLink} ${isActive('/cars')}`}
            >
              Cars
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link 
              to="/blog" 
              className={`${styles.navLink} ${isActive('/blog')}`}
            >
              Blog
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link 
              to="/contact" 
              className={`${styles.navLink} ${isActive('/contact')}`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop actions */}
        <div className={styles.navActions}>
          {user ? (
            <>
              <span className={styles.navUserGreeting}>Hi, {user.name}</span>
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                className={styles.navBtn}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navBtn}>Login</Link>
              <Link to="/checkout" className={`${styles.navBtn} ${styles.navBtnPrimary}`}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div 
          className={`${styles.navToggle} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <Link to="/" className={styles.navLogo} onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/images/rentacar_logo_150x50.png" alt="Car Rental Logo" className={styles.logoImage} />
          </Link>
          <div className={styles.mobileClose} onClick={() => setIsMobileMenuOpen(false)}>×</div>
        </div>
        <ul className={styles.mobileNavLinks}>
          <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.navLink}>Home</Link></li>
          <li><Link to="/cars" onClick={() => setIsMobileMenuOpen(false)} className={styles.navLink}>Cars</Link></li>
          <li><Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className={styles.navLink}>Blog</Link></li>
          <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={styles.navLink}>Contact</Link></li>
        </ul>
        <div className={styles.mobileNavActions}>
          {user ? (
            <>
              <span className={styles.navUserGreeting}>Hi, {user.name}</span>
              <button 
                onClick={() => { 
                  logout(); 
                  navigate('/'); 
                  setIsMobileMenuOpen(false); 
                }} 
                className={styles.navBtn}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navBtn} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/checkout" className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
