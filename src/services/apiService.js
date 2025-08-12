import api from './api';

// Car API functions
export const carService = {
  // Get all cars with filters
  getCars: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      const response = await api.get(`/cars?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single car
  getCarById: async (id) => {
    try {
      const response = await api.get(`/cars/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get featured cars
  getFeaturedCars: async () => {
    try {
      const response = await api.get('/cars/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Auth API functions
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, ...user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, ...user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      const { token, ...user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Cart API functions
export const cartService = {
  // Get cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add to cart
  addToCart: async (cartItem) => {
    try {
      const response = await api.post('/cart', cartItem);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove from cart
  removeFromCart: async (carId) => {
    try {
      const response = await api.delete(`/cart/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Booking API functions
export const bookingService = {
  // Create booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user bookings
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking by id
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`/bookings/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
