import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Initialize Prisma client
const prisma = new PrismaClient();

type ForgotPasswordResponse = {
  success: boolean;
  message?: string;
  debug?: any; // For development only - remove in production
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ForgotPasswordResponse>
) {
  console.log('Forgot password API called with method:', req.method);
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;
  console.log('Email provided:', email);

  // Validate input
  if (!email) {
    console.log('Email is required but was not provided');
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Log email configuration for debugging (mask password)
    console.log('Email configuration:', {
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '******' : 'not set',
      EMAIL_SERVICE: process.env.EMAIL_SERVICE,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'not set'
    });

    // Find user by email
    console.log('Looking for user with email:', email);
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    console.log('User found:', !!user);
    if (user) {
      console.log('User auth provider:', user.authProvider);
    }

    // For security reasons, don't reveal if the user exists or not
    // Always return success=true, even if the user doesn't exist
    if (!user || user.authProvider === 'GOOGLE') {
      // Don't send email for non-existent users or Google auth users
      console.log('Password reset requested for non-existent user or Google user:', email);
      
      // For debugging only, log a message
      if (!user) {
        console.log('DEBUG: User not found in database');
      } else {
        console.log('DEBUG: User uses Google authentication, not sending reset');
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate a password reset token
    console.log('Generating reset token for user:', user.id);
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key-for-development-only',
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Generate the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    console.log('Reset URL generated:', resetUrl);

    // Create email transporter
    console.log('Creating email transporter...');
    let transporter;
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    if (emailService === 'smtp') {
      // SMTP configuration
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Service-based configuration (gmail, sendgrid, etc.)
      transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    // Verify transporter connection
    console.log('Verifying email transporter connection...');
    try {
      await transporter.verify();
      console.log('Transporter verification successful');
    } catch (verifyError: any) {
      console.error('Transporter verification failed:', verifyError.message);
      throw new Error(`Email configuration error: ${verifyError.message}`);
    }

    // Send the password reset email
    const mailOptions = {
      from: `Trading Academy <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Trading Academy Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #CB9006;">Reset Your Password</h2>
          <p>You requested a password reset for your Trading Academy account.</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #CB9006; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
        </div>
      `,
    };

    try {
      console.log('Attempting to send password reset email to:', user.email);
      const info = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', info.messageId);
    } catch (error: any) {
      console.error('Error sending email:', error);
      
      // For development - log the reset link to console as fallback
      console.log('\n');
      console.log('=======================================================================');
      console.log('                     PASSWORD RESET LINK                              ');
      console.log('=======================================================================');
      console.log(`For user: ${user.email}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('=======================================================================');
      console.log('\n');
      
      // Return detailed error in development
      return res.status(500).json({
        success: false,
        message: 'Failed to send email. Check your email configuration.',
        debug: {
          error: error.message || 'Unknown error',
          resetUrl,
          emailConfig: {
            service: emailService,
            user: process.env.EMAIL_USER,
            // Don't include password
          }
        }
      });
    }

    console.log('Returning success response');
    return res.status(200).json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred. Please try again.',
      debug: { error: error.message } 
    });
  }
} 