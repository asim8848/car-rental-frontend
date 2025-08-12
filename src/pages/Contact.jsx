import React, { useState } from 'react';
import './Contact.css';

const initialFaq = [
	{
		q: 'What documents do I need to rent a car?',
		a: `You'll need a valid driver's license, a major credit card in your name, and proof of insurance. International visitors may also need an International Driving Permit (IDP) depending on their country of origin.`
	},
	{
		q: 'What is your cancellation policy?',
		a: 'You can cancel your reservation up to 24 hours before pickup without any penalty. Cancellations within 24 hours may incur a fee depending on the booking terms.'
	},
	{
		q: 'Do you offer one-way rentals?',
		a: 'Yes, we offer one-way rentals between select locations. Additional fees may apply. Please contact us or check during booking for availability and pricing.'
	},
	{
		q: 'What happens if I return the car late?',
		a: `Late returns are subject to additional charges. If you're more than 30 minutes late, you'll be charged for an additional day. Please contact us if you need to extend your rental.`
	},
	{
		q: 'Is fuel included in the rental price?',
		a: 'Cars are provided with a full tank of fuel and should be returned with a full tank. We offer prepaid fuel options for your convenience, or you can refuel before return.'
	}
];

const Contact = () => {
	const [faqOpen, setFaqOpen] = useState(null);

	const toggleFaq = (idx) => {
		setFaqOpen(faqOpen === idx ? null : idx);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		console.log('Contact form submit', data);
		alert('Message sent!');
		e.target.reset();
	};

	return (
		<div className="contact-page">
			{/* Hero */}
			<section
				className="contact-hero"
				style={{
					backgroundImage: 'linear-gradient(135deg,#0056b3,#004494)',
				}}
			>
				<div className="container contact-hero-content">
					<h1>Get in Touch</h1>
						<p>We're here to help! Reach out to us for any questions, support, or feedback.</p>
				</div>
			</section>

			{/* Contact Info & Form */}
			<section className="section">
				<div className="container">
					<div className="contact-grid">
						{/* Left: Info */}
						<div>
							<h2>Contact Information</h2>
							<div className="info-cards">
								<div className="info-card">
									<div className="info-card-icon">📍</div>
									<div className="info-card-content">
										<h3>Visit Our Office</h3>
										<p>123 Main Street<br/>City, State 12345<br/>United States</p>
									</div>
								</div>
								<div className="info-card">
									<div className="info-card-icon">📞</div>
									<div className="info-card-content">
										<h3>Call Us</h3>
										<p>
											Main: <a href="tel:+15551234567">(555) 123-4567</a><br/>
											Support: <a href="tel:+15551234568">(555) 123-4568</a><br/>
											Emergency: <a href="tel:+15551234569">(555) 123-4569</a>
										</p>
									</div>
								</div>
								<div className="info-card">
									<div className="info-card-icon">✉️</div>
									<div className="info-card-content">
										<h3>Email Us</h3>
										<p>
											General: <a href="mailto:info@rentacar.com">info@rentacar.com</a><br/>
											Support: <a href="mailto:support@rentacar.com">support@rentacar.com</a><br/>
											Booking: <a href="mailto:booking@rentacar.com">booking@rentacar.com</a>
										</p>
									</div>
								</div>
								<div className="info-card">
									<div className="info-card-icon">🕒</div>
									<div className="info-card-content">
										<h3>Business Hours</h3>
										<p>Monday - Friday: 8:00 AM - 8:00 PM<br/>Saturday: 9:00 AM - 6:00 PM<br/>Sunday: 10:00 AM - 4:00 PM</p>
									</div>
								</div>
							</div>
							<div className="social-links">
								<h3>Connect With Us</h3>
								<div className="social-icons">
									<a href="#" className="social-icon icon-facebook">📘</a>
									<a href="#" className="social-icon icon-twitter">🐦</a>
									<a href="#" className="social-icon icon-instagram">📷</a>
									<a href="#" className="social-icon icon-linkedin">💼</a>
								</div>
								<p className="social-text">Follow us on social media for updates, promotions, and travel tips!</p>
							</div>
						</div>
						{/* Right: Form */}
						<div className="form-container">
							<h2>Send Us a Message</h2>
							<form onSubmit={handleSubmit}>
								<div className="form-row">
									<div className="form-group">
										<label htmlFor="first-name">First Name *</label>
										<input id="first-name" name="firstName" required className="form-control" />
									</div>
									<div className="form-group">
										<label htmlFor="last-name">Last Name *</label>
										<input id="last-name" name="lastName" required className="form-control" />
									</div>
								</div>
								<div className="form-group">
									<label htmlFor="email">Email Address *</label>
									<input type="email" id="email" name="email" required className="form-control" />
								</div>
								<div className="form-group">
									<label htmlFor="phone">Phone Number</label>
									<input type="tel" id="phone" name="phone" className="form-control" />
								</div>
								<div className="form-group">
									<label htmlFor="subject">Subject *</label>
									<select id="subject" name="subject" required className="form-control">
										<option value="">Select a subject</option>
										<option value="general">General Inquiry</option>
										<option value="booking">Booking Support</option>
										<option value="billing">Billing Question</option>
										<option value="feedback">Feedback</option>
										<option value="complaint">Complaint</option>
										<option value="partnership">Business Partnership</option>
										<option value="other">Other</option>
									</select>
								</div>
								<div className="form-group">
									<label htmlFor="priority">Priority Level</label>
									<select id="priority" name="priority" className="form-control" defaultValue="medium">
										<option value="low">Low - General question</option>
										<option value="medium">Medium - Need assistance</option>
										<option value="high">High - Urgent issue</option>
										<option value="emergency">Emergency - Immediate help needed</option>
									</select>
								</div>
								<div className="form-group">
									<label htmlFor="message">Message *</label>
									<textarea id="message" name="message" rows="5" required className="form-control" placeholder="Please describe your inquiry in detail..."></textarea>
									<small className="form-text">Please provide as much detail as possible to help us assist you better.</small>
								</div>
								<div className="form-group">
									<label>Preferred Contact Method</label>
									<div className="contact-options">
										<div className="contact-option">
											<input type="radio" id="contact-email" name="contactMethod" value="email" defaultChecked />
											<label htmlFor="contact-email">Email</label>
										</div>
										<div className="contact-option">
											<input type="radio" id="contact-phone" name="contactMethod" value="phone" />
											<label htmlFor="contact-phone">Phone</label>
										</div>
										<div className="contact-option">
											<input type="radio" id="contact-any" name="contactMethod" value="any" />
											<label htmlFor="contact-any">Either</label>
										</div>
									</div>
								</div>
								<div className="filter-option">
									<input type="checkbox" id="newsletter-signup" name="newsletter" />
									<label htmlFor="newsletter-signup">Subscribe to our newsletter for exclusive deals and updates</label>
								</div>
								<button type="submit" className="btn-submit">Send Message <span>→</span></button>
								<p className="form-footnote">We typically respond within 24 hours. For urgent matters, please call us directly.</p>
							</form>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="faq-section">
				<div className="container">
					<h2>Frequently Asked Questions</h2>
					<p className="faq-intro">Find answers to the most common questions about our car rental services.</p>
					<div className="faq-container">
						{initialFaq.map((item, idx) => {
							const open = faqOpen === idx;
							return (
								<div className="faq-item" key={idx}>
									<div className="faq-question" onClick={() => toggleFaq(idx)}>
										<h3>{item.q}</h3>
										<span style={{ transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
									</div>
									<div className="faq-answer" style={{ maxHeight: open ? '400px' : 0 }}>
										<p>{item.a}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Emergency */}
			<section className="emergency-section">
				<div className="container">
					<div className="emergency-icon">🚨</div>
					<h2>Emergency Assistance</h2>
					<p>Need immediate help? Our 24/7 emergency support team is here for you.</p>
					<div className="emergency-buttons">
						<a href="tel:+15551234569" className="btn-emergency">📞 Emergency Hotline: (555) 123-4569</a>
						<a href="mailto:emergency@rentacar.com" className="btn-emergency-alt">✉️ Emergency Email</a>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Contact;

