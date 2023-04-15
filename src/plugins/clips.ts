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

        // Route for fetching clips that user has guessed
        server.route({
            method: 'GET',
            path: '/clips/guessed/{userId}',
            handler: getClipsGuessedHandler,
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
    } catch (error) {
        console.error("Error getting clip by Id:", error);
        return h.response({ error: "Failed to get clip by id" }).code(500);
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
    } catch (error) {
        console.error("Error creating clip:", error);
        return h.response({ error: "Failed to create clip" }).code(500);
    }
};

// Handler function for fetching all clips
const getAllClipsHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const clips = await prisma.clip.findMany();
        return clips;
    } catch (error) {
        console.error("Error getting all clips", error);
        return h.response({ error: "Failed to get all clips" }).code(500);
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
    } catch (error) {
        console.error("Error getting clips not guessed:", error);
        return h.response({ error: "Failed to get clips not guessed" }).code(500);
    }
};

export const getClipsGuessedHandler = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) => {
    try {
        const { userId } = request.params; // Get userId from URL parameter

        // Fetch all clips that have been guessed by the specified userId
        const guessedClips = await prisma.clip.findMany({
            where: {
                guesses: {
                    some: {
                        userId: parseInt(userId), // Filter based on userId
                    },
                },
            },
            include: {
                guesses: true, // Include the guesses relationship
            },
        });

        return guessedClips; // Return the fetched clips with related guesses
    } catch (error) {
        console.error("Error getting guessed clips:", error);
        return h.response({ error: "Failed to get guessed clips" }).code(500);
    }
};



export default clipsPlugin;