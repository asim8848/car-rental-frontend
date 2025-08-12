import React from 'react';
import Navbar from '../common/Navbar/Navbar';
import Footer from '../common/Footer/Footer';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
