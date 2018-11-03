var videoDevices = [];
var video = document.querySelector('video');
var switchCameraButton = document.getElementById('switch-camera-button');
var toggleCameraButton = document.getElementById('toggle-camera-button');
var captureSnapshotButton = document.getElementById('capture-snapshot-button');
var canvas = window.canvas = document.getElementById('canvas');
var $capturedImageWrapper = document.getElementById('captured-image-wrapper');
var capturedImage = document.getElementById('captured-image');
var $thumbnailList = document.getElementById('thumbnail-list');
var logger = document.getElementById('logger');
var videoIndex = 0;
var mediaStreamTrack;
var imageCapture;
var imageCaptureMode = false;
var photoSettings;

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
  mediaStreamTrack = stream.getVideoTracks()[0];
  imageCapture = new ImageCapture(mediaStreamTrack);
  imageCaptureMode = typeof imageCapture.getPhotoCapabilities === 'function';

  if (imageCaptureMode) {
    log('Mode: image capture');

    imageCapture.getPhotoCapabilities()
      .then(function (photoCapabilities) {
        photoSettings = {
          imageWidth: photoCapabilities.imageWidth.max,
          imageHeight: photoCapabilities.imageHeight.max,
        };

        log('Photo quality: ' + photoCapabilities.imageWidth.max + 'px × ' +
          photoCapabilities.imageHeight.max + 'px');
      });

    canvas.classList.add('hide');
    capturedImage.classList.remove('hide');
  } else {
    log('Mode: canvas fallback');

    canvas.classList.remove('hide');
    capturedImage.classList.add('hide');

    canvas.width = 480;
    canvas.height = 360;
  }
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function stopStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }
}

function startStream() {
  stopStream();

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

  var backCameraIndex = videoDevices.findIndex(function (deviceInfo) {
    return deviceInfo.label.indexOf('back') !== -1;
  });

  if (backCameraIndex !== -1) {
    videoIndex = backCameraIndex;
  }

  startStream();
});

toggleCameraButton.onclick = function () {
  stopStream();
}

switchCameraButton.onclick = function () {
  videoIndex = (videoIndex + 1) % videoDevices.length;
  startStream();
};

captureSnapshotButton.onclick = function () {
  if (imageCaptureMode) {
    toggleCaptureSnapshotButton(false);

    imageCapture.takePhoto(photoSettings)
      .then(function (blob) {
        var imageBlobUrl = URL.createObjectURL(blob);
        capturedImage.src = imageBlobUrl;
        addThumbnail(imageBlobUrl);

        $capturedImageWrapper.classList.remove('hide');
        location.href = '#captured-image';

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
    canvas.getContext('2d')
      .drawImage(video, 0, 0, canvas.width, canvas.height);

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
  if (capturedImage.src.indexOf('blob') !== -1) {
    URL.revokeObjectURL(capturedImage.src);
    log('Revoking URL: ' + capturedImage.src);
  }
}

function addThumbnail(url) {
  $thumbnailList.innerHTML +=
    '<li class="thumbnail-item">' +
      '<img class="thumbnail" ' +
        'alt="Captured image thumbnail" ' +
        'src="' + url + '">' +
    '</li>';
}
