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
  } catch (err) {
    return h.response(err).code(500);
  }
};

// Handler function for creating a new user
const createUserHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  try {
    const { nickname, username } = request.payload as User
    const newUser = await prisma.user.create({
      data: { nickname, username },
    });
    return newUser;
  } catch (err) {
    return h.response(err).code(500);
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
  } catch (err) {
    return h.response(err).code(500);
  }
};


export default usersPlugin;
