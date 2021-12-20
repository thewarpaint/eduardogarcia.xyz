import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import handlebars from 'handlebars';
import path from 'path';
import pointOfView from 'point-of-view';

import {
  buildFotuitUrl,
  getPayloadFromTweetId,
} from './fotuit.js';

import {
  getPageScreenshot,
} from './screenshot.js';

const fastifyServer = fastify({
  logger: false,
});

fastifyServer.post('/v1/fotuit', async function(request, reply) {
  const {
    tweetId,
    backgroundImageUrl,
  } = request.body;

  console.log(`Starting to process a request for tweetId=${tweetId}`);

  const payload = {
    ...await getPayloadFromTweetId(tweetId),
    backgroundImageUrl,
  };

  const fotuitUrl = buildFotuitUrl(payload);

  console.log(`Generating an image for url=${fotuitUrl}`);

  const screenshot = await getPageScreenshot(fotuitUrl);

  reply
    .type('png')
    .send(screenshot);

  console.log(`Request for tweetId=${tweetId} served`);
});

// TODO: bring back after static files are added
// Setup our static files
// fastifyServer.register(fastifyStatic, {
//   root: path.join(__dirname, 'public'),
//   prefix: '/'
// });

// point-of-view is a templating manager for fastify
fastifyServer.register(pointOfView, {
  engine: {
    handlebars,
  }
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastifyServer.get('/', function(request, reply) {
  reply.view('/src/pages/index.hbs', {});
});

// Run the server and report out to the logs
fastifyServer.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastifyServer.log.info(`server listening on ${address}`);
});
