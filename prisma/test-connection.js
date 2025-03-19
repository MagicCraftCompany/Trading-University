const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Test connection by counting users
    const userCount = await prisma.user.count();
    console.log('Connection successful!');
    console.log(`Number of users in the database: ${userCount}`);
    
    // Optionally create a test user if none exists
    if (userCount === 0) {
      console.log('Creating a test user...');
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashed_password_would_go_here',
          name: 'Test User',
          subscription: {
            create: {
              status: 'FREE'
            }
          }
        }
      });
      console.log('Test user created:', testUser.id);
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 