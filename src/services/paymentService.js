import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe - Replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key');

/**
 * Create a payment intent on the backend
 * This should call your backend API which creates a Stripe PaymentIntent
 */
export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    // In production, this should call your backend API
    // For now, we'll simulate the API call
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await response.json();
    return { clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    // For demo purposes, return a mock client secret
    // In production, this should never happen
    throw error;
  }
};

/**
 * Process payment using Stripe Elements
 */
export const processPayment = async (stripe, elements, paymentMethodId, billingDetails) => {
  try {
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      paymentMethodId,
      {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: billingDetails,
        },
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get Stripe instance
 */
export const getStripe = () => {
  return stripePromise;
};

/**
 * Format card number for display
 */
export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  }
  return v;
};

/**
 * Format expiry date for display
 */
export const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  return v;
};

/**
 * Validate card number
 */
export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s+/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

/**
 * Validate CVV
 */
export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Validate expiry date
 */
export const validateExpiryDate = (expiryDate) => {
  const [month, year] = expiryDate.split('/');
  if (!month || !year) return false;
  
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12) return false;
  
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (yearNum < currentYear) return false;
  if (yearNum === currentYear && monthNum < currentMonth) return false;
  
  return true;
};

/**
 * PhonePe Payment Gateway Functions
 */

/**
 * Create PhonePe payment transaction
 * This should call your backend API which creates a PhonePe payment transaction
 */
export const createPhonePePayment = async (amount, orderId, customerInfo, redirectUrl) => {
  try {
    // In production, this should call your backend API
    // PhonePe requires backend integration for security (merchant ID, salt key, etc.)
    const response = await fetch('/api/phonepe/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise (PhonePe uses paise)
        merchantTransactionId: orderId,
        merchantUserId: customerInfo.phone || customerInfo.email,
        redirectUrl: redirectUrl || `${window.location.origin}/payment/status`,
        redirectMode: 'REDIRECT',
        callbackUrl: `${window.location.origin}/api/phonepe/callback`,
        mobileNumber: customerInfo.phone,
        customerInfo: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PhonePe payment');
    }

    const data = await response.json();
    return {
      success: true,
      paymentUrl: data.instrumentResponse.redirectInfo.url,
      transactionId: data.merchantTransactionId,
    };
  } catch (error) {
    console.error('Error creating PhonePe payment:', error);
    // For demo purposes, return a mock payment URL
    // In production, this should never happen
    throw error;
  }
};

/**
 * Check PhonePe payment status
 */
export const checkPhonePePaymentStatus = async (transactionId) => {
  try {
    const response = await fetch(`/api/phonepe/status/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const data = await response.json();
    return {
      success: data.code === 'PAYMENT_SUCCESS',
      status: data.code,
      transactionId: data.data.merchantTransactionId,
      amount: data.data.amount,
    };
  } catch (error) {
    console.error('Error checking PhonePe payment status:', error);
    throw error;
  }
};

/**
 * Validate UPI ID format
 */
export const validateUPI = (upiId) => {
  // UPI ID format: username@paytm or username@ybl or username@phonepe, etc.
  const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiPattern.test(upiId);
};

/**
 * Format phone number for PhonePe (Indian format)
 */
export const formatPhoneForPhonePe = (phone) => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Remove country code if present (91 for India)
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }
  
  // Ensure it's 10 digits
  if (cleaned.length === 10) {
    return cleaned;
  }
  
  return null;
};

/**
 * Get payment methods available
 */
export const getPaymentMethods = () => {
  return [
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: '📱',
      description: 'Pay using PhonePe UPI, Wallet, or Cards',
      supportedMethods: ['UPI', 'Wallet', 'Cards', 'Net Banking'],
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay using your credit or debit card',
      supportedMethods: ['Card'],
    },
  ];
};

