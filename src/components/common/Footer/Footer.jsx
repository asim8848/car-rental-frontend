import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Brand + About + Contact lines (centered) */}
          <div className={styles.footerSection}>
            <h3 className={styles.brandName}>RentaCar</h3>
            <p className={styles.brandDescription}>
              Your trusted partner for premium car rental services. We provide quality
              vehicles for every journey.
            </p>
            <div className={styles.brandContacts}>
              <div className={styles.contactLine}>� 123 Main Street, City, State 12345</div>
              <div className={styles.contactLine}>📞 (555) 123-4567</div>
              <div className={styles.contactLine}>✉ info@rentacar.com</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li><Link to="/" className={styles.footerLink}>Home</Link></li>
              <li><Link to="/cars" className={styles.footerLink}>Our Cars</Link></li>
              <li><Link to="/blog" className={styles.footerLink}>Blog</Link></li>
              <li><Link to="/contact" className={styles.footerLink}>Contact</Link></li>
              <li><Link to="/login" className={styles.footerLink}>Login</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Services</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.footerLink}>Economy Cars</a></li>
              <li><a href="#" className={styles.footerLink}>Luxury Vehicles</a></li>
              <li><a href="#" className={styles.footerLink}>SUVs & Trucks</a></li>
              <li><a href="#" className={styles.footerLink}>Electric Cars</a></li>
              <li><a href="#" className={styles.footerLink}>Long-term Rental</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Support</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.footerLink}>Help Center</a></li>
              <li><a href="#" className={styles.footerLink}>Terms of Service</a></li>
              <li><a href="#" className={styles.footerLink}>Privacy Policy</a></li>
              <li><a href="#" className={styles.footerLink}>Insurance Info</a></li>
              <li><a href="#" className={styles.footerLink}>24/7 Support</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.footerDivider} />

        {/* Footer Bottom */}
        <div className={styles.footerBottomCentered}>
          <p>
            © {currentYear} RentaCar. All rights reserved. | Designed for premium car rental experience.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
