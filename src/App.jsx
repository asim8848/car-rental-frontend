import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import Home from './pages/Home/Home';
import Cars from './pages/Cars';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import CarDetails from './pages/CarDetails';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Router>
          <Navbar />
          <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/car-details/:carId" element={<CarDetails />} />
            <Route path="/car-details" element={
              <div style={{ marginTop: '80px', padding: '2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  <h1>Car Details Page</h1>
                  <p>Please select a car from the cars page to view details.</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
    </AuthProvider>
  );
}

export default App;
