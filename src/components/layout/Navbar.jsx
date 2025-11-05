import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import MiniCart from '../cart/MiniCart';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:block">Elite Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Shop
            </Link>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </a>
          </div>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon (Mobile) */}
            <button className="lg:hidden text-gray-700 hover:text-primary-600 transition-colors">
              <Search className="w-6 h-6" />
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsMiniCartOpen(true)}
              className="relative text-gray-700 hover:text-primary-600 transition-colors group"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link 
                  to="/account" 
                  className="text-gray-700 hover:text-primary-600 transition-colors group"
                  title={user?.name || user?.email}
                >
                  <User className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-gray-700 hover:text-red-600 transition-colors group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden sm:block text-gray-700 hover:text-primary-600 transition-colors group"
              >
                <User className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <a 
                href="#" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
              >
                About
              </a>
              <a 
                href="#" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
              >
                Contact
              </a>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/account" 
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-2 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Mini Cart */}
      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
    </nav>
  );
}

