import { mockProducts, mockReviews, mockOrders } from './mockData';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all products or filter by category
 */
export const fetchProducts = async (filters = {}) => {
  await delay();
  
  let products = [...mockProducts];
  
  // Filter by category
  if (filters.category && filters.category !== 'All') {
    products = products.filter(p => p.category === filters.category);
  }
  
  // Filter by price range
  if (filters.minPrice !== undefined) {
    products = products.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filters.maxPrice);
  }
  
  // Filter by search query
  if (filters.search) {
    const query = filters.search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }
  
  // Sort products
  if (filters.sortBy === 'price-low-high') {
    products.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-high-low') {
    products.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'newest') {
    products.sort((a, b) => b.id - a.id);
  }
  
  return {
    success: true,
    data: products,
    total: products.length
  };
};

/**
 * Fetch a single product by ID
 */
export const fetchProductDetails = async (id) => {
  await delay();
  
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  if (!product) {
    return {
      success: false,
      error: 'Product not found'
    };
  }
  
  // Get related products (same category, different product)
  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  return {
    success: true,
    data: {
      ...product,
      relatedProducts
    }
  };
};

/**
 * Fetch reviews for a product
 */
export const fetchProductReviews = async (productId) => {
  await delay();
  
  const reviews = mockReviews.filter(r => r.productId === parseInt(productId));
  
  return {
    success: true,
    data: reviews
  };
};

/**
 * Add item to cart (simulated API call)
 */
export const addItemToCart = async (product, quantity, variant = {}) => {
  await delay(200);
  
  return {
    success: true,
    message: 'Item added to cart',
    data: {
      product,
      quantity,
      variant
    }
  };
};

/**
 * Process checkout (simulated API call)
 */
export const processCheckout = async (checkoutData) => {
  await delay(1000);
  
  // Simulate successful order creation
  const orderId = `ORD-${Date.now()}`;
  
  return {
    success: true,
    message: 'Order placed successfully',
    data: {
      orderId,
      trackingNumber: `TRK${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  };
};

/**
 * Fetch user orders
 */
export const fetchUserOrders = async (userId = 1) => {
  await delay();
  
  return {
    success: true,
    data: mockOrders
  };
};

/**
 * Track order by tracking number
 */
export const trackOrder = async (trackingNumber) => {
  await delay(500);
  
  const order = mockOrders.find(o => o.trackingNumber === trackingNumber);
  
  if (!order) {
    return {
      success: false,
      error: 'Tracking number not found'
    };
  }
  
  // Generate tracking progress
  const statusMap = {
    'Processing': 25,
    'Shipped': 60,
    'Out for Delivery': 85,
    'Delivered': 100
  };
  
  return {
    success: true,
    data: {
      orderId: order.id,
      status: order.status,
      progress: statusMap[order.status] || 0,
      timeline: [
        { date: '2025-10-18', status: 'Order Placed', completed: true },
        { date: '2025-10-19', status: 'Processing', completed: order.status !== 'Processing' },
        { date: '2025-10-20', status: 'Shipped', completed: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) },
        { date: '2025-10-22', status: 'Out for Delivery', completed: ['Out for Delivery', 'Delivered'].includes(order.status) },
        { date: '2025-10-23', status: 'Delivered', completed: order.status === 'Delivered' }
      ]
    }
  };
};

/**
 * Get featured/trending products
 */
export const fetchFeaturedProducts = async () => {
  await delay();
  
  return {
    success: true,
    data: {
      trending: mockProducts.filter(p => p.trending),
      bestSellers: mockProducts.filter(p => p.bestSeller)
    }
  };
};

