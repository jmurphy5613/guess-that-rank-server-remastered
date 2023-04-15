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


export default clipsPlugin;