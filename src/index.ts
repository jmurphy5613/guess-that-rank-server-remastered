import Hapi from '@hapi/hapi';

import prismaPlugin from './plugins/prisma';

// Create a Hapi server instance
const server = Hapi.server({
  port: 3001, // Specify the port to listen on
  host: 'localhost', // Specify the host address to bind to
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
    console.log('Server running on %s', server.info.uri);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start(); // Call the start function to start the server