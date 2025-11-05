import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartNotification() {
  const { showCartNotification } = useCart();

  if (!showCartNotification) return null;

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right">
      <div className="bg-white shadow-2xl rounded-lg p-4 flex items-center space-x-3 border-l-4 border-green-500">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <div>
          <p className="font-semibold text-gray-900">Added to cart!</p>
          <p className="text-sm text-gray-600">Item successfully added</p>
        </div>
      </div>
    </div>
  );
}

