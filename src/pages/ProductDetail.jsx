import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Check, Truck, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProductDetails, fetchProductReviews } from '../api/mockApi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const [productResponse, reviewsResponse] = await Promise.all([
      fetchProductDetails(id),
      fetchProductReviews(id)
    ]);

    if (productResponse.success) {
      setProduct(productResponse.data);
      setRelatedProducts(productResponse.data.relatedProducts || []);
      
      // Initialize selected variants
      const initialVariant = {};
      if (productResponse.data.variants?.colors?.length > 0) {
        initialVariant.color = productResponse.data.variants.colors[0];
      }
      if (productResponse.data.variants?.sizes?.length > 0) {
        initialVariant.size = productResponse.data.variants.sizes[0];
      }
      setSelectedVariant(initialVariant);
    }

    if (reviewsResponse.success) {
      setReviews(reviewsResponse.data);
    }

    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedVariant);
    }
  };

  const handleImageNavigation = (direction) => {
    if (!product) return;
    const totalImages = product.images.length;
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % totalImages);
    } else {
      setSelectedImage((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Link to="/shop" className="text-primary-600 hover:text-primary-700">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link to="/shop" className="hover:text-primary-600">Shop</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg mb-4 group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 md:h-[500px] object-cover"
              />
              
              {/* Image Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Stock Badge */}
              {!product.inStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary-600 scale-105' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Variants */}
              {product.variants?.colors && product.variants.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Color: <span className="text-gray-600 font-normal">{selectedVariant.color}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                        className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                          selectedVariant.color === color
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.variants?.sizes && product.variants.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Size: <span className="text-gray-600 font-normal">{selectedVariant.size}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                        className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                          selectedVariant.size === size
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 border-x-2 border-gray-300 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {product.inStock && (
                    <span className="flex items-center text-green-600 font-medium">
                      <Check className="w-5 h-5 mr-1" />
                      In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center text-gray-700">
                  <Truck className="w-5 h-5 mr-3 text-primary-600" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ShieldCheck className="w-5 h-5 mr-3 text-primary-600" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'features'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'shipping'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Shipping & Delivery
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-3">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-gray-700">
                <p><strong>Standard Shipping:</strong> 5-7 business days - Free on orders over $50</p>
                <p><strong>Express Shipping:</strong> 2-3 business days - $15</p>
                <p><strong>International Shipping:</strong> 10-15 business days - Calculated at checkout</p>
                <p className="text-sm text-gray-600 mt-4">
                  * All orders are processed within 1-2 business days. You will receive a tracking number once your order ships.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-3 font-semibold text-gray-900">{review.title}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.content}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">{review.author}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

