import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { carService } from '../services/apiService';
import { toast } from 'react-toastify';
import './AccountPages.css';

const dailyExtraCosts = {
	insurance: 15,
	gps: 8,
	'child-seat': 12,
	wifi: 10,
};

const TAXES_FLAT = 25;

const Checkout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [car, setCar] = useState(null);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		license: '',
		pickupDate: '',
		returnDate: '',
		pickupLocation: 'main-office',
		returnLocation: 'same',
		specialRequests: '',
		insurance: false,
		gps: false,
		'child-seat': false,
		wifi: false,
		terms: false,
	});

	// Fetch car data based on carId from location state or localStorage
	useEffect(() => {
		const fetchCarData = async () => {
			try {
				setLoading(true);
				
				// Get carId from location state (from "Rent Now" button) or localStorage (from "Add to Cart")
				const carId = location.state?.carId || localStorage.getItem('selectedCarId');
				
				if (carId) {
					const carData = await carService.getCarById(carId);
					setCar(carData);
					// Clear localStorage after using it
					localStorage.removeItem('selectedCarId');
				} else {
					// If no carId, redirect to cars page
					toast.error('Please select a car first');
					navigate('/cars');
					return;
				}
			} catch (error) {
				console.error('Error fetching car data:', error);
				toast.error('Failed to load car details');
				navigate('/cars');
			} finally {
				setLoading(false);
			}
		};

		fetchCarData();
	}, [location.state, navigate]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
	};

	// Calculate rental duration in days (minimum 0)
	const rentalDays = useMemo(() => {
		if (!form.pickupDate || !form.returnDate) return 0;
		const start = new Date(form.pickupDate);
		const end = new Date(form.returnDate);
		const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
		return diff > 0 ? diff : 0;
	}, [form.pickupDate, form.returnDate]);

		const baseDailyRate = car?.price || 0; // using 'price' field from carsData as daily rate
	const carCost = rentalDays * baseDailyRate;

	const extrasDaily = Object.entries(dailyExtraCosts)
		.filter(([k]) => form[k])
		.reduce((sum, [, v]) => sum + v, 0);
	const extrasCost = rentalDays * extrasDaily;
	const insuranceCost = form.insurance ? rentalDays * dailyExtraCosts.insurance : 0;

	const subtotal = carCost + extrasCost + TAXES_FLAT;
	const total = subtotal;

		const handleSubmit = (e) => {
			e.preventDefault();
			if (!form.terms) {
				alert('Please agree to Terms & Privacy Policy');
				return;
			}
			// Save minimal customer info for payment step and go to payment
			try {
				localStorage.setItem('checkout_customer', JSON.stringify({
					name: form.name,
					email: form.email,
					phone: form.phone,
					license: form.license,
				}));
			} catch {}
			navigate('/payment');
		};



	// Ensure return date not before pickup
	useEffect(() => {
		if (form.pickupDate && form.returnDate && new Date(form.returnDate) < new Date(form.pickupDate)) {
			setForm((f) => ({ ...f, returnDate: '' }));
		}
	}, [form.pickupDate, form.returnDate]);

	return (
		<main>
			{loading ? (
				<div className="enhanced-loading">
					<div className="enhanced-loading-spinner"></div>
					<h2>Loading checkout details</h2>
					<p>Please wait while we prepare your booking information...</p>
				</div>
			) : (
				<>
					{/* Enhanced Hero Section */}
					<section className="enhanced-hero">
						<div className="container enhanced-hero-content">
							<div className="enhanced-hero-icon">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
								</svg>
							</div>
							<h1>Complete Your Booking</h1>
							<p>You're just a few steps away from experiencing your perfect ride</p>
						</div>
					</section>

					{/* Main Content */}
					<section className="enhanced-section">
						<div className="container">
							{/* Breadcrumb */}
							<nav className="enhanced-breadcrumb">
								<a href="/">Home</a>
								<span className="enhanced-breadcrumb-separator">›</span>
								<a href="/cars">Vehicles</a>
								<span className="enhanced-breadcrumb-separator">›</span>
								<span>Checkout</span>
							</nav>

							<div className="enhanced-cart-container">
								{/* Booking Form */}
								<div className="enhanced-card">
									<div className="enhanced-card-header">
										<h2 className="enhanced-card-title">Booking Details</h2>
										<p className="enhanced-card-subtitle">Complete the form below to finalize your reservation</p>
									</div>
									<div className="enhanced-card-content">
										<form onSubmit={handleSubmit}>
											{/* Personal Information Section */}
											<div style={{ marginBottom: 'var(--space-8)' }}>
												<h3 style={{ 
													fontSize: '1.125rem', 
													fontWeight: 'var(--font-weight-semibold)', 
													color: 'var(--primary-blue)', 
													marginBottom: 'var(--space-4)',
													paddingBottom: 'var(--space-2)',
													borderBottom: '2px solid var(--primary-blue-light)'
												}}>
													Personal Information
												</h3>
												
												<div className="enhanced-form-row">
													<div className="enhanced-form-group">
														<label htmlFor="name" className="enhanced-form-label required">Full Name</label>
														<input 
															id="name" 
															name="name" 
															type="text" 
															className="enhanced-form-input" 
															required 
															value={form.name} 
															onChange={handleChange}
															placeholder="Enter your full name"
														/>
													</div>
													<div className="enhanced-form-group">
														<label htmlFor="email" className="enhanced-form-label required">Email Address</label>
														<input 
															id="email" 
															name="email" 
															type="email" 
															className="enhanced-form-input" 
															required 
															value={form.email} 
															onChange={handleChange}
															placeholder="your@email.com"
														/>
													</div>
												</div>

												<div className="enhanced-form-row">
													<div className="enhanced-form-group">
														<label htmlFor="phone" className="enhanced-form-label required">Phone Number</label>
														<input 
															id="phone" 
															name="phone" 
															type="tel" 
															className="enhanced-form-input" 
															required 
															value={form.phone} 
															onChange={handleChange}
															placeholder="+1 (555) 123-4567"
														/>
													</div>
													<div className="enhanced-form-group">
														<label htmlFor="license" className="enhanced-form-label required">Driver's License Number</label>
														<input 
															id="license" 
															name="license" 
															type="text" 
															className="enhanced-form-input" 
															required 
															value={form.license} 
															onChange={handleChange}
															placeholder="DL123456789"
														/>
													</div>
												</div>
											</div>

											{/* Rental Details Section */}
											<div style={{ marginBottom: 'var(--space-8)' }}>
												<h3 style={{ 
													fontSize: '1.125rem', 
													fontWeight: 'var(--font-weight-semibold)', 
													color: 'var(--primary-blue)', 
													marginBottom: 'var(--space-4)',
													paddingBottom: 'var(--space-2)',
													borderBottom: '2px solid var(--primary-blue-light)'
												}}>
													Rental Details
												</h3>

												<div className="enhanced-form-group">
													<label htmlFor="selected-car" className="enhanced-form-label">Selected Vehicle</label>
													<div style={{
														padding: 'var(--space-4)',
														background: 'var(--neutral-50)',
														border: '1px solid var(--neutral-200)',
														borderRadius: 'var(--radius-lg)',
														display: 'flex',
														alignItems: 'center',
														gap: 'var(--space-4)'
													}}>
														{car && (
															<>
																<div style={{
																	width: '80px',
																	height: '60px',
																	background: 'var(--neutral-200)',
																	borderRadius: 'var(--radius-md)',
																	backgroundImage: `url(/images/${car.image || 'placeholder.png'})`,
																	backgroundSize: 'cover',
																	backgroundPosition: 'center'
																}}></div>
																<div>
																	<div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-800)' }}>
																		{car.brand} {car.model}
																	</div>
																	<div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
																		{car.year} • {car.transmission} • ${car.price}/day
																	</div>
																</div>
															</>
														)}
													</div>
												</div>

												<div className="enhanced-form-row">
													<div className="enhanced-form-group">
														<label htmlFor="pickupDate" className="enhanced-form-label required">Pickup Date</label>
														<input 
															id="pickupDate" 
															name="pickupDate" 
															type="date" 
															className="enhanced-form-input" 
															required 
															value={form.pickupDate} 
															onChange={handleChange}
															min={new Date().toISOString().split('T')[0]}
														/>
													</div>
													<div className="enhanced-form-group">
														<label htmlFor="returnDate" className="enhanced-form-label required">Return Date</label>
														<input 
															id="returnDate" 
															name="returnDate" 
															type="date" 
															className="enhanced-form-input" 
															required 
															value={form.returnDate} 
															onChange={handleChange}
															min={form.pickupDate || new Date().toISOString().split('T')[0]}
														/>
													</div>
												</div>

												<div className="enhanced-form-row">
													<div className="enhanced-form-group">
														<label htmlFor="pickupLocation" className="enhanced-form-label">Pickup Location</label>
														<select 
															id="pickupLocation" 
															name="pickupLocation" 
															className="enhanced-form-input" 
															value={form.pickupLocation} 
															onChange={handleChange}
														>
															<option value="main-office">Main Office</option>
															<option value="airport">Airport</option>
															<option value="downtown">Downtown</option>
														</select>
													</div>
													<div className="enhanced-form-group">
														<label htmlFor="returnLocation" className="enhanced-form-label">Return Location</label>
														<select 
															id="returnLocation" 
															name="returnLocation" 
															className="enhanced-form-input" 
															value={form.returnLocation} 
															onChange={handleChange}
														>
															<option value="same">Same as pickup</option>
															<option value="main-office">Main Office</option>
															<option value="airport">Airport</option>
															<option value="downtown">Downtown</option>
														</select>
													</div>
												</div>
											</div>

											{/* Extras Section */}
											<div style={{ marginBottom: 'var(--space-8)' }}>
												<h3 style={{ 
													fontSize: '1.125rem', 
													fontWeight: 'var(--font-weight-semibold)', 
													color: 'var(--primary-blue)', 
													marginBottom: 'var(--space-4)',
													paddingBottom: 'var(--space-2)',
													borderBottom: '2px solid var(--primary-blue-light)'
												}}>
													Add-ons & Extras
												</h3>

												<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
													{[
														{ key: 'insurance', label: 'Comprehensive Insurance', price: 15, desc: 'Full coverage protection' },
														{ key: 'gps', label: 'GPS Navigation', price: 8, desc: 'Turn-by-turn navigation' },
														{ key: 'child-seat', label: 'Child Safety Seat', price: 12, desc: 'Certified child seat' },
														{ key: 'wifi', label: 'Wi-Fi Hotspot', price: 10, desc: 'Stay connected on the go' }
													].map(extra => (
														<div key={extra.key} style={{
															padding: 'var(--space-4)',
															border: `2px solid ${form[extra.key] ? 'var(--primary-blue)' : 'var(--neutral-200)'}`,
															borderRadius: 'var(--radius-lg)',
															background: form[extra.key] ? 'var(--primary-blue-light)' : 'white',
															cursor: 'pointer',
															transition: 'all 0.2s ease'
														}} onClick={() => setForm(f => ({ ...f, [extra.key]: !f[extra.key] }))}>
															<div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
																<input 
																	type="checkbox" 
																	id={extra.key}
																	name={extra.key}
																	checked={form[extra.key]}
																	onChange={handleChange}
																	style={{ marginTop: '2px' }}
																/>
																<div style={{ flex: 1 }}>
																	<div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--neutral-800)' }}>
																		{extra.label}
																	</div>
																	<div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginBottom: 'var(--space-1)' }}>
																		{extra.desc}
																	</div>
																	<div style={{ fontSize: '0.875rem', fontWeight: 'var(--font-weight-semibold)', color: 'var(--primary-blue)' }}>
																		+${extra.price}/day
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>

											{/* Special Requests */}
											<div style={{ marginBottom: 'var(--space-8)' }}>
												<div className="enhanced-form-group">
													<label htmlFor="specialRequests" className="enhanced-form-label">Special Requests</label>
													<textarea 
														id="specialRequests" 
														name="specialRequests" 
														className="enhanced-form-input" 
														value={form.specialRequests} 
														onChange={handleChange}
														placeholder="Any special requirements or requests for your rental..."
														rows={4}
														style={{ resize: 'vertical', minHeight: '100px' }}
													/>
												</div>
											</div>

											{/* Terms and Submit */}
											<div style={{ paddingTop: 'var(--space-6)', borderTop: '1px solid var(--neutral-200)' }}>
												<div style={{ marginBottom: 'var(--space-6)' }}>
													<label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
														<input 
															type="checkbox" 
															name="terms" 
															checked={form.terms} 
															onChange={handleChange}
															required
															style={{ marginTop: '2px' }}
														/>
														<span style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
															I agree to the <a href="/terms" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>Terms and Conditions</a> and <a href="/privacy" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>Privacy Policy</a> *
														</span>
													</label>
												</div>

												<button 
													type="submit" 
													className="enhanced-btn enhanced-btn-primary enhanced-btn-lg" 
													style={{ width: '100%' }}
												>
													Complete Booking
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
														<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
													</svg>
												</button>
											</div>
										</form>
									</div>
								</div>

								{/* Booking Summary */}
								<div className="enhanced-summary-card">
									<h3 className="enhanced-summary-header">Booking Summary</h3>
									
									{/* Car Details */}
									{car && (
										<div style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--neutral-200)' }}>
											<div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-800)', marginBottom: 'var(--space-2)' }}>
												{car.brand} {car.model}
											</div>
											<div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
												{car.year} • {car.transmission} • {car.seats} seats
											</div>
										</div>
									)}

									{/* Rental Period */}
									{form.pickupDate && form.returnDate && (
										<div style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--neutral-200)' }}>
											<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
												<span style={{ color: 'var(--neutral-600)' }}>Pickup:</span>
												<span style={{ fontWeight: 'var(--font-weight-medium)' }}>
													{new Date(form.pickupDate).toLocaleDateString()}
												</span>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
												<span style={{ color: 'var(--neutral-600)' }}>Return:</span>
												<span style={{ fontWeight: 'var(--font-weight-medium)' }}>
													{new Date(form.returnDate).toLocaleDateString()}
												</span>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<span style={{ color: 'var(--neutral-600)' }}>Duration:</span>
												<span style={{ fontWeight: 'var(--font-weight-medium)' }}>
													{rentalDays} {rentalDays === 1 ? 'day' : 'days'}
												</span>
											</div>
										</div>
									)}

									{/* Cost Breakdown */}
									<div style={{ marginBottom: 'var(--space-4)' }}>
										{rentalDays > 0 && (
											<>
												<div className="enhanced-summary-row">
													<span>Vehicle rental ({rentalDays} days × ${baseDailyRate})</span>
													<span>${carCost}</span>
												</div>
												{Object.entries(dailyExtraCosts).map(([key, price]) => 
													form[key] && (
														<div key={key} className="enhanced-summary-row">
															<span>{key.replace('-', ' ')} ({rentalDays} days × ${price})</span>
															<span>${rentalDays * price}</span>
														</div>
													)
												)}
												<div className="enhanced-summary-row">
													<span>Taxes & Fees</span>
													<span>${TAXES_FLAT}</span>
												</div>
											</>
										)}
									</div>

									{/* Total */}
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
											Your booking information is secure and encrypted. We'll send you a confirmation email after completion.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>
				</>
			)}
				</main>
	);
};

export default Checkout;

