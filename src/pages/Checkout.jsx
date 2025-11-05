import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Truck, Package, Lock, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { processCheckout } from '../api/mockApi';
import { 
  calculateShippingCost, 
  getShippingMethods, 
  calculateDeliveryDate, 
  formatDeliveryDate,
  calculateTax,
  validateShippingAddress 
} from '../services/shippingService';
import { 
  formatCardNumber, 
  formatExpiryDate, 
  validateCardNumber, 
  validateCVV, 
  validateExpiryDate,
  getPaymentMethods,
  createPhonePePayment,
  formatPhoneForPhonePe
} from '../services/paymentService';

const steps = [
  { id: 1, name: 'Contact & Shipping', icon: Package },
  { id: 2, name: 'Shipping Method', icon: Truck },
  { id: 3, name: 'Payment', icon: CreditCard }
];

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Form data
  const [contactInfo, setContactInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    country: 'US'
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('phonepe'); // Default to PhonePe
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  const subtotal = getCartTotal();
  const shippingDetails = calculateShippingCost(subtotal, shippingMethod);
  const shippingCost = shippingDetails.cost;
  const tax = calculateTax(subtotal, contactInfo.state);
  const total = subtotal + shippingCost + tax;

  // Update delivery date when shipping method changes
  useEffect(() => {
    if (contactInfo.zipCode && shippingMethod) {
      const deliveryDate = calculateDeliveryDate(shippingMethod);
      setEstimatedDelivery(deliveryDate);
    }
  }, [shippingMethod, contactInfo.zipCode]);

  if (cartItems.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (section, field, value) => {
    setErrors({});
    
    if (section === 'contact') {
      setContactInfo({ ...contactInfo, [field]: value });
    } else if (section === 'payment') {
      let formattedValue = value;
      
      // Format card number
      if (field === 'cardNumber') {
        formattedValue = formatCardNumber(value);
      }
      
      // Format expiry date
      if (field === 'expiryDate') {
        formattedValue = formatExpiryDate(value);
      }
      
      // Limit CVV to 4 digits
      if (field === 'cvv') {
        formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
      }
      
      setPaymentInfo({ ...paymentInfo, [field]: formattedValue });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      const addressValidation = validateShippingAddress(contactInfo);
      if (!addressValidation.isValid) {
        Object.assign(newErrors, addressValidation.errors);
      }
      
      if (!contactInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!contactInfo.firstName || contactInfo.firstName.trim().length < 2) {
        newErrors.firstName = 'Please enter your first name';
      }
      
      if (!contactInfo.lastName || contactInfo.lastName.trim().length < 2) {
        newErrors.lastName = 'Please enter your last name';
      }
      
      if (!contactInfo.phone || contactInfo.phone.trim().length < 10) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (step === 2) {
      if (!shippingMethod) {
        newErrors.shippingMethod = 'Please select a shipping method';
      }
    }
    
    if (step === 3) {
      if (paymentMethod === 'phonepe') {
        // For PhonePe, validate phone number
        const formattedPhone = formatPhoneForPhonePe(contactInfo.phone);
        if (!formattedPhone) {
          newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
        }
      } else if (paymentMethod === 'card') {
        // Validate card details
        if (!validateCardNumber(paymentInfo.cardNumber)) {
          newErrors.cardNumber = 'Please enter a valid card number';
        }
        
        if (!paymentInfo.cardName || paymentInfo.cardName.trim().length < 3) {
          newErrors.cardName = 'Please enter the cardholder name';
        }
        
        if (!validateExpiryDate(paymentInfo.expiryDate)) {
          newErrors.expiryDate = 'Please enter a valid expiry date';
        }
        
        if (!validateCVV(paymentInfo.cvv)) {
          newErrors.cvv = 'Please enter a valid CVV';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(3)) {
      return;
    }

    setProcessing(true);

    try {
      // Generate order ID
      const tempOrderId = `ORD-${Date.now()}`;

      if (paymentMethod === 'phonepe') {
        // Handle PhonePe payment
        try {
          const phonePeResponse = await createPhonePePayment(
            total,
            tempOrderId,
            contactInfo,
            `${window.location.origin}/payment/status`
          );

          if (phonePeResponse.success && phonePeResponse.paymentUrl) {
            // Store order data temporarily
            const orderData = {
              contactInfo,
              shippingMethod,
              shippingDetails,
              paymentMethod: 'phonepe',
              paymentInfo: {
                method: 'phonepe',
                transactionId: phonePeResponse.transactionId,
              },
              items: cartItems,
              totals: { 
                subtotal, 
                shipping: shippingCost, 
                tax, 
                total,
                estimatedDelivery: estimatedDelivery ? formatDeliveryDate(estimatedDelivery) : null
              },
              orderId: tempOrderId
            };

            // Store order data in sessionStorage for after payment
            sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));

            // Redirect to PhonePe payment page
            window.location.href = phonePeResponse.paymentUrl;
            return;
          }
        } catch (phonePeError) {
          console.error('PhonePe payment error:', phonePeError);
          // Fallback to regular checkout if PhonePe fails
          alert('PhonePe payment initialization failed. Please try card payment instead.');
          setPaymentMethod('card');
          setProcessing(false);
          return;
        }
      }

      // Handle card payment (existing flow)
      const orderData = {
        contactInfo,
        shippingMethod,
        shippingDetails,
        paymentMethod: 'card',
        paymentInfo: {
          // Don't send full card details - only last 4 digits for display
          cardLast4: paymentInfo.cardNumber.replace(/\s/g, '').slice(-4),
          cardName: paymentInfo.cardName,
        },
        items: cartItems,
        totals: { 
          subtotal, 
          shipping: shippingCost, 
          tax, 
          total,
          estimatedDelivery: estimatedDelivery ? formatDeliveryDate(estimatedDelivery) : null
        }
      };

      const response = await processCheckout(orderData);

      if (response.success) {
        setOrderId(response.data.orderId);
        setOrderSuccess(true);
        clearCart();
      } else {
        alert('Order processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred while processing your order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const shippingMethods = getShippingMethods(subtotal);

  if (orderSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-2">Thank you for your purchase!</p>
            <p className="text-gray-600 mb-8">
              Your order <strong>#{orderId}</strong> has been placed successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-4">
                We've sent a confirmation email to <strong>{contactInfo.email}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Estimated delivery: <strong>{estimatedDelivery ? formatDeliveryDate(estimatedDelivery) : `${shippingDetails.deliveryDays} business days`}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Shipping method: <strong>{shippingDetails.name}</strong>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/account')}
                className="btn-primary"
              >
                View Order Status
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="btn-secondary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isCurrent
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm font-medium text-center ${isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 rounded ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Step 1: Contact & Shipping */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Shipping Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                        className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">First Name *</label>
                        <input
                          type="text"
                          value={contactInfo.firstName}
                          onChange={(e) => handleInputChange('contact', 'firstName', e.target.value)}
                          className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={contactInfo.lastName}
                          onChange={(e) => handleInputChange('contact', 'lastName', e.target.value)}
                          className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Address *</label>
                      <input
                        type="text"
                        value={contactInfo.address}
                        onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                        className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">City *</label>
                        <input
                          type="text"
                          value={contactInfo.city}
                          onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
                          className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                          placeholder="New York"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">State *</label>
                        <input
                          type="text"
                          value={contactInfo.state}
                          onChange={(e) => handleInputChange('contact', 'state', e.target.value)}
                          className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                          placeholder="NY"
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          value={contactInfo.zipCode}
                          onChange={(e) => handleInputChange('contact', 'zipCode', e.target.value)}
                          className={`input-field ${errors.zipCode ? 'border-red-500' : ''}`}
                          placeholder="10001"
                        />
                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                        className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <button onClick={handleNext} className="btn-primary mt-8 w-full">
                    Continue to Shipping Method
                  </button>
                </div>
              )}

              {/* Step 2: Shipping Method */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Shipping Method</h2>

                  <div className="space-y-4">
                    {shippingMethods.map((method) => (
                      <label 
                        key={method.method}
                        className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          shippingMethod === method.method ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="shipping"
                              value={method.method}
                              checked={shippingMethod === method.method}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="w-5 h-5 text-primary-600 mr-4"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{method.name}</p>
                              <p className="text-sm text-gray-600">{method.deliveryDays} business days</p>
                              {method.isFree && (
                                <p className="text-xs text-green-600 mt-1">✓ Free shipping on orders over ${method.freeThreshold}</p>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-gray-900">
                            {method.isFree ? 'FREE' : `$${method.cost.toFixed(2)}`}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {estimatedDelivery && (
                    <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                      <p className="text-sm text-primary-700">
                        <strong>Estimated delivery:</strong> {formatDeliveryDate(estimatedDelivery)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setCurrentStep(1)} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button onClick={handleNext} className="btn-primary flex-1">
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {getPaymentMethods().map((method) => (
                        <label
                          key={method.id}
                          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={paymentMethod === method.id}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-5 h-5 text-primary-600 mr-3"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{method.icon}</span>
                                <p className="font-semibold text-gray-900">{method.name}</p>
                              </div>
                              <p className="text-xs text-gray-600">{method.description}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* PhonePe Payment Section */}
                  {paymentMethod === 'phonepe' && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center">
                        <Lock className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          Secure payment powered by PhonePe. You'll be redirected to PhonePe to complete your payment.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="text-6xl">📱</div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                          Pay with PhonePe
                        </h3>
                        <p className="text-sm text-gray-600 text-center mb-4">
                          You can pay using UPI, PhonePe Wallet, Cards, or Net Banking
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Phone Number:</strong> {contactInfo.phone || 'Not provided'}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>Amount to Pay:</strong> ₹{total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          🔒 Your payment will be processed securely through PhonePe. We never store your payment details.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Card Payment Section */}
                  {paymentMethod === 'card' && (
                    <>
                      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 flex items-center">
                        <Lock className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                        <p className="text-sm text-primary-700">
                          Your payment information is encrypted and secure. Powered by Stripe.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Card Number *</label>
                          <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                            className={`input-field ${errors.cardNumber ? 'border-red-500' : ''}`}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Cardholder Name *</label>
                          <input
                            type="text"
                            value={paymentInfo.cardName}
                            onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                            className={`input-field ${errors.cardName ? 'border-red-500' : ''}`}
                            placeholder="John Doe"
                          />
                          {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Expiry Date *</label>
                            <input
                              type="text"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                              className={`input-field ${errors.expiryDate ? 'border-red-500' : ''}`}
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">CVV *</label>
                            <input
                              type="text"
                              value={paymentInfo.cvv}
                              onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                              className={`input-field ${errors.cvv ? 'border-red-500' : ''}`}
                              placeholder="123"
                              maxLength="4"
                            />
                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          🔒 Secure payment processing by Stripe. Your card details are never stored on our servers.
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setCurrentStep(2)} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button 
                      onClick={handleSubmitOrder} 
                      disabled={processing}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {processing ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          {paymentMethod === 'phonepe' ? 'Redirecting to PhonePe...' : 'Processing...'}
                        </>
                      ) : (
                        paymentMethod === 'phonepe' ? 'Pay with PhonePe' : 'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax ({contactInfo.state ? 'State' : '8%'})</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < shippingDetails.freeThreshold && shippingDetails.freeThreshold && (
                <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                  <p className="text-sm text-primary-700">
                    Add <strong>${(shippingDetails.freeThreshold - subtotal).toFixed(2)}</strong> more to get <strong>FREE shipping</strong>!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
