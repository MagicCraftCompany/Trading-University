const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.error('Usage: node scripts/update-subscription.js user@example.com');
  process.exit(1);
}

async function main() {
  console.log(`Updating subscription for user: ${email}`);
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: { subscription: true },
  });
  
  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }
  
  // Calculate end date (1 month from now)
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  
  // Update or create subscription
  if (user.subscription) {
    // Update existing subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
      },
    });
    
    console.log('Subscription updated successfully:');
    console.log(`Status: ${updatedSubscription.status}`);
    console.log(`Start Date: ${updatedSubscription.currentPeriodStart}`);
    console.log(`End Date: ${updatedSubscription.currentPeriodEnd}`);
  } else {
    // Create new subscription
    const newSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        status: 'ACTIVE',
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
      },
    });
    
    console.log('Subscription created successfully:');
    console.log(`Status: ${newSubscription.status}`);
    console.log(`Start Date: ${newSubscription.currentPeriodStart}`);
    console.log(`End Date: ${newSubscription.currentPeriodEnd}`);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 