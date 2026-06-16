import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import {Server} from "socket.io";
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8000;

const fastify = Fastify({ logger: false });

fastify.register(fastifyStatic, { root: __dirname });
fastify.get('/', (request, reply) => {
    reply.sendFile('index.html')
})

fastify.listen({ port: PORT, host: '0.0.0.0' }, () => {
    console.log(`SERVER RUN:  http://localhost:${PORT}`);
});

const io = new Server(fastify.server);
const sessions = new Map();

class PlayerData{
    constructor(playerId, playerName, selectModel){
        this.playerId = playerId;
        this.playerName = playerName;
        this.currentModel = selectModel;
        this.position = {x: 0, y: 0, z:0};
        this.rotation = {x: 0, y: 0, z:0};
    }
}

io.on('connection', (socket) => {
    socket.on('join', (sessionId, name, modelIndex) => {
        if(!sessions.has(sessionId)){
            sessions.set(sessionId, new Map());
        }
        const session = sessions.get(sessionId);
        const playerData = new PlayerData(sessionId, name, modelIndex);
        session.set(sessionId, playerData);
        
        const otherPlayers = Array.from(session.values()).filter(player => player.id === sessionId);
        socket.emit('init', otherPlayers);
        socket.broadcast.emit('playerJoined', playerData);
    });
    socket.on('move', (id,position, rotation) => {
        for(const [_, session] of sessions){
            const player = session.has(id);
            if(player){
                player.position = position;
                player.rotation = rotation;
            }
            socket.broadcast.emit('playerMoved', player.position, player.rotation);
        }
        
    });
    socket.on('disconnect', (sessionId) => {
        for(const [sessionId, session] of sessions){
            session.delete(socket.id);
            if(session.size === 0){
                sessions.delete(sessionId);
            }
        }
    });
});