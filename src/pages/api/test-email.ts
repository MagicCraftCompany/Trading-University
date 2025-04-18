import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Log environment variables (but mask the password for security)
    const emailConfig = {
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '******' : 'not set',
      EMAIL_SERVICE: process.env.EMAIL_SERVICE,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    };
    
    console.log('Email configuration:', emailConfig);
    
    // Try to create a transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Try to verify the connection
    try {
      const verifyResult = await transporter.verify();
      console.log('Transporter verification:', verifyResult);
    } catch (verifyError: any) {
      console.error('Transporter verification failed:', verifyError.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Email configuration is invalid',
        error: verifyError.message
      });
    }
    
    // If no email is provided in the request, just return the config status
    if (!req.query.email) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email configuration loaded successfully',
        config: emailConfig
      });
    }
    
    // If an email is provided, attempt to send a test email
    const testEmail = req.query.email as string;
    
    const mailOptions = {
      from: `Testing <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: 'Email Config Test from Trading University',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #CB9006;">Email Configuration Test</h2>
          <p>This is a test email to verify that your email configuration is working correctly.</p>
          <p>If you're receiving this, it means your email sending is properly configured.</p>
          <p>Application URL: ${process.env.NEXT_PUBLIC_BASE_URL}</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `,
    };

    console.log('Attempting to send test email to:', testEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Test email sent successfully',
      info: {
        messageId: info.messageId,
        response: info.response
      }
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send test email',
      error: error.message
    });
  }
} 