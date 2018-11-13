var videoDevices = [];
var video = document.querySelector('video');
var switchCameraButton = document.getElementById('switch-camera-button');
var toggleCameraButton = document.getElementById('toggle-camera-button');
var captureSnapshotButton = document.getElementById('capture-snapshot-button');
var canvas = window.canvas = document.getElementById('canvas');
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
  } else {
    Logger.log('Mode: canvas fallback');

    canvas.classList.remove('hide');

    canvas.width = 480;
    canvas.height = 360;
  }
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
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

  Stream.start();
});

function init() {
  toggleCameraButton.onclick = function () {
    if (Stream.isActive()) {
      Stream.stop();
    } else {
      Stream.start();
    }
  };

  switchCameraButton.onclick = function () {
    videoIndex = (videoIndex + 1) % videoDevices.length;
    Stream.restart();
  };

  captureSnapshotButton.onclick = function () {
    if (imageCaptureMode) {
      toggleCaptureSnapshotButton(false);

      imageCapture.takePhoto(photoSettings)
        .then(function (blob) {
          var imageBlobUrl = URL.createObjectURL(blob);

          Thumbnails.addThumbnail(imageBlobUrl);
          Preview.setActiveImage(imageBlobUrl);

          App.hideCaptureArea();
          App.showSelectionArea();
          location.href = '#selection-area';
          Stream.stop();

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

  App.init();
  Logger.init();
  Preview.init();
  Thumbnails.init();
}

var App = (function () {
  function App() {
    this.$startApp = null;
    this.$captureArea = null;
    this.$selectionArea = null;
  }

  App.prototype.init = function () {
    this.$startApp = document.getElementById('start-app');
    this.$captureArea = document.getElementById('capture-area');
    this.$selectionArea = document.getElementById('selection-area');
    this.$startApp.onclick = this.goFullscreen.bind(this);

    // Global error handler
    window.onerror = function(message, sourceUrl, lineNumber, columnNumber, error) {
      if (message.toLowerCase().indexOf('script error') !== -1) {
        Logger.log('Script error: see browser console for detail');
      } else {
        Logger.log([
          'An error has occurred',
          'message: ' + message,
          'URL: ' + sourceUrl,
          'line: ' + lineNumber,
          'column: ' + columnNumber,
          'error object: ' + JSON.stringify(error)
        ].join(', '));
      }

      return false;
    }
  };

  App.prototype.showCaptureArea = function () {
    this.$captureArea.classList.remove('hide');
  };

  App.prototype.hideCaptureArea = function () {
    this.$captureArea.classList.add('hide');
  };

  App.prototype.showSelectionArea = function () {
    this.$selectionArea.classList.remove('hide');
  };

  App.prototype.hideSelectionArea = function () {
    this.$selectionArea.classList.add('hide');
  };

  App.prototype.goFullscreen = function () {
    var element = document.body;

    element.requestFullscreen = element.requestFullscreen ||
      element.mozRequestFullscreen ||
      element.msRequestFullscreen ||
      element.webkitRequestFullscreen;

    if (element.requestFullscreen) {
      var promise = element.requestFullscreen();

      // Some browsers don't support the promise (yet?)
      if (promise && promise.then) {
        promise.then(function () {
          Logger.log('Entering fullscreen mode');
        })
        .catch(function (error) {
          Logger.log('Couldn\'t enter fullscreen mode because of ' + error.name + ': ' + error.message);
        });
      }
    } else {
      Logger.log('Fullscreen mode not supported');
    }
  };

  return new App();
})();

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

var Stream = (function () {
  function Stream() {
    this._isStreamActive = false;
  }

  Stream.prototype.isActive = function () {
    return this._isStreamActive;
  };

  Stream.prototype.start = function () {
    var constraints = {
      audio: false,
      video: {
        deviceId: {
          exact: videoDevices[videoIndex].deviceId
        }
      }
    };

    Logger.log('Switching to device: ' + videoDevices[videoIndex].label);
    navigator.mediaDevices.getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);

    this._isStreamActive = true;
  };

  Stream.prototype.stop = function () {
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }

    this._isStreamActive = false;
  }

  Stream.prototype.restart = function () {
    this.stop();
    this.start();
  };

  return new Stream();
})();

var Preview = (function () {
  function Preview() {
    this.activeImage = null;
    this.$previewImage = null;
    this.$removeImage = null;
    this.$returnCaptureArea = null;
  }

  Preview.prototype.init = function () {
    this.$previewImage = document.getElementById('preview-image');
    this.$removeImage = document.getElementById('remove-image');
    this.$returnCaptureArea = document.getElementById('return-capture-area');

    this.$removeImage.onclick = this.removeActiveImage.bind(this);
    this.$returnCaptureArea.onclick = this.returnToCaptureArea.bind(this);
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
    Thumbnails.remove(this.activeImage);
    revokeBlobURL(this.activeImage);
  };

  Preview.prototype.returnToCaptureArea = function () {
    App.hideSelectionArea();
    App.showCaptureArea();
    Stream.start();
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
        'onclick="Preview.setActiveImage(\'' + url + '\')">' +
        '<img class="thumbnail" ' +
          'alt="Captured image thumbnail" ' +
          'src="' + url + '">' +
      '</li>';
  };

  Thumbnails.prototype.remove = function (url) {
    var $thumbnail = document.getElementById('thumbnail-' + url);

    if ($thumbnail) {
      $thumbnail.remove();
    }
  };

  return new Thumbnails();
})();

init();
