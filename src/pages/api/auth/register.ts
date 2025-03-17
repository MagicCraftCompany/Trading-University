import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define a type that includes the password field
interface UserWithPassword {
  id: string;
  email: string;
  password: string;
  name: string | null;
  image: string | null;
  [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with type assertion to bypass TypeScript checks
    const user = await (prisma.user as any).create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        authProvider: 'EMAIL',
        subscription: {
          create: {
            status: 'FREE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: null
          }
        }
      },
      include: { subscription: true },
    }) as UserWithPassword;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        subscriptionStatus: 'FREE',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response using type assertion
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
} 