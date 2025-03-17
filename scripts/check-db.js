const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database data...');
  
  // Get all users with their subscriptions
  const users = await prisma.user.findMany({
    include: {
      subscription: true,
    },
  });
  
  console.log('\n=== USERS ===');
  console.log(`Total users: ${users.length}`);
  
  users.forEach((user, index) => {
    console.log(`\nUser ${index + 1}:`);
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name || 'Not set'}`);
    console.log(`Auth Provider: ${user.authProvider}`);
    console.log(`Created At: ${user.createdAt}`);
    
    if (user.subscription) {
      console.log(`\nSubscription:`);
      console.log(`Status: ${user.subscription.status}`);
      console.log(`Start Date: ${user.subscription.currentPeriodStart}`);
      console.log(`End Date: ${user.subscription.currentPeriodEnd || 'Not set'}`);
    } else {
      console.log('\nNo subscription found');
    }
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 