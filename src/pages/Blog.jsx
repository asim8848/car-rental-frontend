import React from 'react';
import './Blog.css';

// Static blog data mirroring D1/blog.html
const blogPosts = [
	{
		id: 1,
		image: '/images/Blog/blog-1.jpg',
		date: 'December 15, 2024',
		title: '10 Essential Road Trip Tips for First-Time Renters',
		excerpt: 'Planning your first road trip with a rental car? Our comprehensive guide covers everything from choosing the right vehicle to packing essentials and safety tips that will make your journey memorable and stress-free.',
		tags: ['Travel Tips', 'Road Trip'],
		tagStyle: 'travel'
	},
	{
		id: 2,
		image: '/images/Blog/blog-2.jpg',
		date: 'December 10, 2024',
		title: 'The Future is Electric: Why Choose an Electric Rental Car',
		excerpt: 'Electric vehicles are revolutionizing the car rental industry. Learn about the benefits of choosing electric cars for your next rental, including cost savings, environmental impact, and the amazing driving experience they offer.',
		tags: ['Electric Cars', 'Environment'],
		tagStyle: 'electric'
	},
	{
		id: 3,
		image: '/images/Blog/blog-3.jpg',
		date: 'December 5, 2024',
		title: 'Understanding Rental Car Insurance: What You Need to Know',
		excerpt: 'Car rental insurance can be confusing. Our detailed guide breaks down different coverage options, what\'s typically included, and how to make smart decisions to protect yourself and save money on your rental.',
		tags: ['Insurance', 'Safety'],
		tagStyle: 'safety'
	},
	{
		id: 4,
		image: '/images/Blog/blog-4.jpg',
		date: 'November 28, 2024',
		title: 'Luxury Car Rentals: When to Splurge and Make It Special',
		excerpt: 'Sometimes a special occasion calls for something extraordinary. Discover when it makes sense to upgrade to a luxury rental car, what to expect, and how to get the best value from premium vehicle rentals.',
		tags: ['Luxury', 'Premium'],
		tagStyle: 'luxury'
	},
	{
		id: 5,
		image: '/images/Blog/blog-5.jpg',
		date: 'November 20, 2024',
		title: 'Budget-Friendly Car Rentals: How to Save Money Without Compromise',
		excerpt: 'Traveling on a budget doesn\'t mean sacrificing quality. Learn insider tips and tricks for finding the best car rental deals, timing your bookings right, and maximizing value while keeping costs low.',
		tags: ['Budget Tips', 'Savings'],
		tagStyle: 'budget'
	},
	{
		id: 6,
		image: '/images/Blog/blog-6.jpg',
		date: 'November 15, 2024',
		title: 'Latest Car Technology Features Every Renter Should Know About',
		excerpt: 'Modern rental cars come packed with advanced technology features. From smartphone integration to advanced safety systems, discover the tech features that can enhance your driving experience and keep you safe on the road.',
		tags: ['Technology', 'Innovation'],
		tagStyle: 'tech'
	}
];

const categories = [
	{ icon: '🗺️', title: 'Travel Guides', desc: 'Destination guides and travel planning tips' },
	{ icon: '🚗', title: 'Car Reviews', desc: 'In-depth reviews of our rental fleet' },
	{ icon: '💡', title: 'Tips & Tricks', desc: 'Expert advice for better car rentals' },
	{ icon: '📰', title: 'Industry News', desc: 'Latest updates from the rental industry' }
];

const Blog = () => {
	const handleReadMore = (id) => {
		// Placeholder for modal or navigation
		console.log('Read more post', id);
	};

	const handleSubscribe = (e) => {
		e.preventDefault();
		const email = e.target.elements.email?.value;
		if (email) {
			alert('Subscribed with ' + email);
			e.target.reset();
		}
	};

	return (
		<div className="blog-page">
			{/* Hero Section */}
							<section
								className="blog-hero"
								style={{
									backgroundImage: 'linear-gradient(rgba(0,86,179,0.75), rgba(0,68,148,0.75)), url(/images/Blog/blog-1.jpg)',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat'
								}}
							>
				<div className="container blog-hero-content">
					<h1>RentaCar Blog</h1>
					<p>Discover travel tips, car reviews, and the latest news from the world of car rentals</p>
				</div>
			</section>

			{/* Blog Posts */}
			<section className="section">
				<div className="container">
					<div className="blog-grid">
						{blogPosts.map(post => (
							<article className="blog-card" key={post.id}>
								<div className="blog-image">
									<img src={post.image} alt={post.title} />
								</div>
								<div className="blog-content">
									<div className="blog-date">{post.date}</div>
									<h2 className="blog-title">{post.title}</h2>
									<p className="blog-excerpt">{post.excerpt}</p>
									<div className="blog-footer">
										<div className="blog-tags">
											{post.tags.map((t, i) => (
												<span key={i} className={`blog-tag blog-tag-${post.tagStyle}`}>{t}</span>
											))}
										</div>
										<button className="btn-read-more" onClick={() => handleReadMore(post.id)}>Read More</button>
									</div>
								</div>
							</article>
						))}
					</div>

					<div className="load-more">
						<button className="btn-load-more" onClick={() => alert('Load more posts placeholder')}>Load More Posts</button>
					</div>
				</div>
			</section>

			{/* Newsletter */}
			<section className="newsletter">
				<div className="container">
					<div className="newsletter-container">
						<h2>Stay Updated with Our Latest Posts</h2>
						<p>Subscribe to our newsletter to receive the latest travel tips, car reviews, and exclusive offers.</p>
						<form className="newsletter-form" onSubmit={handleSubscribe}>
							<input type="email" name="email" placeholder="Enter your email" className="newsletter-input" required />
							<button type="submit" className="btn-subscribe">Subscribe</button>
						</form>
						<p className="privacy-note">We respect your privacy. Unsubscribe at any time.</p>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="categories">
				<div className="container">
					<h2>Explore by Category</h2>
					<div className="category-grid">
						{categories.map(c => (
							<div className="category-card" key={c.title}>
								<div className="category-icon">{c.icon}</div>
								<h3 className="category-title">{c.title}</h3>
								<p className="category-desc">{c.desc}</p>
								<a href="#" className="btn-category">Explore</a>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Blog;
