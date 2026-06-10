import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { Server } from 'socketio';
import { fileURLToPath } from 'url';
import path from 'path';
import { Socket } from 'dgram';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8001;
const fastify_server = Fastify({logger: true});

fastify_server.register(fastifyStatic, {root: __dirname});
fastify_server.get('/', (request, reply) => {
    reply.sendFile('index.html');
});

fastify_server.listen({port: PORT, host: '0.0.0.0'}, () => {
    console.log(`Server run: http://localhost:${PORT}`);
});

const io = new Server(fastify_server.server);
const sessions = new Map();

class PlayerData{
    constructor(playerId, playerName, selectModel){
        this.playerId = playerId;
        this.playerName = playerName;
        this.currentModel = selectModel;
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
    }
}

io.on('connection', (socket) => {
    io.on('join', (sessionId, playerName) => {
        if (!sessions.has(sessionId)) {
            sessions.set(sessionId, new Map());
        }
        else{
            const session = new Map();
            sessions.get(sessionId);
            const playerData = new PlayerData(socket.id, sessions.size, 0);
            session.set(sessionId, playerData);
            socket.broadcast.emit('playerJoin', playerData);
        }
        
    });
});