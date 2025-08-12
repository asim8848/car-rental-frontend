import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { carService } from '../services/apiService';
import { toast } from 'react-toastify';
import './Checkout.css';

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
	const insuranceCost = form.insurance ? rentalDays * dailyExtraCosts.insurance : 0; // also part of extras but display separately like D1

	const subtotal = carCost + extrasCost + TAXES_FLAT;
	const total = subtotal; // can expand later

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.terms) {
			alert('Please agree to Terms & Privacy Policy');
			return;
		}
		// Simple summary
		alert(`Booking submitted for ${form.name || 'Guest'}\nCar: ${car?.name || 'N/A'}\nDays: ${rentalDays}\nTotal: $${total}`);
	};

	const clearSelection = () => {
		setForm((f) => ({
			...f,
			pickupDate: '',
			returnDate: '',
			insurance: false,
			gps: false,
			'child-seat': false,
			wifi: false,
			specialRequests: '',
		}));
		// Navigate back to cars page to select a different car
		navigate('/cars');
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
				<div className="container" style={{ marginTop: '120px', textAlign: 'center', padding: '2rem' }}>
					<h2>Loading checkout details...</h2>
					<p>Please wait while we prepare your booking information.</p>
				</div>
			) : (
				<>
					{/* Hero */}
					<section
						className="checkout-hero"
						style={{
							backgroundImage:
								"linear-gradient(135deg, rgba(0,86,179,0.9), rgba(0,68,148,0.9)), url('/images/hero-section/Hero-background-image-3.jpg')",
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						<div className="container checkout-hero-content">
							<h1>Complete Your Booking</h1>
							<p>You're just a few steps away from experiencing your perfect ride</p>
				</div>
			</section>

			<section className="checkout-section">
				<div className="container">
					<nav className="breadcrumb">
						<a href="/">Home</a> &gt; <a href="/cars">Cars</a> &gt; <span>Checkout</span>
					</nav>

						<div className="checkout-container">
							{/* Form Side */}
							<div className="form-container">
								<div className="form-header">
									<h2>Complete Your Booking</h2>
								</div>
								<form onSubmit={handleSubmit}>
									<h3 className="section-title">Personal Information</h3>
									<div className="form-row">
										<div className="form-group">
											<label htmlFor="name">Full Name *</label>
											<input id="name" name="name" type="text" className="form-control" required value={form.name} onChange={handleChange} />
										</div>
										<div className="form-group">
											<label htmlFor="email">Email Address *</label>
											<input id="email" name="email" type="email" className="form-control" required value={form.email} onChange={handleChange} />
										</div>
									</div>
									<div className="form-row">
										<div className="form-group">
											<label htmlFor="phone">Phone Number *</label>
											<input id="phone" name="phone" type="tel" className="form-control" required value={form.phone} onChange={handleChange} />
										</div>
										<div className="form-group">
											<label htmlFor="license">Driver's License Number *</label>
											<input id="license" name="license" type="text" className="form-control" required value={form.license} onChange={handleChange} />
										</div>
									</div>

									<h3 className="section-title">Rental Details</h3>
									<div className="form-group">
										<label htmlFor="selected-car">Selected Car</label>
										<input id="selected-car" name="selected-car" className="form-control" readOnly value={car ? car.name : ''} />
									</div>
									<div className="form-row">
										<div className="form-group">
											<label htmlFor="pickupDate">Pickup Date *</label>
											<input id="pickupDate" name="pickupDate" type="date" className="form-control" required value={form.pickupDate} onChange={handleChange} />
										</div>
										<div className="form-group">
											<label htmlFor="returnDate">Return Date *</label>
											<input id="returnDate" name="returnDate" type="date" className="form-control" required value={form.returnDate} onChange={handleChange} />
										</div>
									</div>
									<div className="form-row">
										<div className="form-group">
											<label htmlFor="pickupLocation">Pickup Location</label>
											<select id="pickupLocation" name="pickupLocation" className="form-control" value={form.pickupLocation} onChange={handleChange}>
												<option value="main-office">Main Office - 123 Main Street</option>
												<option value="airport">Airport Location - Terminal 1</option>
												<option value="downtown">Downtown Branch - City Center</option>
												<option value="mall">Shopping Mall - West Side</option>
											</select>
										</div>
										<div className="form-group">
											<label htmlFor="returnLocation">Return Location</label>
											<select id="returnLocation" name="returnLocation" className="form-control" value={form.returnLocation} onChange={handleChange}>
												<option value="same">Same as pickup location</option>
												<option value="main-office">Main Office - 123 Main Street</option>
												<option value="airport">Airport Location - Terminal 1</option>
												<option value="downtown">Downtown Branch - City Center</option>
												<option value="mall">Shopping Mall - West Side</option>
											</select>
										</div>
									</div>

									<h3 className="section-title">Additional Options</h3>
									<div className="options-grid">
										{Object.keys(dailyExtraCosts).map((key) => (
											<label key={key} className="filter-option" htmlFor={key}>
												<input type="checkbox" id={key} name={key} checked={!!form[key]} onChange={handleChange} />
												{key === 'insurance' && 'Additional Insurance (+$15/day)'}
												{key === 'gps' && 'GPS Navigation (+$8/day)'}
												{key === 'child-seat' && 'Child Safety Seat (+$12/day)'}
												{key === 'wifi' && 'WiFi Hotspot (+$10/day)'}
											</label>
										))}
									</div>
									<div className="form-group special-requests">
										<label htmlFor="specialRequests">Special Requests</label>
										<textarea id="specialRequests" name="specialRequests" className="form-control" rows={3} placeholder="Any special requirements or requests..." value={form.specialRequests} onChange={handleChange} />
									</div>
									<div className="filter-option terms-checkbox">
										<input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange} required />
										<label htmlFor="terms">
											I agree to the <button type="button" className="forgot-password" style={{background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer'}}>Terms and Conditions</button> and <button type="button" className="forgot-password" style={{background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer'}}>Privacy Policy</button> *
										</label>
									</div>
									<button type="submit" className="btn-complete">Complete Booking <span>→</span></button>
								</form>
							</div>

							{/* Summary Side */}
							<div className="booking-summary">
								<div className="summary-header">
									<h3>Booking Summary</h3>
								</div>
								<div className="car-info">
									<h4>{car ? `${car.brand} ${car.model}` : 'Select a Car'}</h4>
									<p>{car ? `${car.category || ''} • ${car.transmission || 'Automatic'} • ${car.seats || '5'} Seats` : 'Choose a vehicle to begin'}</p>
								</div>
								<button type="button" className="btn-secondary" onClick={clearSelection}>Clear Selection</button>
								<div className="rental-dates">
									<div className="date-row"><span>Pickup:</span><span>{form.pickupDate || 'Select date'}</span></div>
									<div className="date-row"><span>Return:</span><span>{form.returnDate || 'Select date'}</span></div>
									<div className="date-row duration"><span>Duration:</span><span>{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span></div>
									{rentalDays === 0 && (
										<div style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginTop: '0.5rem' }}>
											Select pickup and return dates to see final pricing
										</div>
									)}
								</div>
								<div className="cost-breakdown">
									<div className="cost-row">
										<span>Car Rental ({rentalDays} {rentalDays === 1 ? 'day' : 'days'} × ${baseDailyRate}):</span>
										<span>${carCost}</span>
									</div>
									{form.insurance && (
										<div className="cost-row">
											<span>Insurance ({rentalDays} {rentalDays === 1 ? 'day' : 'days'} × $15):</span>
											<span>${insuranceCost}</span>
										</div>
									)}
									{(form.gps || form['child-seat'] || form.wifi) && (
										<div className="cost-row">
											<span>Extras ({rentalDays} {rentalDays === 1 ? 'day' : 'days'}):</span>
											<span>${extrasCost - insuranceCost}</span>
										</div>
									)}
									<div className="cost-row"><span>Taxes & Fees:</span><span>${TAXES_FLAT}</span></div>
									<hr className="cost-divider" />
									<div className="total-row"><span>Total:</span><span>${total}</span></div>
								</div>
								<div className="security-notice">
									<div className="security-icon" role="img" aria-label="secure">🔒</div>
									<p className="security-text">Your payment information is secure and encrypted</p>
								</div>
								<div className="support-link">
									<p>Need help?</p>
									<a href="/contact">Contact Support</a>
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

