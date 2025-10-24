'use client';

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Payment() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);

  // Get plan from navigation state, default to Pro
  const plan = location.state?.plan || 'Pro';
  const amount = plan === 'Pro' ? 15 : 0;

  // Form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // Limit to 16 digits + 3 spaces
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate card number (simple check for 16 digits)
    const cardDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardDigits || cardDigits.length !== 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Validate card name
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Please enter the name on card';
    }

    // Validate expiry date
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // Validate CVV
    if (!formData.cvv || (formData.cvv.length !== 3 && formData.cvv.length !== 4)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    // Validate billing address
    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'Please enter your billing address';
    }

    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city';
    }

    // Validate state
    if (!formData.state.trim()) {
      newErrors.state = 'Please enter your state';
    }

    // Validate zip code
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Please enter your ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    // In a real app, you would integrate with Stripe or Square API here
    setTimeout(() => {
      setProcessing(false);
      alert('Payment successful! Welcome to Pro plan.');
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gray-100'}`}>
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            <div className="flex items-center cursor-pointer" onClick={() => router.push('/dashboard')}>
              <div className="relative w-14 h-14 flex items-center justify-center -mr-2">
                <svg viewBox="0 0 100 100" className="w-14 h-14">
                  <path
                    d="M75 25c-2-3-4-5-6-6-1-2-3-3-5-3l-2-4c-1-2-2-3-4-4-2-1-3-1-5 0-1 1-2 2-2 4l-1 3c-3 0-6 1-8 3-3 2-5 5-7 8-1 2-2 4-2 7v3c-2 1-4 2-5 4-2 2-3 5-3 8 0 2 0 4 1 6 1 2 2 3 4 4l2 1v8c0 2 1 4 2 5 2 2 4 3 6 3h4c2 0 4-1 6-2l8-6c2-1 3-2 5-2h6c3 0 5-1 7-3 2-2 3-4 3-7v-5c2-1 3-2 4-4 1-2 2-4 2-6 0-3-1-6-3-8-1-2-3-3-5-4v-2c0-3-1-5-3-8zm-8 15c-1 1-2 1-3 1s-2 0-3-1c-1-1-1-2-1-3s0-2 1-3c1-1 2-1 3-1s2 0 3 1c1 1 1 2 1 3s0 2-1 3z"
                    fill="#0a4f4c"
                  />
                  <text
                    x="50"
                    y="58"
                    fontSize="32"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    E
                  </text>
                </svg>
              </div>
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} -mt-[4px]`}>Ezarg</span>
            </div>

            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Secure Payment</h1>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/subscription')}
                className={`px-4 py-2 ${darkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-800'} text-white rounded-lg font-medium transition-all`}
              >
                Back
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 ${darkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-800'} text-white rounded-lg font-medium transition-all`}
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className={`md:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Payment Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-3 border ${errors.cardNumber ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border ${errors.cardName ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                  )}
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={`w-full px-4 py-3 border ${errors.expiryDate ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={`w-full px-4 py-3 border ${errors.cvv ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Billing Address
                  </label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className={`w-full px-4 py-3 border ${errors.billingAddress ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  />
                  {errors.billingAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>
                  )}
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className={`w-full px-4 py-3 border ${errors.city ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className={`w-full px-4 py-3 border ${errors.state ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className={`w-full px-4 py-3 border ${errors.zipCode ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${processing ? 'animate-pulse' : ''}`}
                >
                  {processing ? 'Processing Payment...' : `Pay $${amount}/month`}
                </button>

                <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>
                  🔒 Your payment information is secure and encrypted
                </p>
              </form>
            </div>

            {/* Order Summary */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 h-fit`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Plan</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Billing Cycle</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Subtotal</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>${amount}.00</span>
                </div>
              </div>

              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} pt-4 mb-6`}>
                <div className="flex justify-between">
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total</span>
                  <span className="text-2xl font-bold text-green-500">${amount}.00/mo</span>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg p-4`}>
                <h4 className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-2`}>What's Included:</h4>
                <ul className={`text-sm space-y-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  <li>✓ Unlimited AI queries</li>
                  <li>✓ Claude (Anthropic)</li>
                  <li>✓ ChatGPT (OpenAI)</li>
                  <li>✓ Grok (xAI)</li>
                  <li>✓ Perplexity</li>
                  <li>✓ Priority support</li>
                  <li>✓ Export conversations</li>
                </ul>
              </div>

              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'} mt-4 text-center`}>
                Cancel anytime. No hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className={`relative bottom-0 left-0 right-0 py-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-8`}>
        © 2025 ezarg.com
      </footer>
    </div>
  );
}
