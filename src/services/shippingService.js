/**
 * Shipping service for calculating shipping costs
 */

// Shipping rate configurations
const SHIPPING_RATES = {
  standard: {
    name: 'Standard Shipping',
    baseCost: 9.99,
    freeThreshold: 50,
    deliveryDays: '5-7',
    description: 'Standard shipping with tracking',
  },
  express: {
    name: 'Express Shipping',
    baseCost: 15.00,
    freeThreshold: 100,
    deliveryDays: '2-3',
    description: 'Fast express delivery',
  },
  overnight: {
    name: 'Overnight Shipping',
    baseCost: 25.00,
    freeThreshold: null, // Never free
    deliveryDays: '1',
    description: 'Next business day delivery',
  },
};

/**
 * Calculate shipping cost based on subtotal and method
 */
export const calculateShippingCost = (subtotal, method = 'standard') => {
  const rate = SHIPPING_RATES[method];
  
  if (!rate) {
    return { cost: 0, method: 'standard', ...SHIPPING_RATES.standard };
  }

  // Check if order qualifies for free shipping
  if (rate.freeThreshold !== null && subtotal >= rate.freeThreshold) {
    return {
      cost: 0,
      method,
      ...rate,
      isFree: true,
    };
  }

  return {
    cost: rate.baseCost,
    method,
    ...rate,
    isFree: false,
  };
};

/**
 * Get all available shipping methods
 */
export const getShippingMethods = (subtotal) => {
  return Object.keys(SHIPPING_RATES).map(method => {
    return calculateShippingCost(subtotal, method);
  });
};

/**
 * Calculate estimated delivery date
 */
export const calculateDeliveryDate = (shippingMethod, orderDate = new Date()) => {
  const method = SHIPPING_RATES[shippingMethod];
  if (!method) return null;

  const deliveryDays = parseInt(method.deliveryDays.split('-')[0]);
  const deliveryDate = new Date(orderDate);
  
  // Add business days (skip weekends)
  let daysToAdd = deliveryDays;
  while (daysToAdd > 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      daysToAdd--;
    }
  }

  return deliveryDate;
};

/**
 * Format delivery date for display
 */
export const formatDeliveryDate = (date) => {
  if (!date) return 'N/A';
  
  const options = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get shipping method details
 */
export const getShippingMethodDetails = (method) => {
  return SHIPPING_RATES[method] || SHIPPING_RATES.standard;
};

/**
 * Validate shipping address
 */
export const validateShippingAddress = (address) => {
  const errors = {};

  if (!address.address || address.address.trim().length < 5) {
    errors.address = 'Please enter a valid street address';
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.city = 'Please enter a valid city';
  }

  if (!address.state || address.state.trim().length < 2) {
    errors.state = 'Please enter a valid state';
  }

  if (!address.zipCode || !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
    errors.zipCode = 'Please enter a valid ZIP code';
  }

  if (address.country && address.country.trim().length < 2) {
    errors.country = 'Please enter a valid country';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Calculate tax based on state (simplified - in production, use a tax service)
 */
export const calculateTax = (subtotal, state = '') => {
  // Simplified tax calculation - in production, use a proper tax service
  const taxRates = {
    'CA': 0.0725,
    'NY': 0.08,
    'TX': 0.0625,
    'FL': 0.06,
    'IL': 0.0625,
  };

  const rate = taxRates[state.toUpperCase()] || 0.08; // Default 8%
  return subtotal * rate;
};

