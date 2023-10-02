function getVideoUrlFromQueryString() {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get('video');
}

function getYoutubeVideoId(videoUrl) {
  const fullYoutubeUrlRegex = /https?\:\/\/(?:www\.)?youtube\.com\/watch\?v=([0-9A-Za-z_-]+).*/i;
  const shortYoutubeUrlRegex = /https?\:\/\/(?:www\.)?youtu\.be\/([0-9A-Za-z_-]+).*/i;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  // If `.match` returns a 2-length array, the 1-th element will have the video id
  let videoIdMatches = videoUrl.match(shortYoutubeUrlRegex);

  if (videoIdMatches !== null && videoIdMatches.length === 2) {
    return videoIdMatches[1];
  }

  videoIdMatches = videoUrl.match(fullYoutubeUrlRegex);

  if (videoIdMatches !== null && videoIdMatches.length === 2) {
    return videoIdMatches[1];
  }

  return null;
}

function getYoutubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

function updateIframeUrl(url) {
  const iframeId = 'iframe';
  document.getElementById(iframeId).src = url;
}

function main() {
  const videoUrl = getVideoUrlFromQueryString();

  if (videoUrl === null) {
    return;
  }

  const youtubeId = getYoutubeVideoId(videoUrl);

  if (youtubeId === null) {
    return;
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(youtubeId);
  updateIframeUrl(youtubeEmbedUrl);
}

document.addEventListener('DOMContentLoaded', () => {
  main();
});