# Elite Store - Premium E-commerce

A modern, fully responsive e-commerce single-page application built with React and Tailwind CSS. This project showcases a high-end online storefront with exceptional UI/UX design, optimized for conversions and mobile responsiveness. Features integrated payment gateway, shipping management, and complete checkout flow.

## 🌟 Features

### Pages & Functionality

- **Home Page** (`/`)
  - Branded hero section with compelling CTA
  - Featured product collections (Trending & Best Sellers)
  - Social proof with customer testimonials
  - Trust badges and feature highlights

- **Product Listing** (`/shop`)
  - Responsive product grid
  - Advanced filtering (Category, Price Range)
  - Multiple sorting options
  - Pagination
  - Mobile-friendly filter overlay

- **Product Detail** (`/product/:id`)
  - Image gallery with navigation
  - Variant selection (Colors, Sizes)
  - Quantity controls
  - Tabbed content (Description, Features, Shipping, Reviews)
  - Related products section
  - Add to cart with visual feedback

- **Shopping Cart** (`/cart`)
  - Item management with quantity controls
  - Dynamic price calculations
  - Free shipping threshold indicator
  - Responsive layout for all devices

- **Checkout Flow** (`/checkout`)
  - Multi-step process with progress indicator
  - Step 1: Contact & Shipping Information
  - Step 2: Shipping Method Selection (Standard, Express, Overnight)
  - Step 3: Payment Method Selection (PhonePe or Card)
  - PhonePe payment integration (UPI, Wallet, Cards, Net Banking)
  - Stripe card payment integration (Alternative)
  - Real-time shipping cost calculation
  - Order summary sidebar
  - Success confirmation page with order tracking

- **User Dashboard** (`/account`)
  - Order history with detailed status
  - Profile settings
  - Address management
  - Order tracking with visual timeline

### Technical Highlights

- **React** with functional components and hooks
- **Tailwind CSS** for modern, utility-first styling
- **React Router** for seamless navigation
- **Context API** for cart state management
- **Lucide React** for beautiful icons
- **Mock API** with simulated network delays
- **LocalStorage** for cart persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Stripe account (for payment processing) - [Get started for free](https://stripe.com)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd elite-store-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Stripe publishable key:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```
   - Get your Stripe keys from: https://dashboard.stripe.com/apikeys

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

### Payment Gateway Setup

This project supports multiple payment gateways:

#### PhonePe Payment Gateway (Primary)

PhonePe is the default payment method. To enable PhonePe payments:

1. **Create a PhonePe Merchant account** at [PhonePe Business](https://business.phonepe.com)
2. **Get your Merchant ID and Salt Key** from the PhonePe dashboard
3. **Backend Integration** (Required):
   - Create a backend API endpoint at `/api/phonepe/create-payment`
   - This endpoint should use your PhonePe credentials to create payment transactions
   - See `src/services/paymentService.js` for the expected API structure
   - PhonePe requires server-side integration for security (merchant ID, salt key)

**PhonePe Features:**
- UPI payments
- PhonePe Wallet
- Credit/Debit Cards
- Net Banking

#### Stripe Payment Gateway (Alternative)

For card payments, Stripe is also supported:

1. **Create a Stripe account** at [stripe.com](https://stripe.com)
2. **Get your API keys** from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. **Add your publishable key** to `.env` file:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```
4. **Backend Integration** (Required for production):
   - Create a backend API endpoint at `/api/create-payment-intent`
   - This endpoint should use your Stripe secret key to create payment intents

**Note**: For Stripe testing, you can use test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVV

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/
│   ├── mockApi.js          # API functions with simulated responses
│   └── mockData.js         # Mock product and order data
├── components/
│   ├── cart/
│   │   └── CartNotification.jsx
│   ├── common/
│   │   └── ScrollToTop.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── products/
│       └── ProductCard.jsx
├── context/
│   └── CartContext.jsx     # Global cart state management
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   └── Account.jsx
├── App.jsx                 # Main app component with routing
├── main.jsx               # Entry point
└── index.css              # Global styles and Tailwind directives
```

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-optimized interactions for mobile devices
- Collapsible navigation for smaller screens

### Color Palette
- Primary: Teal gradient (customizable in `tailwind.config.js`)
- Neutral grays for text and backgrounds
- Accent colors for status indicators and CTAs

### Micro-interactions
- Smooth hover effects on cards and buttons
- Scale transformations on interactive elements
- Animated progress indicators
- Slide-in notifications
- Loading states with pulse animations

## 🔌 API Integration

The project uses placeholder mock API functions that return pre-defined JSON structures. These can be easily replaced with real API endpoints:

### Available Functions

```javascript
// Products
fetchProducts(filters)          // Get all products with filtering
fetchProductDetails(id)         // Get single product
fetchFeaturedProducts()         // Get trending/best sellers
fetchProductReviews(productId)  // Get product reviews

// Cart & Orders
addItemToCart(product, quantity, variant)
processCheckout(checkoutData)   // Process order
fetchUserOrders(userId)         // Get order history
trackOrder(trackingNumber)      // Track order status
```

### Replacing with Real API

Simply update the functions in `src/api/mockApi.js` to call your actual REST API endpoints:

```javascript
export const fetchProducts = async (filters = {}) => {
  const response = await fetch('https://your-api.com/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  return await response.json();
};
```

## 🛒 Cart Management

The cart uses React Context for global state management and persists data in localStorage:

```javascript
import { useCart } from './context/CartContext';

// In your component
const { 
  cartItems, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  getCartTotal, 
  getCartCount 
} = useCart();
```

## 📱 Mobile Responsiveness

Every component is designed with mobile-first principles:
- Responsive grid layouts
- Touch-friendly buttons (min 44x44px)
- Mobile-optimized navigation
- Collapsible filters on mobile
- Optimized images with lazy loading
- Swipeable image galleries

## 🎯 Performance Optimizations

- Code splitting with React lazy loading
- Optimized images from Unsplash CDN
- Minimal re-renders with proper React hooks
- Debounced search and filter operations
- Efficient state management

## 🔐 Security Considerations

- Input validation on all forms
- XSS protection through React's built-in escaping
- HTTPS enforcement for production
- Integrated PhonePe payment gateway (Primary) - UPI, Wallet, Cards, Net Banking
- Integrated Stripe payment gateway (Alternative) for card payments
- Real-time shipping cost calculations
- Secure payment processing with PCI compliance
- Multiple payment method selection

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Other Platforms

The build output in the `dist` folder can be deployed to any static hosting service.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Future Enhancements

- User authentication and registration
- Wishlist functionality
- Product reviews submission
- Real-time inventory updates
- Email notifications
- Multi-currency support
- Advanced search with filters
- Product comparison
- Customer support chat
- Analytics integration

---

Built with ❤️ using React and Tailwind CSS

