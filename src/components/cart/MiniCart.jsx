import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function MiniCart({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const subtotal = getCartTotal();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              Cart ({getCartCount()})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
              <p className="text-sm sm:text-base text-gray-600 mb-2">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm sm:text-base"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cartItems.map(item => (
                <div key={item.cartItemId} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-0">
                  <Link
                    to={`/product/${item.id}`}
                    onClick={onClose}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={onClose}
                      className="block"
                    >
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    {(item.variant?.color || item.variant?.size) && (
                      <div className="text-xs text-gray-600 mt-1">
                        {item.variant.color && <span>Color: {item.variant.color}</span>}
                        {item.variant.color && item.variant.size && <span> • </span>}
                        {item.variant.size && <span>Size: {item.variant.size}</span>}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 gap-2">
                      <div className="flex items-center gap-1 sm:gap-2 border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1.5 sm:p-1 hover:bg-gray-100 transition-colors touch-target"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold min-w-[1.5rem] sm:min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1.5 sm:p-1 hover:bg-gray-100 transition-colors touch-target"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-red-600 hover:text-red-700 text-xs sm:text-sm mt-1 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 sm:p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <span className="text-base sm:text-lg font-semibold text-gray-900">Subtotal:</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full btn-primary flex items-center justify-center text-sm sm:text-base py-2.5 sm:py-3"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full text-center btn-secondary text-sm sm:text-base py-2.5 sm:py-3"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

