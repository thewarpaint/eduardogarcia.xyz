# How?

```sh
$ export TWITTER_CONSUMER_KEY="..."
$ export TWITTER_CONSUMER_SECRET="..."
$ export TWITTER_ACCESS_TOKEN="..."
$ export TWITTER_ACCESS_TOKEN_SECRET="..."

$ node fotuit.js \
    --tweet-id="1268876804300791810" \
    --background-image="https://pbs.twimg.com/media/EZyws8nUwAEg4VM?format=jpg&name=medium" \
    --size=1200x700

Fetching tweet...
Generating image...

Fotuit saved as claudiashein_1268876804300791810_1200x700.png
```

```sh
$ curl https://fotuit.glitch.me/v1/fotuit \
    -X POST \
    -H "Content-Type: application/json" \
    -d @body.json \
    -o fotuit.png

$ curl https://fotuit.glitch.me/v1/fotuit \
    -X POST \
    -H "Content-Type: application/json" \
    -o fotuit.png \
    -d @- << EOF
{
  "tweetId": "1268876804300791810",
  "backgroundImageUrl": "https://pbs.twimg.com/media/EZyws8nUwAEg4VM?format=jpg&name=medium"
}
EOF
```
