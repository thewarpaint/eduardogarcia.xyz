// TODO: Don't pollute the global namespace!
const videoUrlInputId = 'video-url';

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

function isYoutubeUrl(url) {
  return getYoutubeVideoId(url) !== null;
}

function getYoutubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

function getTiktokVideoId(videoUrl) {
  const fullTiktokUrlRegex = /https?\:\/\/(?:www\.)?tiktok\.com\/@[0-9A-Za-z_-]+\/video\/([0-9]+).*/i;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  // If `.match` returns a 2-length array, the 1-th element will have the video id
  videoIdMatches = videoUrl.match(fullTiktokUrlRegex);

  if (videoIdMatches !== null && videoIdMatches.length === 2) {
    return videoIdMatches[1];
  }

  return null;
}

function isTiktokUrl(url) {
  return getTiktokVideoId(url) !== null;
}

function getTiktokEmbedUrl(videoId) {
  return `https://www.tiktok.com/embed/v2/${videoId}?lang=en-US`;
}

function getInstagramVideoId(videoUrl) {
  const fullInstagramUrlRegex = /https?\:\/\/(?:www\.)?instagram\.com\/reel\/([0-9A-Za-z_-]+).*/i;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  // If `.match` returns a 2-length array, the 1-th element will have the video id
  videoIdMatches = videoUrl.match(fullInstagramUrlRegex);

  if (videoIdMatches !== null && videoIdMatches.length === 2) {
    return videoIdMatches[1];
  }

  return null;
}

function isInstagramUrl(url) {
  return getInstagramVideoId(url) !== null;
}

function getInstagramEmbedUrl(videoId) {
  return `https://www.instagram.com/reel/${videoId}/embed/`;
}

function getTwitterVideoId(videoUrl) {
  const fullTwitterUrlRegex = /https?\:\/\/(?:www\.)?(?:x|twitter)\.com\/(?:[0-9A-Za-z_@]+)\/status\/([0-9]+).*/i;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  // If `.match` returns a 2-length array, the 1-th element will have the video id
  videoIdMatches = videoUrl.match(fullTwitterUrlRegex);

  if (videoIdMatches !== null && videoIdMatches.length === 2) {
    return videoIdMatches[1];
  }

  return null;
}

function isTwitterUrl(url) {
  return getTwitterVideoId(url) !== null;
}

function getTwitterEmbedUrl(videoId) {
  return `https://platform.twitter.com/embed/Tweet.html?hideThread=true&lang=en&theme=dark&id=${videoId}`;
}

function updateIframeUrl(url) {
  const iframeId = 'iframe';
  document.getElementById(iframeId).src = url;
}

function updateBodyClasses(isCinema) {
  document.body.classList.remove('body--is-cinema', 'body--is-not-cinema');
  document.body.classList.add(isCinema ? 'body--is-cinema' : 'body--is-not-cinema');
}

function isItCinema(videoId) {
  const videoIdHash = md5(videoId);

  console.log(videoIdHash);

  if (!videoIdHash || videoIdHash.length !== 32) {
    // Weird hashes are not cinema!
    return false;
  }

  const lastCharFromHash = videoIdHash[31];
  const cinemaEndings = ['c', '1', /* n */ 'e', /* m */ 'a'];

  return cinemaEndings.includes(lastCharFromHash);
}

function onSubmit(e) {
  // TODO: Update URL using `window.history` API, always prevent form submission
  const $videoUrlInput = document.getElementById(videoUrlInputId);
  const videoUrl = $videoUrlInput.value;

  if (isYoutubeUrl(videoUrl) || isTiktokUrl(videoUrl) || isInstagramUrl(videoUrl) || isTwitterUrl(videoUrl)) {
    return true;
  }

  e.preventDefault();
  return false;
}

function main() {
  const videoUrl = getVideoUrlFromQueryString();

  if (videoUrl === null) {
    return;
  }

  const youtubeId = getYoutubeVideoId(videoUrl);

  // TODO: Refactor duplicate behaviour
  if (youtubeId !== null) {
    const youtubeEmbedUrl = getYoutubeEmbedUrl(youtubeId);
    updateIframeUrl(youtubeEmbedUrl);

    const isCinema = isItCinema(youtubeId);
    updateBodyClasses(isCinema);

    return;
  }

  const tiktokId = getTiktokVideoId(videoUrl);

  if (tiktokId !== null) {
    const tiktokEmbedUrl = getTiktokEmbedUrl(tiktokId);
    updateIframeUrl(tiktokEmbedUrl);

    const isCinema = isItCinema(tiktokId);
    updateBodyClasses(isCinema);

    return;
  }

  const instagramId = getInstagramVideoId(videoUrl);

  if (instagramId !== null) {
    const instagramEmbedUrl = getInstagramEmbedUrl(instagramId);
    updateIframeUrl(instagramEmbedUrl);

    const isCinema = isItCinema(instagramId);
    updateBodyClasses(isCinema);

    return;
  }

  const twitterId = getTwitterVideoId(videoUrl);

  if (twitterId !== null) {
    const twitterEmbedUrl = getTwitterEmbedUrl(twitterId);
    updateIframeUrl(twitterEmbedUrl);

    const isCinema = isItCinema(twitterId);
    updateBodyClasses(isCinema);

    return;
  }

  // TODO: Display warning message
  console.warn('URL not recognized!');
}

document.addEventListener('DOMContentLoaded', () => {
  main();
});

/* Inline libraries */

// https://stackoverflow.com/a/60467595
// Original copyright (c) Paul Johnston & Greg Holt.
function md5(inputString) {
  var hc="0123456789abcdef";
  function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
  function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
  function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
  function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
  function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
  function sb(x) {
      var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
      for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
      blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
  }
  var i,x=sb(""+inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
  for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
      a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
      b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
      c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
      d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
      a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
      b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
      c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
      d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
      a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
      b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
      c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
      d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
      a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
      b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
      c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
      d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
      a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
      b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
      c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
      d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
      a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
      b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
  }
  return rh(a)+rh(b)+rh(c)+rh(d);
}
