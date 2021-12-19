import fetch from 'node-fetch';

const {
  TWITTER_BEARER_TOKEN,
} = process.env;

// TODO: Get from command line args
const tweetId = '818249023727484929';

async function main() {
  const payload = await getPayloadFromTweetId(tweetId);

  console.log(payload);
}

async function getPayloadFromTweetId(tweetId) {
  const url = buildTwitterApiUrl(tweetId);

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
    }
  });

  const responseJson = await response.json();

  return buildPayloadFromTwitterResponse(responseJson);
}

// TODO: Add unit tests
function buildTwitterApiUrl(tweetId) {
  return `https://api.twitter.com/1.1/statuses/show.json?` +
    `id=${tweetId}&` +
    `tweet_mode=extended`;
}

// TODO: Add unit tests
function buildPayloadFromTwitterResponse(twitterResponse) {
  const {
    id,
    created_at: createdAt,
    full_text: text,
    user: {
      name,
      screen_name: username,
      profile_image_url_https: profileImageUrl,
      verified: isVerified,
    },
    retweet_count: retweets,
    favorite_count: likes,
    source,
  } = twitterResponse;

  return {
    id,
    createdAt,
    text,
    name,
    username,
    profileImageUrl,
    isVerified,
    retweets,
    likes,
    source,
  };
}

(async () => {
  await main();
})();
