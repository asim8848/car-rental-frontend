import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carService } from '../services/apiService';
import { toast } from 'react-toastify';
import './CarDetails.css';

// Utility: choose similar cars (same type or random fallback)
function getSimilarCars(allCars, currentId, category) {
	const filtered = allCars.filter(c => c._id !== currentId && c.category === category);
	// ensure at least 4 (fallback random selection if not enough of same type)
	if (filtered.length >= 4) return filtered.slice(0, 4);
	// fill with random others
	const others = allCars.filter(c => c._id !== currentId && !filtered.includes(c));
	const needed = 4 - filtered.length;
	const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, needed);
	return [...filtered, ...shuffled];
}

const CarDetails = () => {
	// Route path in App.jsx uses :carId
	const { carId } = useParams();
	const navigate = useNavigate();
	
	const [car, setCar] = useState(null);
	const [allCars, setAllCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const similar = useMemo(() => 
		car && allCars.length ? getSimilarCars(allCars, car._id, car.category) : [], 
		[car, allCars]
	);

	// Fetch car details and all cars for similar recommendations
	useEffect(() => {
		const fetchCarData = async () => {
			try {
				setLoading(true);
				setError(null);
				
				// Fetch specific car and all cars in parallel
				const [carResponse, allCarsResponse] = await Promise.all([
					carService.getCarById(carId),
					carService.getCars()
				]);
				
				setCar(carResponse);
				setAllCars(allCarsResponse.cars || []);
			} catch (error) {
				console.error('Error fetching car data:', error);
				setError('Failed to load car details');
				toast.error('Failed to load car details');
			} finally {
				setLoading(false);
			}
		};

		if (carId) {
			fetchCarData();
		}
	}, [carId]);

	const handleRentNow = () => {
		// navigate to checkout, potentially passing state
		navigate('/checkout', { state: { carId: car?._id } });
	};

	const handleAddToCart = () => {
		// simple localStorage cart placeholder
		if (!car) return;
		const cart = JSON.parse(localStorage.getItem('rentacar_cart') || '[]');
		if (!cart.find(item => item.id === car._id)) cart.push({ id: car._id, qty: 1 });
		localStorage.setItem('rentacar_cart', JSON.stringify(cart));
		alert('Added to cart');
	};

	const handleShare = async () => {
		if (!car) return;
		const shareData = { title: car.name, text: 'Check out this car on RentaCar!', url: window.location.href };
		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(window.location.href);
				alert('Link copied to clipboard');
			}
		} catch (e) {
			console.error('Share failed', e);
		}
	};

	if (loading) {
		return (
			<div className="container empty-state" style={{ marginTop: '120px' }}>
				<p>Loading car details...</p>
			</div>
		);
	}

	if (error || !car) {
		return (
			<div className="container empty-state" style={{ marginTop: '120px' }}>
				<p>{error || 'Car not found.'}</p>
				<Link to="/cars" style={{ color: '#0056b3', textDecoration: 'underline' }}>Back to Cars</Link>
			</div>
		);
	}

	return (
		<main>
			<div className="container">
				<nav className="car-breadcrumb">
					<span>
						<Link to="/">Home</Link> &gt; <Link to="/cars">Cars</Link> &gt; <span>Car Details</span>
					</span>
				</nav>

				<div className="car-details-container">
					<div className="car-details-image">
						<img 
							src={`/images/${car.image}`} 
							alt={`${car.brand} ${car.model}`}
							onError={(e) => { e.currentTarget.src = '/images/placeholder.png' }}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					</div>
					<div className="car-details-info">
						<h1 className="car-details-title">{car.brand} {car.model}</h1>
						<div className="car-details-price">${car.price}/day</div>
						<p className="car-description">{car.description}</p>

						<h3 style={{ marginBottom: '1rem', color: '#333' }}>Specifications</h3>
						<ul className="car-specs">
							<li><strong>Year:</strong> {car.year}</li>
							<li><strong>Category:</strong> {car.category}</li>
							<li><strong>Transmission:</strong> {car.transmission}</li>
							<li><strong>Fuel Type:</strong> {car.fuelType}</li>
							<li><strong>Seats:</strong> {car.seats}</li>
							<li><strong>Rating:</strong> {car.rating}/5 ({car.reviews} reviews)</li>
						</ul>

						<h3 style={{ marginBottom: '1rem', color: '#333' }}>Features</h3>
						<div className="badge-list">
							{car.features?.map(feature => (
								<span key={feature} className="badge">{feature}</span>
							))}
						</div>

										<h3 style={{ marginBottom: '1rem', color: '#333' }}>Rental Terms</h3>
										<div className="rental-terms">
											<div className="rental-terms-grid">
												<div><strong>Minimum Age:</strong> 21 years</div>
												<div><strong>License:</strong> Valid driver's license required</div>
												<div><strong>Deposit:</strong> $200 refundable deposit</div>
												<div><strong>Mileage:</strong> 200 miles/day included</div>
											</div>
											<p>Additional charges may apply for extra mileage, late returns, or damages. Full terms and conditions available at pickup.</p>
										</div>

										<div className="actions-main">
											<button className="btn-primary" onClick={handleRentNow}>Rent Now - Reserve This Car</button>
											<button className="btn-secondary-line" onClick={handleAddToCart}>Add to Cart</button>
										</div>
										<div className="actions-secondary">
											<Link to="/cars" className="btn-secondary-line back-link-btn">← Back to Cars</Link>
											<button className="btn-secondary-line share-btn" onClick={handleShare}>Share this Car</button>
										</div>
									</div>
								</div>

				<section className="similar-section">
					<h2>Similar Cars You Might Like</h2>
					<div className="similar-grid">
						{similar.map(sc => (
							<div className="similar-card" key={sc._id}>
								<img 
									src={`/images/${sc.image}`} 
									alt={`${sc.brand} ${sc.model}`}
									onError={(e) => { e.currentTarget.src = '/images/placeholder.png' }}
								/>
								<div className="similar-card-content">
									<p className="similar-card-meta">{sc.category}</p>
									<h3 className="similar-card-title">{sc.brand} {sc.model}</h3>
									<div className="similar-card-price">${sc.price}/day</div>
									<Link to={`/car-details/${sc._id}`} className="similar-card-btn" style={{ textDecoration: 'none' }}>View</Link>
								</div>
							</div>
						))}
						{!similar.length && <div style={{ gridColumn: '1/-1', textAlign: 'center' }}>No similar cars found.</div>}
					</div>
				</section>
			</div>
		</main>
	);
};

export default CarDetails;

