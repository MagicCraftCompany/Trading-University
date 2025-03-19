import 'stripe';

declare module 'stripe' {
  namespace Stripe {
    type StripeApiVersion = '2024-12-18.acacia' | '2025-02-24.acacia';
  }
} 