import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      youTubeMember?: boolean;
      subscription?: {
        status: string;
        currentPeriodEnd: Date | null;
      };
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    youTubeMembershipVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    youTubeMember?: boolean;
    subscription?: {
      status: string;
      currentPeriodEnd: Date | null;
    };
  }
} 