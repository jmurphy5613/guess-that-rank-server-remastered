import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to seed the dummy data into the database
const seedData = async () => {
  try {
    await prisma.clip.deleteMany()
    await prisma.user.deleteMany()
    await prisma.guess.deleteMany()
  } catch (err) {
    console.error('Failed to seed dummy data:', err);
  } finally {
    await prisma.$disconnect();
  }
};

// Call the seedData function to seed the dummy data
seedData();
