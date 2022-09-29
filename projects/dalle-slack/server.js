import fastify from 'fastify';

import {generateImagesFromPrompt} from './dalle-slack.js';

const fastifyServer = fastify({
  logger: false,
});

fastifyServer.post('/v1/images', async function(request, reply) {
  const {
    prompt,
  } = request.body;

  console.log(`Starting to process a request for prompt=${prompt}`);

  const images = await generateImagesFromPrompt(prompt);

  reply
    .type('application/json')
    .send(images);

  console.log(`Request for prompt=${prompt} served`);
});

// Run the server and report out to the logs
fastifyServer.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  console.log(`Your app is listening on ${address}`);
  fastifyServer.log.info(`Server listening on ${address}`);
});
