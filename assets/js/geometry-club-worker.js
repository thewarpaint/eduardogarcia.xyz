onmessage = function (event) {
  console.log('Worker: generating object URL for blob...');
  var objectUrl = URL.createObjectURL(event.data.blob);

  console.log('Worker: posting object URL back', objectUrl);
  postMessage({ objectUrl: objectUrl });
};
