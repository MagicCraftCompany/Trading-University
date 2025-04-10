// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";

// Debug database connection issues
const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl) {
  console.error('DATABASE_URL environment variable is not set!');
} else {
  console.log('Database URL pattern:', dbUrl.replace(/:([^:@]+)@/, ':****@'));
}

// Connection retry logic
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize with explicit datasources to ensure we're using the right connection string
const prismaOptions: Prisma.PrismaClientOptions = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Log queries in development
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] as Prisma.LogLevel[]
    : ['error'] as Prisma.LogLevel[],
};

// Create a function to connect with retries
const createPrismaClient = async (): Promise<PrismaClient> => {
  let client: PrismaClient | null = null;
  
  // Try to use existing client in global scope first
  if (globalForPrisma.prisma) {
    console.log("Using existing Prisma client from global scope");
    client = globalForPrisma.prisma;
    
    // Test the connection
    try {
      await client.$connect();
      console.log("✅ Successfully connected to database with existing client");
      return client;
    } catch (e) {
      console.warn("❌ Failed to connect with existing client, will create new instance", e);
      // Continue to create a new instance below
    }
  }
  
  // Create new instance with retry logic
  while (retryCount < MAX_RETRIES) {
    try {
      client = new PrismaClient(prismaOptions);
      await client.$connect();
      console.log(`✅ Successfully connected to database (attempt ${retryCount + 1})`);
      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = client;
      }
      return client;
    } catch (e) {
      retryCount++;
      console.error(`❌ Failed to connect to database (attempt ${retryCount}/${MAX_RETRIES}):`, e);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  // If we've reached here, all retries failed
  console.error(`All ${MAX_RETRIES} connection attempts failed. Using offline mode.`);
  
  // Create a mock client that won't throw connection errors
  // This allows the app to at least load without crashing
  const mockClient = {
    $connect: async () => {
      console.log("Mock client connected (offline mode)");
      return Promise.resolve();
    },
    $disconnect: async () => Promise.resolve(),
    // Add other needed methods with appropriate mock behavior
  } as unknown as PrismaClient;
  
  return mockClient;
};

// Initialize the client
let prisma: PrismaClient;

try {
  // Use existing client or create a new one synchronously for module export
  prisma = globalForPrisma.prisma || new PrismaClient(prismaOptions);
  
  // Test connection in the background
  (async () => {
    try {
      await prisma.$connect();
      console.log("✅ Successfully connected to database on initial load");
    } catch (e) {
      console.error("❌ Initial connection failed, will attempt reconnection:", e);
      // Replace the client with one that has retry logic
      prisma = await createPrismaClient();
    }
  })().catch(e => {
    console.error("Unhandled error in background connection check:", e);
  });
} catch (e) {
  console.error("Failed to initialize Prisma client:", e);
  // Create a fallback instance that will show clear errors
  prisma = new PrismaClient(prismaOptions);
}

export default prisma;