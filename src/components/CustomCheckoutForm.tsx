import React, { useState, ChangeEvent, useEffect } from 'react';
import { useStripe, useElements, CardElement, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import Image from 'next/image';

// Define component types
interface CustomCheckoutFormProps {
  price: number;
  productName: string;
  studentCount: number;
}

const CustomCheckoutForm: React.FC<CustomCheckoutFormProps> = ({
  price = 49,
  productName = "One Month of Enrollment",
  studentCount = 41180
}) => {
  // Add global styles to the component
  useEffect(() => {
    // Create a style element for global styles
    const style = document.createElement('style');
    style.innerHTML = `
      /* Reset browser specific styling for dropdowns */
      select {
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23CB9006' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important;
        background-repeat: no-repeat !important;
        background-position: right 0.7rem center !important;
        background-size: 1em !important;
        padding-right: 2.5rem !important;
        background-color: rgba(255, 255, 255, 0.05) !important;
        color: white !important;
      }
      
      /* Dropdown options styling */
      select option {
        background-color: #1a1a1a !important;
        color: white !important;
      }
      
      /* Firefox specific */
      @-moz-document url-prefix() {
        select {
          text-indent: 0.01px;
          text-overflow: '';
          padding-right: 1rem;
        }
        select option {
          background-color: #1a1a1a;
          color: white;
        }
      }
      
      /* Webkit browsers */
      select::-ms-expand {
        display: none;
      }
      
      /* IE and Edge */
      select::-ms-value {
        background-color: rgba(255, 255, 255, 0.05);
        color: white;
      }
      
      /* Hover and focus states */
      select option:hover,
      select option:focus,
      select option:active,
      select option:checked {
        background-color: rgba(203, 144, 6, 0.7) !important;
        color: white !important;
      }
      
      .color-force-white {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const stripe = useStripe();
  const elements = useElements();
  
  // Form state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('IN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isRenewal, setIsRenewal] = useState(false);

  // Check for subscription_expired parameter
  useEffect(() => {
    // Check if URL has subscription_expired parameter
    const urlParams = new URLSearchParams(window.location.search);
    const hasExpiredSubscription = urlParams.get('subscription_expired') === 'true';
    
    if (hasExpiredSubscription) {
      setIsRenewal(true);
      
      // Try to pre-fill form with user data from localStorage
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setEmail(userData.email || '');
          setFullName(userData.name || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Card element styles
  const cardElementStyle = {
    base: {
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  };

  // Countries list for dropdown
  const countries = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "IN", name: "India" },
    { code: "SG", name: "Singapore" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
    { code: "NL", name: "Netherlands" },
    { code: "BR", name: "Brazil" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "ZA", name: "South Africa" },
    { code: "NG", name: "Nigeria" },
    { code: "MX", name: "Mexico" },
    { code: "MY", name: "Malaysia" },
    { code: "PH", name: "Philippines" },
    { code: "TH", name: "Thailand" },
    { code: "ID", name: "Indonesia" },
    { code: "VN", name: "Vietnam" },
    { code: "RU", name: "Russia" },
    { code: "TR", name: "Turkey" },
  ];

  // Validate password
  const validatePassword = (): boolean => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    setPasswordError(null);
    return true;
  };

  // Register user in database
  const registerUser = async () => {
    try {
      // First, try to make the API call
      console.log("Attempting to register user:", { email, name: fullName });
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: fullName,
        }),
      });

      // Check if the response is JSON or HTML
      const contentType = response.headers.get('content-type');
      console.log("Registration response content type:", contentType);
      
      if (!response.ok) {
        // Handle error responses properly
        if (contentType && contentType.includes('application/json')) {
          // Parse JSON error response
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        } else {
          // Handle non-JSON error responses
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          throw new Error('Server error during registration. Please try again later.');
        }
      }

      // Parse successful JSON response
      const data = await response.json();
      
      // Store token and user info
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Set authentication cookie
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      } else {
        throw new Error('Invalid response from server. Missing authentication token.');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      // Re-throw with a more user-friendly message
      throw new Error(error instanceof Error ? error.message : 'An error occurred during registration. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug Stripe initialization
    console.log("Stripe initialization status:", {
      stripeExists: !!stripe,
      elementsExists: !!elements,
    });
    
    if (!stripe || !elements) {
      setError("Stripe is not initialized. Please refresh the page and try again.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate password fields only for new registrations
      if (!isRenewal && !validatePassword()) {
        setIsLoading(false);
        return;
      }
      
      console.log("Form values:", { email, fullName, address, zipCode, country });
      
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }
      
      // Validate fields
      if (!email || !fullName || !address || !zipCode || (!isRenewal && (!password || !confirmPassword))) {
        throw new Error("Please fill in all required fields.");
      }
      
      // Step 1: If not renewal, register user first; otherwise get existing user ID
      console.log("Step 1: " + (isRenewal ? "Getting existing user data" : "Registering user"));
      let registrationResult;
      
      if (isRenewal) {
        // For renewal, get user data from localStorage
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userData = JSON.parse(userStr);
            registrationResult = {
              success: true,
              user: {
                id: userData.id,
                email: userData.email,
                name: userData.name
              }
            };
            console.log("Using existing user data for renewal:", userData.id);
          } else {
            throw new Error("User data not found for renewal");
          }
        } catch (error) {
          console.error("Failed to get existing user data:", error);
          throw new Error("Your session data is missing. Please log in again before renewing.");
        }
      } else {
        // For new registrations, register the user
        try {
          registrationResult = await registerUser();
          console.log("Registration successful:", registrationResult);
          
          if (!registrationResult?.user?.id) {
            throw new Error("Registration completed but user ID is missing");
          }
        } catch (registrationError: any) {
          console.error("Registration failed:", registrationError);
          
          // Special handling for database connection errors in development mode
          if (process.env.NODE_ENV === 'development' && 
              registrationError instanceof Error && 
              registrationError.message.includes('Database connection error')) {
            
            console.warn("DEVELOPMENT MODE: Using mock user ID for payment despite database error");
            
            // Create mock registration result for development testing
            registrationResult = {
              success: true,
              token: 'mock-token-' + Date.now(),
              user: {
                id: 'mock-user-' + Date.now(),
                email: email,
                name: fullName
              }
            };
            
            // Proceed to payment step
          } else {
            // For other errors or in production, re-throw
            throw registrationError;
          }
        }
      }
      
      // Step 2: Process payment with Stripe
      console.log("Step 2: Processing payment");
      
      // Create payment method
      console.log("Creating payment method with billing details:", {
        name: fullName,
        email: email,
        address: {
          line1: address,
          postal_code: zipCode,
          country: country
        }
      });
      
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: fullName,
          email: email,
          address: {
            line1: address,
            postal_code: zipCode,
            country: country
          }
        }
      });
      
      if (stripeError) {
        console.error("Stripe error creating payment method:", stripeError);
        throw new Error(stripeError.message);
      }
      
      console.log("Payment method created successfully:", paymentMethod.id);
      
      // Step 3: Create payment intent on server
      console.log("Step 3: Creating payment intent");
      try {
        // Calculate the price in cents
        const amount = Math.round(price * 100); // Convert to cents
        
        console.log("Sending payment request with amount:", amount);
        
        const paymentResponse = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            email,
            fullName,
            address,
            country,
            amount: amount,
            planType: 'onetime',
            userId: registrationResult?.user?.id
          }),
        });
        
        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.message || 'Payment processing failed');
        }
        
        const paymentData = await paymentResponse.json();
        console.log("Payment processed successfully:", paymentData);
        
        // Redirect to success page - use URL from server if available
        if (paymentData.url) {
          window.location.href = paymentData.url;
        } else {
          window.location.href = '/login-success';
        }
      } catch (paymentError) {
        console.error("Payment processing failed:", paymentError);
        throw paymentError;
      }
    } catch (error) {
      console.error('Payment or registration error:', error);
      
      // Set more detailed error messages based on the error context
      let errorMessage = "An unexpected error occurred";
      
      if (error instanceof Error) {
        if (error.message.includes('registration')) {
          errorMessage = `Registration error: ${error.message}`;
        } else if (error.message.includes('card') || error.message.includes('payment')) {
          errorMessage = `Payment error: ${error.message}`;
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the final price - no discounts
  const finalPrice = price;
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-[#061213] rounded-lg overflow-hidden shadow-xl border border-[#CB9006]/20">
      {/* Left side - Personal Information */}
      <div className="w-full md:w-1/2 p-8 bg-[#061213] text-white">
        {/* Subscription expired message */}
        {isRenewal && (
          <div className="mb-6 p-4 bg-[#614803]/30 border border-[#CB9006]/50 text-[#CB9006] text-center rounded">
            <h3 className="font-bold text-xl mb-2">Your subscription has expired</h3>
            <p>Please renew your subscription to continue accessing premium trading content and analytics.</p>
          </div>
        )}
      
        {/* Error display within the form */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 text-center rounded">
            {error}
          </div>
        )}
      
        <h1 className="text-xl md:text-2xl text-center mb-8">
          Join Trading Academy community of {studentCount.toLocaleString()} students
        </h1>
        
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
        
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 text-white border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent"
            required
            readOnly={isRenewal}
          />
          {isRenewal && (
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed for subscription renewal</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="full-name" className="block mb-2 text-sm">Full Name</label>
          <input
            id="full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white/5 text-white border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent"
            required
          />
        </div>

        {!isRenewal && (
          <>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 text-white border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent"
                required={!isRenewal}
                minLength={8}
              />
              <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block mb-2 text-sm">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 text-white border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent"
                required={!isRenewal}
              />
              {passwordError && (
                <p className="text-xs text-red-400 mt-1">{passwordError}</p>
              )}
            </div>
          </>
        )}
        
        <div className="bg-white/5 rounded-lg p-6 mt-8 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{productName}</h2>
            <div className="text-2xl font-bold text-[#CB9006]">${finalPrice.toFixed(2)}</div>
          </div>
          
          <div className="mt-4 text-gray-300">
            <p>By enrolling, you'll join our exclusive community of traders and investors for a monthly subscription.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Billing and Payment Info */}
      <div className="w-full md:w-1/2 p-8 bg-[#0A1114] text-white border-l border-[#1A1D24]/30">
        {/* Error display within the payment section */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 text-center rounded">
            {error}
          </div>
        )}
        
        <h3 className="text-lg font-medium mb-4">Billing Information</h3>
        
        <div className="mb-4">
          <label htmlFor="address" className="block mb-2 text-sm">Address</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white/5 text-white border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="zip-code" className="block mb-2 text-sm">Zip Code</label>
          <input
            id="zip-code"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full bg-white/5 text-white border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="country" className="block mb-2 text-sm">Country</label>
          <div className="relative">
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-white/5 text-white border border-[#CB9006]/40 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent color-force-white"
              required
            >
              <option value="US" className="color-force-white">United States</option>
              <option value="CA" className="color-force-white">Canada</option>
              <option value="GB" className="color-force-white">United Kingdom</option>
              <option value="AU" className="color-force-white">Australia</option>
              <option value="IN" className="color-force-white">India</option>
              <option value="SG" className="color-force-white">Singapore</option>
              <option value="DE" className="color-force-white">Germany</option>
              <option value="FR" className="color-force-white">France</option>
              <option value="ES" className="color-force-white">Spain</option>
              <option value="IT" className="color-force-white">Italy</option>
              <option value="NL" className="color-force-white">Netherlands</option>
              <option value="BR" className="color-force-white">Brazil</option>
              <option value="JP" className="color-force-white">Japan</option>
              <option value="KR" className="color-force-white">South Korea</option>
              <option value="AE" className="color-force-white">United Arab Emirates</option>
              <option value="SA" className="color-force-white">Saudi Arabia</option>
              <option value="ZA" className="color-force-white">South Africa</option>
              <option value="NG" className="color-force-white">Nigeria</option>
              <option value="MX" className="color-force-white">Mexico</option>
            </select>
          </div>
        </div>

        <h3 className="text-lg font-medium mt-8 mb-4">Payment Method</h3>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="card-payment"
              name="payment-method"
              className="mr-2 accent-[#CB9006]"
              checked={true}
            />
            <label htmlFor="card-payment" className="text-lg">Credit/Debit Card</label>
          </div>
          
          {/* Simple Card Input */}
          <div className="bg-white/5 border border-white/10 rounded p-4 mb-6">
            <CardElement
              options={{
                hidePostalCode: true,
                style: cardElementStyle
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`w-full py-3 rounded-lg font-bold ${
            isLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-[#CB9006] hover:bg-[#B07D05]'
          } transition-colors duration-200 mt-4`}
        >
          {isLoading 
            ? 'Processing payment...' 
            : isRenewal 
              ? `Renew Subscription: $${finalPrice.toFixed(2)}`
              : `Enroll Now: $${finalPrice.toFixed(2)}`}
        </button>
        
        <p className="text-xs text-gray-400 text-center mt-4">
          By completing your purchase you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  );
};

export default CustomCheckoutForm;