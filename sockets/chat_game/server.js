import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 8001;
const fastify_server = fastify({logger: true});

fastify_server.register(fastifyStatic, {root: __dirname});

fastify.get('/', (_, rep) => {
    rep.sendFile('index.html');
});

fastify.listen({port: PORT, host: '0.0.0.0'}, () => {
    console.log(`Server run: http://localhost:${PORT}`);
});