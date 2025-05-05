import { NextApiHandler } from 'next';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/db/prisma';
import { compare } from 'bcryptjs';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        // Update last login time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google login
      if (account?.provider === 'google' && profile?.email) {
        // Check if user exists in our database
        const dbUser = await prisma.user.findUnique({
          where: { email: profile.email },
          include: { subscription: true }
        });

        if (!dbUser) {
          // Check for YouTube membership first
          if (user.id) {
            // Update user with Google ID and last login time
            await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: profile.sub as string,
                lastLoginAt: new Date()
              }
            });
          }
          // For non-existing users, we'll redirect them to the homepage with an option to authenticate with YouTube
          return `/login?error=NoAccountFound&email=${encodeURIComponent(profile.email as string)}`;
        }
        
        // Update existing user's last login time
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { 
            lastLoginAt: new Date(),
            googleId: profile.sub as string
          }
        });
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        
        // Add YouTube membership status if available
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { youTubeMembershipVerified: true }
        });
        
        if (dbUser) {
          token.youTubeMember = dbUser.youTubeMembershipVerified;
        }
        
        // Add subscription status if available
        const subscription = await prisma.subscription.findUnique({
          where: { userId: user.id }
        });
        
        if (subscription) {
          token.subscription = {
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // Add YouTube membership status to session
        if (typeof token.youTubeMember !== 'undefined') {
          session.user.youTubeMember = token.youTubeMember as boolean;
        }
        // Add subscription info to session
        if (token.subscription) {
          session.user.subscription = token.subscription as any;
        }
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default handler; 