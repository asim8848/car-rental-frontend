import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Navbar.module.css';
import { useCart } from '../../../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const { count, refreshCart } = useCart();

  useEffect(() => {
    // mirror context count to local for stable rendering
    setCartCount(count || 0);
  }, [count]);

  useEffect(() => {
    // refresh on route changes (e.g., after mutations on other pages)
    if (user) refreshCart(); else setCartCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname]);

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
              <Link to="/cart" className={styles.navBtn}>
                <span className={styles.navIconWrap}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.25 2.25h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
                  {cartCount > 0 && <span className={styles.navBadge}>{cartCount}</span>}
                </span>
                Cart
              </Link>
              <Link to="/orders" className={styles.navBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.75 6.75A2.25 2.25 0 016 4.5h12a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25V6.75z"/></svg>
                Orders
              </Link>
              <Link to="/change-password" className={styles.navBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5A2.25 2.25 0 0019.5 19.5v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75A2.25 2.25 0 006.75 21.75z"/></svg>
                Password
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                className={styles.navBtn}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15"/><path d="M12 9l3 3m0 0l-3 3m3-3H3"/></svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3H6A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15"/><path d="M12 9l3 3m0 0l-3 3m3-3H3"/></svg>
                Login
              </Link>
              <Link to="/checkout" className={`${styles.navBtn} ${styles.navBtnPrimary}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 12a7.5 7.5 0 117.5 7.5M12 6v6l3 3"/></svg>
                Get Started
              </Link>
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
              <Link to="/cart" className={styles.navBtn} onClick={() => setIsMobileMenuOpen(false)}>
                <span className={styles.navIconWrap}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.25 2.25h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
                  {cartCount > 0 && <span className={styles.navBadge}>{cartCount}</span>}
                </span>
                Cart
              </Link>
              <Link to="/orders" className={styles.navBtn} onClick={() => setIsMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.75 6.75A2.25 2.25 0 016 4.5h12a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25V6.75z"/></svg>
                Orders
              </Link>
              <Link to="/change-password" className={styles.navBtn} onClick={() => setIsMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5A2.25 2.25 0 0019.5 19.5v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75A2.25 2.25 0 006.75 21.75z"/></svg>
                Password
              </Link>
              <button 
                onClick={() => { 
                  logout(); 
                  navigate('/'); 
                  setIsMobileMenuOpen(false); 
                }} 
                className={styles.navBtn}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15"/><path d="M12 9l3 3m0 0l-3 3m3-3H3"/></svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navBtn} onClick={() => setIsMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3H6A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15"/><path d="M12 9l3 3m0 0l-3 3m3-3H3"/></svg>
                Login
              </Link>
              <Link to="/checkout" className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={() => setIsMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 12a7.5 7.5 0 117.5 7.5M12 6v6l3 3"/></svg>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
