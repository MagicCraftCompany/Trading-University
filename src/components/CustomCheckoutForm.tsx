import React, { useState, ChangeEvent } from 'react';
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
  productName = "One Year of Enrollment",
  studentCount = 41180
}) => {
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
  const [isGift, setIsGift] = useState(false);
  const [discountSelected, setDiscountSelected] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  // Handle discount toggle
  const handleDiscountToggle = () => {
    setDiscountSelected(!discountSelected);
  };

  // Handle gift toggle
  const handleGiftToggle = () => {
    setIsGift(!isGift);
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

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
      
      // Notify components about authentication change
      window.dispatchEvent(new Event('authChange'));
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
      // Validate password fields
      if (!validatePassword()) {
        setIsLoading(false);
        return;
      }
      
      console.log("Form values:", { email, fullName, address, zipCode, country });
      
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }
      
      // Validate fields
      if (!email || !fullName || !address || !zipCode || !password || !confirmPassword) {
        throw new Error("Please fill in all required fields.");
      }
      
      // Step 1: Register user first
      console.log("Step 1: Registering user");
      let registrationResult;
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
        // Calculate the discounted price for the payload
        const amount = Math.round(finalPrice * 100); // Convert to cents
        
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
            isGift,
            applyDiscount: discountSelected,
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
        
        // Redirect to success page
        window.location.href = '/login-success';
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
      
      // Make sure the error is visible to the user
      setTimeout(() => {
        const errorElement = document.querySelector('.bg-red-900');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the discounted price
  const finalPrice = discountSelected ? price * 0.8 : price; // 20% discount
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      {/* Error display at the top */}
      {error && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-red-900 bg-opacity-50 border border-red-800 text-white text-center">
          {error}
        </div>
      )}
      
      {/* Development mode message */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-yellow-600 bg-opacity-70 border border-yellow-500 text-white text-center text-sm">
          Development Mode: Some features may use mock data if database connection fails
        </div>
      )}
      
      {/* Left side - Personal Information */}
      <div className="w-full md:w-1/2 p-8 bg-gray-900 text-white">
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
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="full-name" className="block mb-2 text-sm">Full Name</label>
          <input
            id="full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {passwordError && (
            <p className="text-xs text-red-400 mt-1">{passwordError}</p>
          )}
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{productName}</h2>
            <div className="text-2xl font-bold">${finalPrice.toFixed(2)}</div>
          </div>
          <div className="text-blue-400 text-sm">7-day money back guarantee</div>
          
          <div className="mt-4 flex items-center">
            <div 
              className={`w-10 h-5 relative rounded-full ${isGift ? 'bg-blue-500' : 'bg-gray-600'} transition-colors duration-200 ease-in-out cursor-pointer`} 
              onClick={handleGiftToggle}
            >
              <div 
                className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ease-in-out ${isGift ? 'translate-x-5' : ''}`} 
              />
            </div>
            <span className="ml-3 text-gray-300">Gift it</span>
          </div>
          
          <div className="mt-4 text-gray-300">
            <p>20% off for anyone under 25, students, teachers, and military <span className="text-blue-400 cursor-pointer" onClick={handleDiscountToggle}>Select ID for discount</span></p>
          </div>
        </div>
      </div>
      
      {/* Right side - Billing and Payment Info */}
      <div className="w-full md:w-1/2 p-8 bg-gray-900 text-white border-l border-gray-800">
        <h3 className="text-lg font-medium mb-4">Billing Information</h3>
        
        <div className="mb-4">
          <label htmlFor="address" className="block mb-2 text-sm">Address</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="country" className="block mb-2 text-sm">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
            <option value="SG">Singapore</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
          </select>
        </div>

        <h3 className="text-lg font-medium mt-8 mb-4">Payment Method</h3>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="card-payment"
              name="payment-method"
              className="mr-2"
              checked={paymentMethod === 'card'}
              onChange={() => handlePaymentMethodChange('card')}
            />
            <label htmlFor="card-payment" className="text-lg">Credit/Debit Card</label>
          </div>
          
          {/* Simple Card Input */}
          <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-6">
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
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-200 mt-4`}
        >
          {isLoading ? 'Processing payment...' : `Pay $${finalPrice.toFixed(2)}`}
        </button>
        
        <p className="text-xs text-gray-400 text-center mt-4">
          By completing your purchase you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  );
};

export default CustomCheckoutForm; 