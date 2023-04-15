import Hapi from '@hapi/hapi';
import { Clip, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



const clipsPlugin: Hapi.Plugin<null> = {
    name: 'Clips',
    register: async (server: Hapi.Server) => {
        // Route for creating a new clip
        server.route({
            method: 'POST',
            path: '/clips',
            handler: createClipHandler,
        });

        // Route for fetching all clips
        server.route({
            method: 'GET',
            path: '/clips',
            handler: getAllClipsHandler,
        });

        // Route for fetching a clip by ID
        server.route({
            method: 'GET',
            path: '/clips/{clipId}',
            handler: getClipByIdHandler,
        });

        // Route for fetching clips that user has not guessed yet
        server.route({
            method: 'GET',
            path: '/clips/not-guessed/{userId}',
            handler: getClipsNotGuessedHandler,
        });
    },
};

const getClipByIdHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const clipId = request.params.clipId;
        const clip = await prisma.clip.findUnique({
            where: { id: parseInt(clipId) },
        });
        return clip;
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Handler function for creating a new clip
const createClipHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const {
            videoSource,
            game,
            videoURL,
            videoName,
            userId,
            userRank,
        } = request.payload as Clip
        const newClip = await prisma.clip.create({
            data: {
                videoSource,
                game,
                videoURL,
                videoName,
                user: { connect: { id: userId } },
                userRank,
            },
        });
        return newClip;
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Handler function for fetching all clips
const getAllClipsHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const clips = await prisma.clip.findMany();
        return clips;
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Handler for getting clips that user has not guessed yet
const getClipsNotGuessedHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = Number(request.params.userId);
  
      // Retrieve clips that user has guessed
      const clipsGuessed = await prisma.guess.findMany({
        where: {
          userId,
        },
        select: {
          clipId: true,
        },
      });
  
      // Extract clipIds from the clipsGuessed result
      const clipIdsGuessed = clipsGuessed.map((guess) => guess.clipId);
  
      // Retrieve clips that user has not guessed
      const clipsNotGuessed = await prisma.clip.findMany({
        where: {
          NOT: {
            id: {
              in: clipIdsGuessed,
            },
          },
        },
      });
  
      return h.response(clipsNotGuessed).code(200);
    } catch (err) {
      console.error('Failed to get clips not guessed:', err);
      return h.response({ error: 'Failed to get clips not guessed' }).code(500);
    }
  };
  


export default clipsPlugin;