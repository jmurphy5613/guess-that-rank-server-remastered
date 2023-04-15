// src/plugins/Guesses.ts

import { Guess, PrismaClient } from "@prisma/client";
import { Request, ResponseToolkit } from "@hapi/hapi";

const prisma = new PrismaClient();

// Handler function for registering a guess
// Handler function for registering a guess
export const registerGuessHandler = async (
    request: Request,
    h: ResponseToolkit
  ) => {
    try {
      const { userId, clipId, guessedRank, isCorrect } = request.payload as Guess 
  
      // Create a new guess in the database
      const newGuess = await prisma.guess.create({
        data: {
          user: { connect: { id: userId } }, // Connect the guess to the user by userId
          clip: { connect: { id: clipId } }, // Connect the guess to the clip by clipId
          guessedRank, // Set guessedRank of the guess
          isCorrect, // Set isCorrect of the guess
        },
      });
  
      return newGuess; // Return the newly created guess
    } catch (error) {
      console.error("Error registering guess:", error);
      return h.response({ error: "Failed to register guess" }).code(500);
    }
  };
  

// Handler function for getting all guesses by a specific user
export const getAllGuessesByUserHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { userId } = request.params; // Get userId from URL parameter

    // Fetch all guesses by the specified userId
    const guesses = await prisma.guess.findMany({
      where: {
        userId: parseInt(userId), // Filter based on userId
      },
    });

    return guesses; // Return the fetched guesses
  } catch (error) {
    console.error("Error getting guesses by user:", error);
    return h.response({ error: "Failed to get guesses by user" }).code(500);
  }
};

// Handler function for getting all guesses on a specific clip
export const getAllGuessesOnClipHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { clipId } = request.params; // Get clipId from URL parameter

    // Fetch all guesses on the specified clip
    const guesses = await prisma.guess.findMany({
      where: {
        clipId: parseInt(clipId), // Filter based on clipId
      },
    });

    return guesses; // Return the fetched guesses
  } catch (error) {
    console.error("Error getting guesses on clip:", error);
    return h.response({ error: "Failed to get guesses on clip" }).code(500);
  }
};

// Register the "guesses" plugin
export const register = (server: any) => {
  server.route([
    {
      method: "POST",
      path: "/guesses",
      handler: registerGuessHandler,
    },
    {
      method: "GET",
      path: "/users/{userId}/guesses",
      handler: getAllGuessesByUserHandler,
    },
    {
      method: "GET",
      path: "/clips/{clipId}/guesses",
      handler: getAllGuessesOnClipHandler,
    },
  ]);
};
