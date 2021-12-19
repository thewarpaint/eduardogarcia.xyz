import fetch from 'node-fetch';

const {
  TWITTER_BEARER_TOKEN,
} = process.env;

// TODO: Get from command line args
const tweetId = '1268876804300791810';
const backgroundImageUrl = 'https://pbs.twimg.com/media/EZyws8nUwAEg4VM?format=jpg&name=medium';

// Temporary, while we figure out where to retrieve it from / how to format it
const quoteTweets = 1337;
const date = 'Junio 5, 2020';
const time = '07:06';

async function main() {
  const payload = await getPayloadFromTweetId(tweetId);

  console.log(payload);

  const fotuitUrl = buildFotuitUrl(payload);

  console.log(fotuitUrl);
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

  // RegExp.exec is weird, see the MDN reference below for a primer
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#description
  //
  // HTML cannot be parsed with regular expressions, but the <a> tag that Twitter returns is pretty simple
  // https://blog.codinghorror.com/parsing-html-the-cthulhu-way/
  const [, sourceWithoutHtml] = /<a [^>]+>(.*?)<\/a>/g.exec(source);

  const esMxFormatter = new Intl.NumberFormat('es-MX');
  const formattedRetweets = esMxFormatter.format(retweets);
  const formattedLikes = esMxFormatter.format(likes);
  const formattedQuoteTweets = esMxFormatter.format(quoteTweets);

  return {
    id,
    createdAt,
    text,
    name,
    username,
    profileImageUrl,
    isVerified,
    retweets: formattedRetweets,
    likes: formattedLikes,
    quoteTweets: formattedQuoteTweets,
    source: sourceWithoutHtml,
    date,
    time,
  };
}

function buildFotuitUrl(params) {
  return `https://eduardogarcia.xyz/fotuit?` +
    `name=${encodeURIComponent(params.name)}&` +
    `username=${encodeURIComponent(params.username)}&` +
    `profileImageUrl=${encodeURIComponent(params.profileImageUrl)}&` +
    `isVerified=${params.isVerified.toString()}&` +
    `text=${encodeURIComponent(params.text)}&` +
    `date=${encodeURIComponent(params.date)}&` +
    `time=${encodeURIComponent(params.time)}&` +
    `retweets=${params.retweets}&` +
    `likes=${params.likes}&` +
    `quoteTweets=${params.quoteTweets}&` +
    `source=${encodeURIComponent(params.source)}&` +
    `backgroundImageUrl=${encodeURIComponent(backgroundImageUrl)}&`;
}

(async () => {
  await main();
})();
