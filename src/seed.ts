import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the dummy data for users
const usersData = [
  { nickname: 'User1', username: 'user1' },
  { nickname: 'User2', username: 'user2' },
];

// Define the dummy data for clips
const clipsData = [
  {
    videoSource: 'Video Source 1',
    game: 'Game 1',
    videoURL: 'https://example.com/video1',
    videoName: 'Video 1',
    userRank: 1,
    userId: 1,
  },
  {
    videoSource: 'Video Source 2',
    game: 'Game 2',
    videoURL: 'https://example.com/video2',
    videoName: 'Video 2',
    userRank: 2,
    userId: 1,
  },
  {
    videoSource: 'Video Source 3',
    game: 'Game 3',
    videoURL: 'https://example.com/video3',
    videoName: 'Video 3',
    userRank: 1,
    userId: 2,
  },
];

// Function to seed the dummy data into the database
const seedData = async () => {
  try {
    // Seed users data
    for (const userData of usersData) {
      await prisma.user.create({ data: userData });
    }

    // Seed clips data
    for (const clipData of clipsData) {
      await prisma.clip.create({ data: clipData });
    }

    console.log('Dummy data seeded successfully.');
  } catch (err) {
    console.error('Failed to seed dummy data:', err);
  } finally {
    await prisma.$disconnect();
  }
};

// Call the seedData function to seed the dummy data
seedData();
