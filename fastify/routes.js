import fastifyStatic from '@fastify/static';
import path from 'path';
import {fileURLToPath} from 'url';
import {checkPalindrome} from './utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function router(fastify, opts) {
    fastify.get('/', (request, reply) => {
        reply.sendFile('index.html')
    })

    fastify.post('/api', async (request, reply) => {
        const result = checkPalindrome(request.body.text);
        reply.send({status: result});
    })

    fastify.register(fastifyStatic, { root: __dirname });
}
export default router;



