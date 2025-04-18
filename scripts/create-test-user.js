// Script to create a test user for debugging
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (existingUser) {
      console.log('Test user already exists with ID:', existingUser.id)
      return
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('password123', salt)

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        authProvider: 'GOOGLE', // Or use 'EMAIL' if available in your schema
      }
    })

    console.log('Test user created successfully:')
    console.log('User ID:', user.id)
    console.log('Email: test@example.com')
    console.log('Password: password123')
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 