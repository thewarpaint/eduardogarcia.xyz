import fetch from 'node-fetch';

const {
  TWITTER_BEARER_TOKEN,
} = process.env;

const siteRoot = 'https://fotuit.glitch.me/';

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

  // TODO: Find a better way to get the higher resolution profile image
  const biggerProfileImageUrl = profileImageUrl.replace('_normal.jpg', '_400x400.jpg');

  // TODO: Convert to CDMX time, format properly
  const createdAtDate = new Date(createdAt);
  const createdAtString = createdAtDate.toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
  const date = createdAtString.substring(0, 10); // YYYY-MM-DD
  const time = createdAtString.substring(11, 16); // HH:mm

  return {
    id,
    createdAt,
    text,
    name,
    username,
    profileImageUrl: biggerProfileImageUrl,
    isVerified,
    retweets: formattedRetweets,
    likes: formattedLikes,
    source: sourceWithoutHtml,
    date,
    time,
  };
}

function buildFotuitUrl(params) {
  return `${siteRoot}?` +
    `name=${encodeURIComponent(params.name)}&` +
    `username=${encodeURIComponent(params.username)}&` +
    `profileImageUrl=${encodeURIComponent(params.profileImageUrl)}&` +
    `isVerified=${params.isVerified.toString()}&` +
    `text=${encodeURIComponent(params.text)}&` +
    `date=${encodeURIComponent(params.date)}&` +
    `time=${encodeURIComponent(params.time)}&` +
    `retweets=${params.retweets}&` +
    `likes=${params.likes}&` +
    `source=${encodeURIComponent(params.source)}&` +
    `backgroundImageUrl=${encodeURIComponent(params.backgroundImageUrl)}&`;
}

export {
  buildFotuitUrl,
  getPayloadFromTweetId,
};
