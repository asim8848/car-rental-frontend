import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
              <li><Link to="/cars" className={styles.footerLink}>Economy Cars</Link></li>
              <li><Link to="/cars" className={styles.footerLink}>Luxury Vehicles</Link></li>
              <li><Link to="/cars" className={styles.footerLink}>SUVs & Trucks</Link></li>
              <li><Link to="/cars" className={styles.footerLink}>Electric Cars</Link></li>
              <li><Link to="/cars" className={styles.footerLink}>Long-term Rental</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Support</h3>
            <ul className={styles.linkList}>
              <li>
                <button type="button" className={styles.footerLinkBtn} onClick={() => toast.info('Help Center coming soon')}>
                  Help Center
                </button>
              </li>
              <li>
                <button type="button" className={styles.footerLinkBtn} onClick={() => toast.info('Terms of Service coming soon')}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button type="button" className={styles.footerLinkBtn} onClick={() => toast.info('Privacy Policy coming soon')}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" className={styles.footerLinkBtn} onClick={() => toast.info('Insurance information coming soon')}>
                  Insurance Info
                </button>
              </li>
              <li>
                <button type="button" className={styles.footerLinkBtn} onClick={() => toast.info('24/7 Support coming soon')}>
                  24/7 Support
                </button>
              </li>
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
