import Hapi from '@hapi/hapi';

import prismaPlugin from './plugins/prisma';
import guessesPlugin from './plugins/guesses';
import clipsPlugin from './plugins/clips';
import usersPlugin from './plugins/users';

// Create a Hapi server instance
const server = Hapi.server({
  port: 3002, // Specify the port to listen on
  host: 'localhost', // Specify the host address to bind to
  "routes": {
    "cors": {
      "origin": ["*"],
    }
  }
});



// Define a route
server.route({
  method: 'GET', // Specify the HTTP method for the route
  path: '/', // Specify the route path
  handler: (request, h) => {
    return 'Hello, world!'; // Return a response for the route
  },
});

// Start the server
const start = async () => {
  try {
    await server.start(); // Start the server
    await server.register([prismaPlugin, guessesPlugin, clipsPlugin, usersPlugin]);
    console.log('Server running on %s', server.info.uri);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start(); // Call the start function to start the server