var videoDevices = [];
var video = document.querySelector('video');
var toggleCameraButton = document.querySelector('#toggle-camera-button');
var captureSnapshotButton = document.querySelector('#capture-snapshot-button');
var canvas = window.canvas = document.querySelector('canvas');
var img = document.querySelector('img');
var logger = document.querySelector('pre');
var videoIndex = 0;
var mediaStreamTrack;
var imageCapture;
var photoSettings;

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;

  mediaStreamTrack = stream.getVideoTracks().find(function (videoTrack) {
    return videoTrack.label.indexOf('back') !== -1;
  }) || stream.getVideoTracks()[0];

  imageCapture = new ImageCapture(mediaStreamTrack);

  imageCapture.getPhotoCapabilities().then(function (photoCapabilities) {
    photoSettings = {
      imageWidth: photoCapabilities.imageWidth.max,
      imageHeight: photoCapabilities.imageHeight.max
    };

    log('Photo quality: ' + photoCapabilities.imageWidth.max + 'px × ' +
      photoCapabilities.imageHeight.max + 'px');
  });

  if (imageCapture) {
    canvas.classList.add('hide');
    img.classList.remove('hide');
  } else {
    canvas.classList.remove('hide');
    img.classList.add('hide');

    canvas.width = 480;
    canvas.height = 360;
  }
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function startStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  var constraints = {
    audio: false,
    video: {
      deviceId: {
        exact: videoDevices[videoIndex].deviceId
      }
    }
  };

  log('Switching to device: ' + videoDevices[videoIndex].label);
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
}

navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
  videoDevices = deviceInfos.filter(function (deviceInfo) {
    return deviceInfo.kind === 'videoinput';
  });

  startStream();
});

toggleCameraButton.onclick = function () {
  videoIndex = (videoIndex + 1) % videoDevices.length;
  startStream();
};

captureSnapshotButton.onclick = function () {
  if (imageCapture) {
    toggleCaptureSnapshotButton(false);
    revokePhotoURL();

    imageCapture.takePhoto(photoSettings)
      .then(function (blob) {
        img.src = URL.createObjectURL(blob);

        log('Photo captured successfully, size: ' + blob.size);
      })
      .catch(function (error) {
        console.error('takePhoto() error:', error)
      })
      .finally(function () {
        toggleCaptureSnapshotButton(true);
      });
  } else {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').
      drawImage(video, 0, 0, canvas.width, canvas.height);

    window.open(canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'), 'image');
  }
};

function log(string) {
  console.log(string);
  logger.innerHTML += '\n⇒ ' + string;
}

function toggleCaptureSnapshotButton(enabled) {
  captureSnapshotButton.disabled = !enabled;
  captureSnapshotButton.classList.toggle('action-capture-snapshot--enabled', enabled);
  captureSnapshotButton.classList.toggle('action-capture-snapshot--disabled', !enabled);
}

function revokePhotoURL() {
  if (img.src.indexOf('blob') !== -1) {
    URL.revokeObjectURL(img.src);
    log('Revoking URL: ' + img.src);
  }
}
