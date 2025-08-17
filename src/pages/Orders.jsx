import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/apiService';
import './AccountPages.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getUserBookings();
        setOrders(data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="enhanced-loading">
        <div className="enhanced-loading-spinner"></div>
        <h2>Loading your orders</h2>
        <p>Please wait while we fetch your booking history...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <h1>Your Orders</h1>
          <p>Track and manage your rental bookings and booking history</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="enhanced-section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="enhanced-breadcrumb">
            <Link to="/">Home</Link>
            <span className="enhanced-breadcrumb-separator">›</span>
            <span>Orders</span>
          </nav>

          {!orders.length ? (
            <div className="enhanced-empty-state">
              <div className="enhanced-empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3>No orders yet</h3>
              <p>You haven't made any bookings yet. Start exploring our vehicle collection and make your first rental.</p>
              <Link to="/cars" className="enhanced-btn enhanced-btn-primary enhanced-btn-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                Browse Vehicles
              </Link>
            </div>
          ) : (
            <div className="enhanced-card">
              <div className="enhanced-card-header">
                <h2 className="enhanced-card-title">Order History</h2>
                <p className="enhanced-card-subtitle">{orders.length} {orders.length === 1 ? 'order' : 'orders'} found</p>
              </div>
              <div className="enhanced-card-content">
                <div className="enhanced-scrollbar" style={{ overflowX: 'auto' }}>
                  <table className="enhanced-orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Booking Date</th>
                        <th>Vehicle Details</th>
                        <th>Rental Period</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const date = new Date(order.createdAt);
                        const startDate = new Date(order.startDate);
                        const endDate = new Date(order.endDate);
                        const statusClass = `enhanced-status-badge enhanced-status-${(order.status || 'pending').toLowerCase()}`;
                        
                        return (
                          <tr key={order._id} className="enhanced-animate-in">
                            <td>
                              <div className="enhanced-order-id">#{order._id.slice(-8).toUpperCase()}</div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.875rem', color: 'var(--neutral-800)' }}>
                                {date.toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                                {date.toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <img 
                                  src={`/images/${order.car?.image || 'placeholder.png'}`} 
                                  alt={`${order.car?.brand || ''} ${order.car?.model || ''}`}
                                  style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--neutral-200)' }}
                                  onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                                />
                                <div>
                                  <div style={{ fontSize: '0.875rem', fontWeight: 'var(--font-weight-medium)', color: 'var(--neutral-800)' }}>
                                    {order.car?.brand} {order.car?.model}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                                    {order.car?.year} • {order.car?.transmission}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.875rem', color: 'var(--neutral-800)' }}>
                                {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -
                              </div>
                              <div style={{ fontSize: '0.875rem', color: 'var(--neutral-800)' }}>
                                {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                                {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} days
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '1rem', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-800)' }}>
                                ${order.totalPrice}
                              </div>
                            </td>
                            <td>
                              <span className={statusClass}>
                                {order.status === 'pending' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '12px', height: '12px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {order.status === 'confirmed' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '12px', height: '12px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {order.status === 'completed' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '12px', height: '12px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                                {order.status === 'cancelled' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '12px', height: '12px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                                {order.status || 'pending'}
                              </span>
                            </td>
                            {/* Actions removed intentionally for a cleaner history view */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination would go here if needed */}
                {orders.length > 10 && (
                  <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                    <button className="enhanced-btn enhanced-btn-secondary">
                      Load More Orders
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Orders;
