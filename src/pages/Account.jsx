import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Package, Search, ChevronRight } from 'lucide-react';
import { fetchUserOrders, trackOrder } from '../api/mockApi';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { id: 'orders', name: 'Order History', icon: Package },
  { id: 'profile', name: 'Profile Settings', icon: User },
  { id: 'addresses', name: 'Addresses', icon: MapPin },
  { id: 'tracking', name: 'Track Order', icon: Search }
];

export default function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account' } } });
      return;
    }
    
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    setLoading(true);
    const response = await fetchUserOrders();
    if (response.success) {
      setOrders(response.data);
    }
    setLoading(false);
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      alert('Please enter a tracking number');
      return;
    }

    setTrackingLoading(true);
    const response = await trackOrder(trackingNumber);
    
    if (response.success) {
      setTrackingResult(response.data);
    } else {
      alert('Tracking number not found. Please check and try again.');
      setTrackingResult(null);
    }
    setTrackingLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Shipped':
      case 'Out for Delivery':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6 pb-4 sm:pb-6 border-b gap-3 sm:gap-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                  {user ? (user.firstName?.[0] || user.name?.[0] || user.email?.[0] || 'U').toUpperCase() : ''}
                  {user && (user.lastName?.[0] || '').toUpperCase()}
                </div>
                <div className="sm:ml-4 text-center sm:text-left">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{user?.name || user?.email || 'User'}</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">{user?.email || ''}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Order History */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order History</h2>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse border rounded-lg p-6">
                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600">Order Number</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900 break-all">{order.id}</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Order Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tracking Number</p>
                            <p className="font-medium text-gray-900">
                              {order.trackingNumber || 'Not available yet'}
                            </p>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Items:</p>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {item.name} × {item.quantity}
                                </span>
                                <span className="font-medium text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          {order.trackingNumber && (
                            <button
                              onClick={() => {
                                setActiveTab('tracking');
                                setTrackingNumber(order.trackingNumber);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
                            >
                              Track Order
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            to={`/account/orders/${order.id}`}
                            className="flex-1 text-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Profile Settings</h2>

                <form 
                  className="space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setProfileSaving(true);
                    try {
                      await updateProfile(profileData);
                      alert('Profile updated successfully!');
                    } catch (error) {
                      alert('Failed to update profile. Please try again.');
                    } finally {
                      setProfileSaving(false);
                    }
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
                        <input type="password" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                        <input type="password" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm New Password</label>
                        <input type="password" className="input-field" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={profileSaving}
                  >
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Saved Addresses</h2>
                  <button className="btn-primary w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">Add New Address</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Default Address */}
                  <div className="border-2 border-primary-600 rounded-xl p-6 relative">
                    <span className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Default
                    </span>
                    <h3 className="font-bold text-gray-900 mb-4">Home</h3>
                    <p className="text-gray-700 mb-1">John Doe</p>
                    <p className="text-gray-700 mb-1">123 Main Street</p>
                    <p className="text-gray-700 mb-1">New York, NY 10001</p>
                    <p className="text-gray-700 mb-4">+1 (555) 123-4567</p>
                    <div className="flex gap-2">
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Additional Address */}
                  <div className="border-2 border-gray-300 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Work</h3>
                    <p className="text-gray-700 mb-1">John Doe</p>
                    <p className="text-gray-700 mb-1">456 Business Ave, Suite 200</p>
                    <p className="text-gray-700 mb-1">New York, NY 10002</p>
                    <p className="text-gray-700 mb-4">+1 (555) 987-6543</p>
                    <div className="flex gap-2">
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Edit
                      </button>
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Set as Default
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Track Order */}
            {activeTab === 'tracking' && (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Track Your Order</h2>

                <form onSubmit={handleTrackOrder} className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Enter Tracking Number
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="input-field flex-1"
                      placeholder="e.g., TRK123456789"
                    />
                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {trackingLoading ? 'Tracking...' : 'Track Order'}
                    </button>
                  </div>
                </form>

                {trackingResult && (
                  <div className="space-y-6">
                    {/* Status Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-primary-100 text-sm">Order ID</p>
                          <p className="text-2xl font-bold">{trackingResult.orderId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary-100 text-sm">Status</p>
                          <p className="text-2xl font-bold">{trackingResult.status}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-primary-100">
                              Progress
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block text-primary-100">
                              {trackingResult.progress}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-primary-200">
                          <div
                            style={{ width: `${trackingResult.progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white transition-all duration-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="border rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-6">Tracking Timeline</h3>
                      <div className="space-y-6">
                        {trackingResult.timeline.map((event, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  event.completed
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-300 text-gray-600'
                                }`}
                              >
                                {event.completed ? (
                                  <Package className="w-5 h-5" />
                                ) : (
                                  <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                )}
                              </div>
                              {index < trackingResult.timeline.length - 1 && (
                                <div
                                  className={`w-0.5 h-16 ${
                                    event.completed ? 'bg-green-600' : 'bg-gray-300'
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <p
                                className={`font-semibold ${
                                  event.completed ? 'text-gray-900' : 'text-gray-500'
                                }`}
                              >
                                {event.status}
                              </p>
                              <p className="text-sm text-gray-600">{event.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

