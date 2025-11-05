import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { fetchProducts } from '../api/mockApi';
import ProductCard from '../components/products/ProductCard';

const categories = ['All', 'Electronics', 'Wearables', 'Accessories', 'Home & Office', 'Sports & Outdoors', 'Bags', 'Home & Living'];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'artist', label: 'Artist A-Z' },
  { value: 'collection', label: 'Collection' }
];

// Mock artists and collections - in production, these would come from API
const artists = ['All', 'John Smith', 'Sarah Johnson', 'Michael Chen', 'Emma Davis'];
const collections = ['All', 'Premium Collection', 'Artisan Series', 'Limited Edition', 'Heritage Line'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArtist, setSelectedArtist] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Get search query from URL
    const searchQuery = searchParams.get('search');
    loadProducts(searchQuery);
  }, [selectedCategory, selectedArtist, selectedCollection, priceRange, sortBy, searchParams]);

  const loadProducts = async (searchQuery = null) => {
    setLoading(true);
    const filters = {
      category: selectedCategory,
      artist: selectedArtist !== 'All' ? selectedArtist : undefined,
      collection: selectedCollection !== 'All' ? selectedCollection : undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy: sortBy,
      search: searchQuery
    };
    
    const response = await fetchProducts(filters);
    if (response.success) {
      let filteredProducts = response.data;
      
      // Client-side filtering for artist and collection (since mock API may not support these)
      if (selectedArtist !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.artist === selectedArtist);
      }
      if (selectedCollection !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.collection === selectedCollection);
      }
      
      setProducts(filteredProducts);
    }
    setLoading(false);
  };

  // Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const handleArtistChange = (artist) => {
    setSelectedArtist(artist);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const handleCollectionChange = (collection) => {
    setSelectedCollection(collection);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: parseInt(value) }));
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Artists */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Artist</h3>
        <div className="space-y-2">
          {artists.map(artist => (
            <button
              key={artist}
              onClick={() => handleArtistChange(artist)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedArtist === artist
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {artist}
            </button>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Collection</h3>
        <div className="space-y-2">
          {collections.map(collection => (
            <button
              key={collection}
              onClick={() => handleCollectionChange(collection)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCollection === collection
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {collection}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Min Price: ${priceRange.min}</label>
            <input
              type="range"
              name="min"
              min="0"
              max="500"
              value={priceRange.min}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Max Price: ${priceRange.max}</label>
            <input
              type="range"
              name="max"
              min="0"
              max="500"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange.min}</span>
            <span>${priceRange.max}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop All Products</h1>
          <p className="text-sm sm:text-base text-gray-600">Discover our complete collection of premium products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-4 lg:p-6 sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>

                <span className="text-gray-600">
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-gray-600 text-sm">Sort by:</label>
                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none cursor-pointer"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileFilters(false)}>
                <div 
                  className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <FilterSidebar />
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">No products found</p>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === i + 1
                              ? 'bg-primary-600 text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

