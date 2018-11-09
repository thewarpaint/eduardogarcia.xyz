var videoDevices = [];
var video = document.querySelector('video');
var switchCameraButton = document.getElementById('switch-camera-button');
var toggleCameraButton = document.getElementById('toggle-camera-button');
var captureSnapshotButton = document.getElementById('capture-snapshot-button');
var canvas = window.canvas = document.getElementById('canvas');
var $capturedImageWrapper = document.getElementById('captured-image-wrapper');
var videoIndex = 0;
var mediaStreamTrack;
var imageCapture;
var imageCaptureMode = false;
var photoSettings;
var isStreamActive = false;

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
  mediaStreamTrack = stream.getVideoTracks()[0];
  imageCapture = new ImageCapture(mediaStreamTrack);
  imageCaptureMode = typeof imageCapture.getPhotoCapabilities === 'function';

  if (imageCaptureMode) {
    Logger.log('Mode: image capture');

    imageCapture.getPhotoCapabilities()
      .then(function (photoCapabilities) {
        photoSettings = {
          imageWidth: photoCapabilities.imageWidth.max,
          imageHeight: photoCapabilities.imageHeight.max,
        };

        Logger.log('Photo quality: ' + photoCapabilities.imageWidth.max + 'px × ' +
          photoCapabilities.imageHeight.max + 'px');
      });

    canvas.classList.add('hide');
    Preview.show();
  } else {
    Logger.log('Mode: canvas fallback');

    canvas.classList.remove('hide');
    Preview.hide();

    canvas.width = 480;
    canvas.height = 360;
  }
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function restartStream() {
  stopStream();
  startStream();
}

function stopStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  isStreamActive = false;
}

function startStream() {
  var constraints = {
    audio: false,
    video: {
      deviceId: {
        exact: videoDevices[videoIndex].deviceId
      }
    }
  };

  Logger.log('Switching to device: ' + videoDevices[videoIndex].label);
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

  isStreamActive = true;
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

function init() {
  toggleCameraButton.onclick = function () {
    if (isStreamActive) {
      stopStream();
    } else {
      startStream();
    }
  }

  switchCameraButton.onclick = function () {
    videoIndex = (videoIndex + 1) % videoDevices.length;
    restartStream();
  };

  captureSnapshotButton.onclick = function () {
    if (imageCaptureMode) {
      toggleCaptureSnapshotButton(false);

      imageCapture.takePhoto(photoSettings)
        .then(function (blob) {
          var imageBlobUrl = URL.createObjectURL(blob);

          Thumbnails.addThumbnail(imageBlobUrl);
          Preview.setActiveImage(imageBlobUrl);

          $capturedImageWrapper.classList.remove('hide');
          location.href = '#captured-image';
          stopStream();

          Logger.log('Photo captured successfully, size: ' + blob.size);
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

  Logger.init();
  Preview.init();
  Thumbnails.init();
}

var Logger = (function () {
  function Logger() {
    this.$log = null;
  }

  Logger.prototype.init = function() {
    this.$log = document.getElementById('logger');
  };

  Logger.prototype.log = function(string) {
    console.log(string);
    logger.innerHTML += '\n⇒ ' + string;
  };

  return new Logger();
})();

function toggleCaptureSnapshotButton(enabled) {
  captureSnapshotButton.disabled = !enabled;
  captureSnapshotButton.classList.toggle('action-capture-snapshot--enabled', enabled);
  captureSnapshotButton.classList.toggle('action-capture-snapshot--disabled', !enabled);
}

function revokeBlobURL(url) {
  if (url.indexOf('blob') !== -1) {
    URL.revokeObjectURL(url);
    Logger.log('Revoking URL: ' + url);
  }
}

var Preview = (function () {
  function Preview() {
    this.activeImage = null;
    this.$previewImage = null;
    this.$removeImage = null;
  }

  Preview.prototype.init = function () {
    this.$previewImage = document.getElementById('preview-image');
    this.$removeImage = document.getElementById('remove-image');

    this.$removeImage.onclick = this.removeActiveImage.bind(this);
  };

  Preview.prototype.show = function () {
    this.$previewImage.classList.remove('hide');
  };

  Preview.prototype.hide = function () {
    this.$previewImage.classList.add('hide');
  };

  Preview.prototype.setPreviewImage = function (url) {
    this.$previewImage.src = url;
  };

  Preview.prototype.setActiveImage = function (url) {
    this.activeImage = url;
    this.setPreviewImage(url);
    Thumbnails.setSelectedItem(url);
  };

  Preview.prototype.removeActiveImage = function () {
    Logger.log('[wip] Trying to remove active image ' + this.activeImage);
    revokeBlobURL(this.activeImage);
  };

  return new Preview();
})();

var Thumbnails = (function () {
  function Thumbnails() {
    this.$thumbnailList = null;
  }

  Thumbnails.prototype.init = function () {
    this.$thumbnailList = document.getElementById('thumbnail-list');
  };

  Thumbnails.prototype.setSelectedItem = function (url) {
    var $thumbnail = document.getElementById('thumbnail-' + url);

    if (!$thumbnail) {
      Logger.log('Element #thumbnail-' + url + ' doesn\'t exist.');
      return;
    }

    this.clearSelectedItem();
    $thumbnail.classList.add('thumbnail-item--selected');
  };

  Thumbnails.prototype.clearSelectedItem = function () {
    var oldThumbnail = document.querySelector('.thumbnail-item--selected');

    if (oldThumbnail) {
      oldThumbnail.classList.remove('thumbnail-item--selected');
    }
  };

  Thumbnails.prototype.addThumbnail = function (url) {
    this.clearSelectedItem();

    this.$thumbnailList.innerHTML +=
      '<li class="thumbnail-item thumbnail-item--selected" ' +
          'id="thumbnail-' + url + '" ' +
          'onclick="Preview.setActiveImage(\'' + url + '\')" ' +
          'style="background-image: url(\'' + url + '\');">' +
      '</li>';
  };

  return new Thumbnails();
})();

init();
