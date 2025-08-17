import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService } from '../services/apiService';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './AccountPages.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({}); // carId -> {startDate,endDate,days}
  const { setFromCart, removeFromCart } = useCart();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
  setCart(data);
  setFromCart(data);
      // seed editing with current items
      const next = {};
      (data.items || []).forEach((it) => {
        next[it.car?._id || it.car] = {
          startDate: it.startDate?.slice(0, 10) || '',
          endDate: it.endDate?.slice(0, 10) || '',
          days: it.days || 0,
        };
      });
      setEditing(next);
    } catch (err) {
      toast.error(err?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [setFromCart]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const total = useMemo(() => cart?.items?.reduce((s, it) => s + (it.totalPrice || 0), 0) || 0, [cart]);

  const updateItem = async (carId) => {
    try {
      const e = editing[carId];
      if (!e?.startDate || !e?.endDate) return toast.warn('Select start and end dates');
      const start = new Date(e.startDate); const end = new Date(e.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days <= 0) return toast.warn('End date must be after start date');
  const res = await cartService.addToCart({ carId, startDate: e.startDate, endDate: e.endDate, days });
  setCart(res); setFromCart(res);
      toast.success('Cart updated');
    } catch (err) {
      toast.error(err?.message || 'Failed to update item');
    }
  };

  const removeItem = async (carId) => {
    try {
  const res = await removeFromCart(carId);
  setCart(res);
      toast.success('Item removed');
    } catch (err) {
      toast.error(err?.message || 'Failed to remove');
    }
  };

  const goToPayment = () => {
    if (!cart || !cart.items?.length) return toast.info('Cart is empty');
    navigate('/payment');
  };

  const getImagePath = (imageName) => `/images/${imageName || 'placeholder.png'}`;

  if (loading) {
    return (
      <div className="enhanced-loading">
        <div className="enhanced-loading-spinner"></div>
        <h2>Loading your cart</h2>
        <p>Please wait while we fetch your items...</p>
      </div>
    );
  }

  return (
    <main>
      <section className="enhanced-hero">
        <div className="container enhanced-hero-content">
          <div className="enhanced-hero-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h1>Your Cart</h1>
          <p>Review and manage your selected vehicles before proceeding to checkout</p>
        </div>
      </section>

      <section className="enhanced-section">
        <div className="container">
          <nav className="enhanced-breadcrumb">
            <Link to="/">Home</Link>
            <span className="enhanced-breadcrumb-separator">›</span>
            <span>Cart</span>
          </nav>

          {!cart?.items?.length ? (
            <div className="enhanced-empty-state">
              <div className="enhanced-empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <h3>Your cart is empty</h3>
              <p>Start browsing our amazing collection of vehicles and add your favorites to get started.</p>
              <Link to="/cars" className="enhanced-btn enhanced-btn-primary enhanced-btn-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                Browse Vehicles
              </Link>
            </div>
          ) : (
            <div className="enhanced-cart-container">
              <div className="enhanced-card">
                <div className="enhanced-card-header">
                  <h2 className="enhanced-card-title">Cart Items</h2>
                  <p className="enhanced-card-subtitle">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>
                <div className="enhanced-card-content">
                  {(cart.items || []).map((it) => {
                    const car = it.car || {}; 
                    const id = car._id || it.car;
                    const edit = editing[id] || {};
                    
                    // Auto-calculate days when dates change
                    const calculateDays = (startDate, endDate) => {
                      if (!startDate || !endDate) return 0;
                      const start = new Date(startDate);
                      const end = new Date(endDate);
                      const diffTime = end.getTime() - start.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays > 0 ? diffDays : 0;
                    };

                    const currentDays = calculateDays(edit.startDate, edit.endDate);
                    const estimatedTotal = currentDays * (it.pricePerDay || 0);
                    const hasDateChanges = edit.startDate !== it.startDate?.slice(0, 10) || edit.endDate !== it.endDate?.slice(0, 10);
                    
                    return (
                      <div key={id} className="enhanced-cart-item-modern">
                        <div className="enhanced-cart-item-layout">
                          <div className="enhanced-cart-item-left">
                            <img
                              src={getImagePath(car.image)}
                              alt={`${car.brand || ''} ${car.model || ''}`}
                              className="enhanced-cart-item-image-modern"
                              onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                            />
                          </div>
                          
                          <div className="enhanced-cart-item-center">
                            <div className="enhanced-cart-item-info-inline">
                              <h3 className="enhanced-cart-item-title">{car.brand || 'Car'} {car.model || ''}</h3>
                              <div className="enhanced-cart-item-specs">
                                {car.transmission && (<span className="enhanced-spec-badge">{car.transmission}</span>)}
                                {car.seats && (<span className="enhanced-spec-badge">{car.seats} seats</span>)}
                                {car.fuelType && (<span className="enhanced-spec-badge">{car.fuelType}</span>)}
                              </div>
                              <div className="enhanced-cart-item-details-list">
                                <div className="enhanced-detail-item">
                                  <span className="enhanced-detail-label">Year:</span>
                                  <span className="enhanced-detail-value">{car.year || 'N/A'}</span>
                                </div>
                                <div className="enhanced-detail-item">
                                  <span className="enhanced-detail-label">Rate:</span>
                                  <span className="enhanced-detail-value">${it.pricePerDay} / day</span>
                                </div>
                              </div>
                            </div>
                            <div className="enhanced-rental-period">
                              <div className="enhanced-date-input-group">
                                <label className="enhanced-date-label">Pick-up Date</label>
                                <input 
                                  type="date" 
                                  className="enhanced-date-input" 
                                  value={edit.startDate || ''} 
                                  min={new Date().toISOString().split('T')[0]}
                                  onChange={(e) => {
                                    const newEditing = { 
                                      ...editing, 
                                      [id]: { ...editing[id], startDate: e.target.value } 
                                    };
                                    setEditing(newEditing);
                                    
                                    // Auto-update if both dates are set
                                    if (e.target.value && edit.endDate && e.target.value < edit.endDate) {
                                      setTimeout(() => updateItem(id), 300);
                                    }
                                  }} 
                                />
                              </div>
                              <div className="enhanced-date-separator">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                              </div>
                              <div className="enhanced-date-input-group">
                                <label className="enhanced-date-label">Return Date</label>
                                <input 
                                  type="date" 
                                  className="enhanced-date-input" 
                                  value={edit.endDate || ''} 
                                  min={edit.startDate || new Date().toISOString().split('T')[0]}
                                  onChange={(e) => {
                                    const newEditing = { 
                                      ...editing, 
                                      [id]: { ...editing[id], endDate: e.target.value } 
                                    };
                                    setEditing(newEditing);
                                    
                                    // Auto-update if both dates are set
                                    if (edit.startDate && e.target.value && edit.startDate < e.target.value) {
                                      setTimeout(() => updateItem(id), 300);
                                    }
                                  }} 
                                />
                              </div>
                            </div>
                            
                          </div>
                          
                          <div className="enhanced-cart-item-right">
                            <div className="enhanced-price-summary">
                              {(() => {
                                const displayedDays = currentDays > 0 ? currentDays : (it.days || 0);
                                return (
                                  <div className="enhanced-duration-display">
                                    <span className="enhanced-duration-number">{displayedDays}</span>
                                    <span className="enhanced-duration-label">{displayedDays === 1 ? 'day' : 'days'}</span>
                                  </div>
                                );
                              })()}
                              <div className="enhanced-total-price">${it.totalPrice}</div>
                              {hasDateChanges && currentDays > 0 && currentDays !== it.days && (
                                <div className="enhanced-price-preview">
                                  New total: ${estimatedTotal}
                                </div>
                              )}
                            </div>
                            
                            <button 
                              type="button" 
                              className="enhanced-remove-btn" 
                              onClick={() => removeItem(id)}
                              title="Remove from cart"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="enhanced-checkout-section">
                    <div className="enhanced-checkout-summary">
                      <div className="enhanced-checkout-info">
                        <h4>Ready to proceed?</h4>
                        <p>Complete your booking with our secure checkout process</p>
                      </div>
                      <div className="enhanced-checkout-total">
                        <span className="enhanced-total-label">Total Amount</span>
                        <span className="enhanced-total-amount">${total}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="enhanced-checkout-btn" 
                      onClick={goToPayment}
                    >
                      <span className="enhanced-checkout-btn-text">Proceed to Checkout</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="enhanced-checkout-btn-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="enhanced-summary-card">
                <h3 className="enhanced-summary-header">Order Summary</h3>
                
                <div className="enhanced-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {(cart.items || []).map((it) => (
                    <div key={it.car?._id || it.car} className="enhanced-summary-row">
                      <div>
                        <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--neutral-800)' }}>
                          {it.car?.brand} {it.car?.model}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                          {it.days} days × ${it.pricePerDay}
                        </div>
                      </div>
                      <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>${it.totalPrice}</span>
                    </div>
                  ))}
                </div>
                
                <div className="enhanced-summary-total">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Total Amount</span>
                    <span>${total}</span>
                  </div>
                </div>
                
                {/* Security Notice */}
                <div className="enhanced-security-notice">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="enhanced-security-notice-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p className="enhanced-security-notice-text">
                    Your booking information is secure and encrypted. All transactions are protected.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Cart;
