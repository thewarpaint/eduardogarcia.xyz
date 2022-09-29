# How?

```sh
$ export DALLE2_BEARER_TOKEN="..."
```

```
$ curl https://dalle-slack.glitch.me/v1/images \
    -X POST \
    -H "Content-Type: application/json" \
    -d @- << EOF
{
  "prompt": "An aurora Borealis, at this time of year, at this time of day, in this part of the country, localized entirely within a kitchen, in Simpsons style"
}
EOF
```