import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
	const [activeTab, setActiveTab] = useState('login');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login, register } = useAuth();

	const passwordValidations = [
		{ label: 'Uppercase letters', test: /[A-Z]/ },
		{ label: 'Lowercase letters', test: /[a-z]/ },
		{ label: 'Numbers', test: /[0-9]/ },
		{ label: 'Special characters', test: /[^A-Za-z0-9]/ },
		{ label: 'At least 8 characters', test: /.{8,}/ }
	];

	const passwordStrength = () => {
		const passed = passwordValidations.filter(v => v.test.test(password)).length;
		if (!password) return '';
		if (passed <= 2) return 'Weak';
		if (passed === 3 || passed === 4) return 'Medium';
		return 'Strong';
	};

	const handleAuthSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		
		try {
			if (activeTab === 'login') {
				await login({
					email: data.email,
					password: data.password
				});
				toast.success('Login successful!');
				navigate('/');
			} else {
				// Register
				if (data.password !== data.confirmPassword) {
					toast.error('Passwords do not match');
					return;
				}
				
				await register({
					name: data.name,
					email: data.email,
					password: data.password,
					phone: data.phone
				});
				toast.success('Account created successfully!');
				navigate('/');
			}
		} catch (error) {
			toast.error(error.message || 'Authentication failed');
		} finally {
			setLoading(false);
		}
	};

	const strength = passwordStrength();

	return (
		<div className="login-page">
			{/* Hero */}
			<section className="login-hero" style={{ backgroundImage: 'linear-gradient(135deg,#0056b3,#004494)' }}>
				<div className="container login-hero-content">
					<h1>Welcome to RentaCar</h1>
					<p>Join our community of travelers and gain access to premium vehicles and exclusive deals</p>
				</div>
			</section>

			<section className="login-section">
				<div className="container">
					<div className="login-container">
						{/* Forms */}
						<div className="auth-form-container">
							<div className="auth-tabs">
								<button
									className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
									onClick={() => setActiveTab('login')}
								>
									Login
								</button>
								<button
									className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
									onClick={() => setActiveTab('signup')}
								>
									Sign Up
								</button>
							</div>

							{/* Login Form */}
							<div className={`auth-form ${activeTab === 'login' ? 'active' : ''}`}>
								<div className="form-header">
									<h2>Welcome Back!</h2>
									<p>Please sign in to your account to continue</p>
								</div>
								<form onSubmit={handleAuthSubmit}>
									<div className="form-group">
										<label htmlFor="login-email">Email Address</label>
										<input type="email" id="login-email" name="email" className="form-control" placeholder="Enter your email" required />
									</div>
									<div className="form-group">
										<label htmlFor="login-password">Password</label>
										<input type="password" id="login-password" name="password" className="form-control" placeholder="Enter your password" required />
									</div>
									<div className="form-action">
										<div className="form-checkbox">
											<input type="checkbox" id="remember-me" name="remember" />
											<label htmlFor="remember-me">Remember me</label>
										</div>
										<a href="#" className="forgot-password">Forgot Password?</a>
									</div>
									<button type="submit" className="btn-submit" disabled={loading}>
										{loading ? 'Signing In...' : 'Sign In'} <span>→</span>
									</button>
									<div className="auth-divider"><span>Or continue with</span></div>
									<div className="social-buttons">
										<button type="button" className="social-btn">📱 Google</button>
										<button type="button" className="social-btn">📘 Facebook</button>
									</div>
								</form>
							</div>

							{/* Signup Form */}
							<div className={`auth-form ${activeTab === 'signup' ? 'active' : ''}`}>
								<div className="form-header">
									<h2>Create Account</h2>
									<p>Join RentaCar and start your journey today</p>
								</div>
								<form onSubmit={handleAuthSubmit}>
									<div className="form-group">
										<label htmlFor="signup-name">Full Name</label>
										<input id="signup-name" name="name" className="form-control" placeholder="Enter your full name" required />
									</div>
									<div className="form-group">
										<label htmlFor="signup-email">Email Address</label>
										<input type="email" id="signup-email" name="email" className="form-control" placeholder="Enter your email" required />
									</div>
									<div className="form-row">
										<div className="form-group">
											<label htmlFor="signup-password">Password</label>
											<input
												type="password"
												id="signup-password"
												name="password"
												className="form-control"
												placeholder="Create password"
												required
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
											<div className="password-requirements">
												Use 8+ characters with a mix of:
												<ul className="requirement-list">
													{passwordValidations.map(v => (
														<li key={v.label} style={{ color: v.test.test(password) ? 'green' : 'inherit' }}>{v.label}</li>
													))}
												</ul>
												{password && (
													<div className="password-strength" style={{ color: strength === 'Strong' ? 'green' : strength === 'Medium' ? '#f39c12' : '#dc3545' }}>
														Strength: {strength}
													</div>
												)}
											</div>
										</div>
										<div className="form-group">
											<label htmlFor="confirm-password">Confirm Password</label>
											<input
												type="password"
												id="confirm-password"
												name="confirmPassword"
												className="form-control"
												placeholder="Confirm password"
												required
												value={confirm}
												onChange={(e) => setConfirm(e.target.value)}
											/>
											{confirm && confirm !== password && (
												<small className="form-text" style={{ color: '#dc3545' }}>Passwords do not match</small>
											)}
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="phone">Phone Number (Optional)</label>
										<input type="tel" id="phone" name="phone" className="form-control" placeholder="Enter your phone number" />
									</div>
									<div className="form-group">
										<label htmlFor="birth-date">Date of Birth</label>
										<input type="date" id="birth-date" name="birthDate" className="form-control" required />
										<small className="form-text">You must be at least 21 years old to rent a car</small>
									</div>
									<div className="form-checkbox">
										<input type="checkbox" id="terms-signup" name="terms" required />
										<label htmlFor="terms-signup">I agree to the <a href="#" className="forgot-password">Terms of Service</a> and <a href="#" className="forgot-password">Privacy Policy</a></label>
									</div>
									<div className="form-checkbox">
										<input type="checkbox" id="newsletter" name="newsletter" />
										<label htmlFor="newsletter">Subscribe to newsletter for exclusive deals and updates</label>
									</div>
									<button type="submit" className="btn-submit" disabled={loading || (password && confirm && password !== confirm)}>
										{loading ? 'Creating Account...' : 'Create Account'} <span>→</span>
									</button>
									<div className="auth-divider"><span>Or sign up with</span></div>
									<div className="social-buttons">
										<button type="button" className="social-btn">📱 Google</button>
										<button type="button" className="social-btn">📘 Facebook</button>
									</div>
								</form>
								<div className="security-notice">
									<div className="security-icon">🔒</div>
									<div className="security-content">
										<h4>Your Privacy is Protected</h4>
										<p>We use industry-standard encryption to protect your personal information. Your data is never shared with third parties without your consent.</p>
									</div>
								</div>
							</div>
						</div>

						{/* Benefits */}
						<div className="benefits-section">
							<div className="benefits-header">
								<h3>Why Join RentaCar?</h3>
								<p>Become a member and enjoy these exclusive benefits</p>
							</div>
							<div className="benefits-grid">
								<div className="benefit-item">
									<div className="benefit-icon">⚡</div>
									<div className="benefit-content">
										<h4>Fast Booking</h4>
										<p>Quick and easy reservation process with saved preferences</p>
									</div>
								</div>
								<div className="benefit-item">
									<div className="benefit-icon">💰</div>
									<div className="benefit-content">
										<h4>Member Discounts</h4>
										<p>Exclusive deals and special rates for registered users</p>
									</div>
								</div>
								<div className="benefit-item">
									<div className="benefit-icon">📱</div>
									<div className="benefit-content">
										<h4>Easy Management</h4>
										<p>View, modify, or cancel your bookings anytime</p>
									</div>
								</div>
								<div className="benefit-item">
									<div className="benefit-icon">🎯</div>
									<div className="benefit-content">
										<h4>Personalized Experience</h4>
										<p>Get recommendations based on your preferences and history</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Login;

