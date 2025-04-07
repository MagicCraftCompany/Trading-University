# Trading University

A comprehensive trading education platform built with Next.js, TypeScript, and modern web technologies.

## Features

- 📚 Educational Content Management
- 🔐 User Authentication with Google OAuth
- 💳 Stripe Integration for Payments
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
  - JWT

- **Payment Processing:**
  - Stripe

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- Supabase account
- Stripe account
- Google OAuth credentials

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
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




