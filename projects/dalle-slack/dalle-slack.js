import {Dalle} from 'dalle-node';

const {
  DALLE2_BEARER_TOKEN,
} = process.env;

const dalle = new Dalle(DALLE2_BEARER_TOKEN);

/*
  * Returns:
  * {
  *   object: 'list',
  *   data: [
  *     {
  *       id: 'generation-abcxyz',
  *       object: 'generation',
  *       created: 1234567890,
  *       generation_type: 'ImageGeneration',
  *       generation: {
  *         image_path: 'https://openailabsprodscus.blob.core.windows.net/...',
  *       },
  *       task_id: 'task-987123',
  *       prompt_id: 'prompt-a1b2c3',
  *       is_public: false
  *     },
  *     ...
  *   ]
  * }
  */
async function generateImagesFromPrompt(prompt) {
  return dalle.generate(prompt);
}

export {
  generateImagesFromPrompt,
};
