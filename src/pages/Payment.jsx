import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService, bookingService } from '../services/apiService';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './AccountPages.css';

// Dummy payment page: simulates a card form and saves order
const Payment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '', driverLicense: '' });
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' });

  // Card helpers (formatting + validation)
  const detectBrand = (num) => {
    const n = (num || '').replace(/\D/g, '');
    if (/^4/.test(n)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
    if (/^3[47]/.test(n)) return 'amex';
    if (/^6(011|5)/.test(n)) return 'discover';
    return 'card';
  };

  const formatCardNumber = (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, 19);
    const brand = detectBrand(digits);
    if (brand === 'amex') {
      return digits
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(\d{4} \d{6})(\d)/, '$1 $2')
        .trim();
    }
    return digits
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4} \d{4})(\d)/, '$1 $2')
      .replace(/(\d{4} \d{4} \d{4})(\d)/, '$1 $2')
      .trim();
  };

  const formatExpiry = (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const validateExpiry = (mmYY) => {
    const m = (mmYY || '').match(/^(\d{2})\/(\d{2})$/);
    if (!m) return false;
    const month = parseInt(m[1], 10);
    if (month < 1 || month > 12) return false;
    const year = parseInt(`20${m[2]}`, 10);
    const now = new Date();
    const endOfMonth = new Date(year, month, 0);
    return endOfMonth >= new Date(now.getFullYear(), now.getMonth(), 1);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const c = await cartService.getCart();
        setCart(c);
        // prefill from checkout step if any
        try {
          const saved = JSON.parse(localStorage.getItem('checkout_customer') || 'null');
          if (saved) {
            const [firstName, ...rest] = (saved.name || '').split(' ');
            setCustomer({
              firstName: firstName || '',
              lastName: rest.join(' ').trim(),
              email: saved.email || '',
              phone: saved.phone || '',
              driverLicense: saved.license || '',
            });
          }
        } catch {}
      } catch (e) {
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const total = useMemo(() => cart?.items?.reduce((s, it) => s + (it.totalPrice || 0), 0) || 0, [cart]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) return toast.info('Cart is empty');
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone || !customer.driverLicense) {
      return toast.warn('Please complete customer info');
    }

  const cleanNumber = card.number.replace(/\s/g, '');
  const brand = detectBrand(cleanNumber);
    const cvcLen = brand === 'amex' ? 4 : 3;
    if (!card.name.trim()) return toast.warn('Enter cardholder name');
    if (!validateExpiry(card.expiry)) return toast.warn('Enter a valid expiry (MM/YY)');
    if (!/^\d+$/.test(card.cvc) || card.cvc.length !== cvcLen) return toast.warn(`CVC must be ${cvcLen} digits`);

    try {
      setPaying(true);
      // for each cart item, create a booking (order)
      for (const it of cart.items) {
        await bookingService.createBooking({
          carId: it.car._id || it.car,
          startDate: it.startDate,
          endDate: it.endDate,
          pickupLocation: 'main-office',
          dropoffLocation: 'same',
          customerInfo: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            driverLicense: customer.driverLicense,
          },
          paymentInfo: {
            paymentMethod: 'credit_card',
            paymentStatus: 'completed',
            transactionId: `DUMMY-${Date.now()}`,
          },
        });
      }
  // server createBooking already clears cart; sync UI count immediately
  await clearCart();
      toast.success('Order confirmed!');
      navigate('/orders');
    } catch (err) {
      toast.error(err?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="enhanced-loading">
        <div className="enhanced-loading-spinner"></div>
        <h2>Loading payment details</h2>
        <p>Please wait while we prepare your payment information...</p>
      </div>
    );
  }

  return (
    <main>
      {/* Enhanced Hero Section */}
      <section className="enhanced-hero">
        <div className="container enhanced-hero-content">
          <div className="enhanced-hero-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <h1>Complete Payment</h1>
          <p>Secure checkout for your vehicle rental reservation</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="enhanced-section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="enhanced-breadcrumb">
            <Link to="/">Home</Link>
            <span className="enhanced-breadcrumb-separator">›</span>
            <Link to="/cart">Cart</Link>
            <span className="enhanced-breadcrumb-separator">›</span>
            <span>Payment</span>
          </nav>

          {!cart?.items?.length ? (
            <div className="enhanced-empty-state">
              <div className="enhanced-empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <h3>Your cart is empty</h3>
              <p>Add some vehicles to your cart before proceeding to payment.</p>
              <Link to="/cars" className="enhanced-btn enhanced-btn-primary enhanced-btn-lg">
                Browse Vehicles
              </Link>
            </div>
          ) : (
            <div className="enhanced-cart-container">
              {/* Customer Information Form */}
              <div className="enhanced-card">
                <div className="enhanced-card-header">
                  <h2 className="enhanced-card-title">Customer Information</h2>
                  <p className="enhanced-card-subtitle">Complete your details to finalize the booking</p>
                </div>
                <div className="enhanced-card-content">
                  <form onSubmit={handlePay}>
                    <div className="enhanced-form-row">
                      <div className="enhanced-form-group">
                        <label className="enhanced-form-label required">First Name</label>
                        <input 
                          className="enhanced-form-input" 
                          value={customer.firstName}
                          onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div className="enhanced-form-group">
                        <label className="enhanced-form-label required">Last Name</label>
                        <input 
                          className="enhanced-form-input" 
                          value={customer.lastName}
                          onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="enhanced-form-row">
                      <div className="enhanced-form-group">
                        <label className="enhanced-form-label required">Email Address</label>
                        <input 
                          type="email" 
                          className="enhanced-form-input" 
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="enhanced-form-group">
                        <label className="enhanced-form-label required">Phone Number</label>
                        <input 
                          type="tel" 
                          className="enhanced-form-input" 
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div className="enhanced-form-group">
                      <label className="enhanced-form-label required">Driver's License Number</label>
                      <input 
                        className="enhanced-form-input" 
                        value={customer.driverLicense}
                        onChange={(e) => setCustomer({ ...customer, driverLicense: e.target.value })}
                        placeholder="DL123456789"
                        required
                      />
                      <div className="enhanced-form-help">
                        A valid driver's license is required for vehicle rental
                      </div>
                    </div>

                    {/* Payment Method Section */}
                    <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--neutral-200)' }}>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 'var(--font-weight-semibold)', 
                        color: 'var(--primary-blue)', 
                        marginBottom: 'var(--space-4)',
                        paddingBottom: 'var(--space-2)',
                        borderBottom: '2px solid var(--primary-blue-light)'
                      }}>
                        Payment Method
                      </h3>

                      {/* Secure Card Form (demo) */}
                      <div className="payment-panel">
                        <div className="payment-panel-header">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="payment-lock">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                          <div>
                            <div className="payment-title">Secure Card Payment</div>
                            <div className="payment-subtitle">Demo only - no charges will be made</div>
                          </div>
                        </div>

                        <div className="enhanced-form-group">
                          <label className="enhanced-form-label required">Cardholder Name</label>
                          <input
                            className="enhanced-form-input"
                            placeholder="Name on card"
                            value={card.name}
                            onChange={(e) => setCard({ ...card, name: e.target.value })}
                            autoComplete="cc-name"
                            required
                          />
                        </div>

                        <div className="enhanced-form-row">
                          <div className="enhanced-form-group">
                            <label className="enhanced-form-label required">Card Number</label>
                            <div className="card-number-wrap">
                              <input
                                inputMode="numeric"
                                pattern="[0-9 ]*"
                                className="enhanced-form-input"
                                placeholder="1234 5678 9012 3456"
                                value={card.number}
                                onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                                autoComplete="cc-number"
                                required
                              />
                              <span className={`card-brand-badge ${detectBrand(card.number).toString()}`}>
                                {detectBrand(card.number)}
                              </span>
                            </div>
                          </div>
                          <div className="enhanced-form-group">
                            <label className="enhanced-form-label required">Expiry</label>
                            <input
                              inputMode="numeric"
                              pattern="\d{2}/\d{2}"
                              className="enhanced-form-input"
                              placeholder="MM/YY"
                              value={card.expiry}
                              onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                              autoComplete="cc-exp"
                              required
                            />
                          </div>
                          <div className="enhanced-form-group">
                            <label className="enhanced-form-label required">CVC</label>
                            <input
                              inputMode="numeric"
                              pattern="\d{3,4}"
                              className="enhanced-form-input"
                              placeholder={detectBrand(card.number) === 'amex' ? '4 digits' : '3 digits'}
                              value={card.cvc}
                              onChange={(e) => {
                                const max = detectBrand(card.number) === 'amex' ? 4 : 3;
                                const v = (e.target.value || '').replace(/\D/g, '').slice(0, max);
                                setCard({ ...card, cvc: v });
                              }}
                              autoComplete="cc-csc"
                              required
                            />
                          </div>
                        </div>

                        <div className="payment-disclaimer">
                          We do not store your card details. This is a demo form for simulation purposes only.
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="enhanced-btn enhanced-btn-success enhanced-btn-lg" 
                        disabled={paying}
                        style={{ width: '100%' }}
                      >
                        {paying ? (
                          <>
                            <div style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                            Complete Payment - ${total}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Summary */}
              <div className="enhanced-summary-card">
                <h3 className="enhanced-summary-header">Order Summary</h3>
                
                <div className="enhanced-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {(cart.items || []).map((it) => (
                    <div key={it.car?._id || it.car} style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--neutral-200)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <img 
                          src={`/images/${it.car?.image || 'placeholder.png'}`} 
                          alt={`${it.car?.brand || ''} ${it.car?.model || ''}`}
                          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                          onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--neutral-800)' }}>
                            {it.car?.brand} {it.car?.model}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                            {it.days} days × ${it.pricePerDay}
                          </div>
                        </div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-800)' }}>
                          ${it.totalPrice}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                        {new Date(it.startDate).toLocaleDateString()} - {new Date(it.endDate).toLocaleDateString()}
                      </div>
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
                    Your payment and personal information are protected with bank-level security encryption.
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

export default Payment;
