import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/db/prisma'; // Import from centralized location

type RegisterResponse = {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

// Development mode check
const isDevelopment = process.env.NODE_ENV !== 'production';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Log request body for debugging
  console.log('Register API called with:', {
    body: req.body,
    method: req.method,
    url: req.url
  });

  const { email, password, name } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('Missing required fields:', { email: !!email, password: !!password });
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  
  // Check JWT secret is set
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set!');
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  let connectionEstablished = false;
  try {
    // Verify database connection first
    try {
      await prisma.$connect();
      connectionEstablished = true;
      console.log('Database connection established for registration');
    } catch (dbConnError) {
      console.error('Failed to connect to database:', dbConnError);
      
      // In development, we can allow mock registration to proceed
      if (isDevelopment) {
        console.warn('DEVELOPMENT MODE: proceeding with mock registration despite database error');
        
        // Create a mock user for development testing
        const mockUserId = `dev-${Date.now()}`;
        const token = jwt.sign(
          { userId: mockUserId, email, subscriptionStatus: 'ACTIVE' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        return res.status(201).json({
          success: true,
          token,
          user: {
            id: mockUserId,
            email,
            name: name || '',
          },
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection error. Please try again later.'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    console.log('Hashing password...');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    console.log('Creating new user record...');
    // Create new user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || '',
        authProvider: 'GOOGLE', // Default to Google as in your schema, but it's a regular password account
        lastLoginAt: new Date(),
        subscription: {
          create: {
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now (monthly subscription)
          }
        }
      },
    });
    console.log('User created successfully:', user.id);

    // Create JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email, subscriptionStatus: 'ACTIVE' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('JWT token generated');

    // Log success for debugging
    console.log('User registered successfully:', { userId: user.id, email: user.email });

    // Return user info (exclude password)
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
      },
    });
  } catch (error: any) {
    // Detailed error logging
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already in use. Please try a different email.' 
      });
    }
    
    // Handle connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      return res.status(500).json({ 
        success: false, 
        message: 'Cannot connect to the database. Please try again later.' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration. Please try again later.' 
    });
  } finally {
    // Disconnect from Prisma to avoid connection leaks
    if (connectionEstablished) {
      try {
        await prisma.$disconnect();
      } catch (error) {
        console.error('Error disconnecting from database:', error);
      }
    }
  }
} 