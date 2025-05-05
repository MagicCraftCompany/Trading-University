# Trading University

A comprehensive trading education platform built with Next.js, TypeScript, and modern web technologies.

## Features

- 📚 Educational Content Management
- 🔐 User Authentication with Google OAuth
- 🎥 YouTube Membership Verification
- 💳 Stripe Integration for Payments
- 🪙 USDT (Tether) Cryptocurrency Payments
- 🍎 Apple Pay Support
- 🎯 Interactive Learning Experience
- 🗄️ Database Integration with Supabase
- 📱 Responsive Design
- ⚡ Real-time Updates

## Tech Stack

- **Frontend:**
  - Next.js
  - TypeScript
  - Styled Components
  - Framer Motion

- **Backend:**
  - Next.js API Routes
  - Supabase
  - PostgreSQL

- **Authentication:**
  - Google OAuth
  - YouTube Membership Verification
  - JWT

- **Payment Processing:**
  - Stripe
  - Cryptocurrency (USDT)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- Supabase account
- Stripe account
- Google OAuth credentials
- YouTube API credentials

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   YOUTUBE_CLIENT_ID=your_youtube_client_id
   YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
   YOUTUBE_CHANNEL_ID=UC9RRYB9wpfAKPy95OSUdzDw
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
trading-university/
├── components/     # Reusable UI components
├── pages/          # Next.js pages and API routes
├── public/         # Static assets
├── styles/         # Global styles and themes
├── lib/           # Utility functions and configurations
├── types/         # TypeScript type definitions
└── prisma/        # Database schema and migrations
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Setting Up Apple Pay Integration

To enable Apple Pay in your application, follow these steps:

1. **Register an Apple Merchant ID**:
   - Go to the [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/merchant)
   - Create a new Merchant ID (e.g., `merchant.com.yourdomain.trading`)
   - Add your domain to the list of approved domains

2. **Configure Stripe for Apple Pay**:
   - In your [Stripe Dashboard](https://dashboard.stripe.com/account/apple_pay), go to Settings > Payment methods > Apple Pay
   - Add your domain for verification
   - Download the domain verification file from Stripe
   - Place the verification file at `/.well-known/apple-developer-merchantid-domain-association` on your server
   - Complete the domain verification in Stripe

3. **Configure the Stripe API in your application**:
   - Make sure your Stripe publishable key is configured in the client-side code
   - Test Apple Pay in development mode using supported browsers/devices

4. **Add the domain verification file to your Next.js project**:
   - Create a `.well-known` folder in your `public` directory
   - Download the domain association file from Stripe Dashboard
   - Place it in `public/.well-known/apple-developer-merchantid-domain-association`

5. **Update next.config.js to handle the .well-known directory**:
   ```js
   module.exports = {
     // ... other configuration
     async headers() {
       return [
         {
           source: '/.well-known/apple-developer-merchantid-domain-association',
           headers: [
             {
               key: 'Content-Type',
               value: 'text/plain',
             },
           ],
         },
       ];
     },
   };
   ```

## Crypto Payment Integration

The trading platform now accepts USDT (Tether) payments on the TRC20 network. This integration includes:

- QR code generation for easy wallet scanning
- Transaction hash verification
- Automatic subscription management

For production use, you should integrate with a crypto payment processor such as:

- Coinbase Commerce
- BitPay
- CoinPayments

These services provide APIs for validating transactions and converting crypto to fiat currency automatically.

### Configuring USDT Payments

1. Update your USDT wallet address in `getCryptoWalletInfo()` function in `src/components/CustomCheckoutForm.tsx`
2. Set up webhook endpoints to receive transaction confirmations from your chosen payment processor
3. Update the transaction verification logic in `src/pages/api/crypto-checkout.ts`

## Authentication Implementation

### Google Authentication Flow

The application uses NextAuth.js for Google authentication. Here is the detailed flow:

1. **Initial Setup**
   - Configure Google OAuth credentials in Google Cloud Console
   - Add authorized JavaScript origins (e.g., `http://localhost:3000`, `https://your-production-domain.com`)
   - Add authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`, `https://your-production-domain.com/api/auth/callback/google`)
   - Copy Client ID and Client Secret to your environment variables

2. **User Authentication Flow**
   - User clicks "Sign in with Google" on the login page
   - Frontend constructs Google auth URL using `getGoogleAuthUrl()` function
   - This redirects to NextAuth's Google signin endpoint: `/api/auth/signin/google`
   - NextAuth redirects to Google's OAuth consent screen
   - User authenticates with Google and grants permissions
   - Google redirects back to the callback URL: `/api/auth/callback/google`

3. **Callback Processing**
   - NextAuth processes the callback in `src/pages/api/auth/[...nextauth].ts`
   - It verifies the authentication and creates/updates user data in the database
   - The `signIn` callback checks if user already exists and updates user data
   - NextAuth creates a secure JWT token and sets cookies
   - User is redirected back to the login page with success parameters

4. **Frontend Completion**
   - Login page (`src/pages/login.tsx`) checks for successful authentication parameters
   - It stores the token in localStorage and cookies
   - Dispatches an `authChange` event to update UI components
   - Redirects to the success page

5. **Troubleshooting**
   - Ensure all environment variables are correctly set
   - Verify redirect URIs exactly match what's configured in Google Cloud Console
   - Check server logs for detailed error messages
   - Use the debug endpoint `/api/debug-auth` in development environment

### YouTube Membership Verification Flow

The application verifies YouTube channel memberships using a custom implementation:

1. **Initial Setup**
   - Configure YouTube API credentials in Google Cloud Console
   - Enable YouTube Data API v3
   - Add the same authorized redirect URIs as Google Auth, plus YouTube-specific callbacks:
     - `http://localhost:3000/api/auth/youtube-callback`
     - `https://your-production-domain.com/api/auth/youtube-callback`
   - Store the YouTube channel ID: `UC9RRYB9wpfAKPy95OSUdzDw`

2. **User Verification Flow**
   - User initiates YouTube membership verification
   - Frontend redirects to `/api/auth/youtube-auth` endpoint
   - This endpoint builds a YouTube authorization URL with required scopes
   - User is redirected to Google's OAuth consent screen
   - User authenticates and grants access to YouTube data

3. **Callback Processing**
   - Google redirects back to `/api/auth/youtube-callback`
   - The callback handler exchanges the authorization code for access/refresh tokens
   - It fetches the user's YouTube channel information
   - It checks if the user is a member of the specified channel (UC9RRYB9wpfAKPy95OSUdzDw)
   - Membership verification uses the YouTube Members API
   - The result is stored in the user's profile

4. **Frontend Completion**
   - User is redirected back to the login/registration form with membership status
   - If verification is successful, user completes registration
   - The membership status determines access level in the application

5. **Troubleshooting**
   - Ensure YouTube API is enabled and properly configured
   - Verify you have the correct YouTube channel ID (UC9RRYB9wpfAKPy95OSUdzDw)
   - Check server logs for YouTube API errors
   - Verify the application has sufficient API quotas

## Development Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server with `npm run dev`




