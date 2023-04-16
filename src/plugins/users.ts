import Hapi from '@hapi/hapi';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const usersPlugin: Hapi.Plugin<null> = {
    name: 'Users',
    register: async (server: Hapi.Server) => {
      // Route for fetching all users
      server.route({
        method: 'GET',
        path: '/users',
        handler: getAllUsersHandler,
      });
  
      // Route for creating a new user
      server.route({
        method: 'POST',
        path: '/users',
        handler: createUserHandler,
      });
  
      // Route for fetching a user by ID
      server.route({
        method: 'GET',
        path: '/users/{userId}',
        handler: getUserByIdHandler,
      });
    },
  };

// Handler function for fetching all users
const getAllUsersHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    return h.response({ error: "Failed to get all users" }).code(500);
  }
};

// Handler function for creating a new user
const createUserHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  try {
    const { username, email } = request.payload as User;

    // Check if user with the same username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      return h
        .response({ error: "Username already exists" })
        .code(400);
    }

    // Create new user
    const newUser = await prisma.user.create({ data: { username, email } });

    return h.response(newUser).code(201);
  } catch (error) {
    console.error("Error creating user:", error);
    return h.response({ error: "Failed to create user" }).code(500);
  }
};

// Handler function for fetching a user by ID
const getUserByIdHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  try {
    const userId = request.params.userId;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    return user;
  } catch (error) {
    console.error("Error getting user by id:", error);
    return h.response({ error: "Failed to get user by id" }).code(500);
  }
};


export default usersPlugin;
