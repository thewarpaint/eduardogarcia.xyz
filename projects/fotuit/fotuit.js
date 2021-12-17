import fetch from 'node-fetch';

const {
  TWITTER_BEARER_TOKEN,
} = process.env;

const tweetId = '818249023727484929';
const url = `https://api.twitter.com/1.1/statuses/show.json?` +
  `id=${tweetId}&` +
  `tweet_mode=extended`;

(async () => {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
    }
  });

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
  } = await response.json();
  const payload = {
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

  console.log(payload);
})();
