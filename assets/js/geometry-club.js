var video = document.querySelector('video');
var canvas = window.canvas = document.getElementById('canvas');
var mediaStreamTrack;
var photoSettings;

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
  mediaStreamTrack = stream.getVideoTracks()[0];
  Camera.imageCapture = new ImageCapture(mediaStreamTrack);
  Camera.imageCaptureMode = typeof Camera.imageCapture.getPhotoCapabilities === 'function';

  if (Camera.imageCaptureMode) {
    Logger.log('Mode: image capture');

    Camera.imageCapture.getPhotoCapabilities()
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

function init() {
  App.init();
  Logger.init();
  MainActions.init();
  Preview.init();
  Thumbnails.init();

  if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
      Camera.initDevices(deviceInfos);
    });
  } else {
    Logger.log('navigator.mediaDevices not supported by the browser');
  }
}

var App = (function () {
  function App() {
    this.$startApp = null;
    this.$addToHomeScreen = null;
    this.$captureArea = null;
    this.$introArea = null;
    this.$selectionArea = null;
    this.deferredPrompt = null;
  }

  App.prototype.init = function () {
    this.$startApp = document.getElementById('start-app');
    this.$addToHomeScreen = document.getElementById('add-to-home-screen');
    this.$captureArea = document.getElementById('capture-area');
    this.$introArea = document.getElementById('intro-area');
    this.$selectionArea = document.getElementById('selection-area');

    this.$startApp.onclick = this.start.bind(this);
    this.$addToHomeScreen.addEventListener('click', this.onAddToHomeScreenClick.bind(this));

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
    };

    this.initServiceWorker();
    this.addInstallPromptListener();
  };

  App.prototype.showOnlyCaptureArea = function () {
    this.showCaptureArea();
    this.hideIntroArea();
    this.hideSelectionArea();
  };

  App.prototype.showOnlySelectionArea = function () {
    this.showSelectionArea();
    this.hideIntroArea();
    this.hideCaptureArea();
  };

  App.prototype.showCaptureArea = function () {
    this.$captureArea.classList.remove('hide');
  };

  App.prototype.hideCaptureArea = function () {
    this.$captureArea.classList.add('hide');
  };

  App.prototype.showIntroArea = function () {
    this.$introArea.classList.remove('hide');
  };

  App.prototype.hideIntroArea = function () {
    this.$introArea.classList.add('hide');
  };

  App.prototype.showSelectionArea = function () {
    this.$selectionArea.classList.remove('hide');
  };

  App.prototype.hideSelectionArea = function () {
    this.$selectionArea.classList.add('hide');
  };

  App.prototype.start = function () {
    this.showOnlyCaptureArea();
    this.goFullscreen();
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

  App.prototype.initServiceWorker = function () {
    if (!'serviceWorker' in navigator) {
      Logger.log('Service Workers not supported');
      return;
    }

    navigator.serviceWorker.register('/geometry-club-service-worker.js', { scope: '/' })
      .then(function (registration) {
        Logger.log('Service Worker registration succeeded, scope is ' + registration.scope);
      }).catch(function (error) {
        Logger.log('Service Worker registration failed with ' + error);
      });
  };

  App.prototype.addInstallPromptListener = function () {
    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      this.deferredPrompt = event;
      this.$addToHomeScreen.classList.remove('hide');
    }.bind(this));
  };

  App.prototype.onAddToHomeScreenClick = function (event) {
    this.$addToHomeScreen.classList.add('hide');
    this.deferredPrompt.prompt();

    this.deferredPrompt.userChoice
      .then(function (choiceResult) {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the add to home screen prompt');
        } else {
          console.log('User dismissed the add to home screen prompt');
        }

        this.deferredPrompt = null;
      }.bind(this));
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

var BlobHelper = (function () {
  function BlobHelper() {
  }

  BlobHelper.prototype.createURL = function (blob) {
    var blobUrl = URL.createObjectURL(blob);

    Logger.log('Creating URL: ' + blobUrl);

    return blobUrl;
  };

  BlobHelper.prototype.revokeURL = function (url) {
    if (url.indexOf('blob:') !== -1) {
      URL.revokeObjectURL(url);
      Logger.log('Revoking URL: ' + url);
    }
  };

  return new BlobHelper();
})();

var MainActions = (function () {
  function MainActions() {
    this.$switchCameraButton = null;
    this.$toggleCameraButton = null;
    this.$captureSnapshotButton = null;
  }

  MainActions.prototype.init = function () {
    this.$switchCameraButton = document.getElementById('switch-camera-button');
    this.$toggleCameraButton = document.getElementById('toggle-camera-button');
    this.$captureSnapshotButton = document.getElementById('capture-snapshot-button');

    this.$toggleCameraButton.onclick = function () {
      Stream.toggle();
    };

    this.$switchCameraButton.onclick = function () {
      Camera.switch();
    };

    this.$captureSnapshotButton.onclick = function () {
      Camera.captureSnapshot();
    };
  };

  MainActions.prototype.toggleCaptureSnapshotButton = function (enabled) {
    this.$captureSnapshotButton.disabled = !enabled;
  };

  return new MainActions();
})();

var Camera = (function () {
  function Camera() {
    this._videoIndex = 0;
    this._videoDevices = [];
    this.imageCapture = null;
    this.imageCaptureMode = false;
  }

  Camera.prototype.initDevices = function (deviceInfos) {
    this._videoDevices = deviceInfos.filter(function (deviceInfo) {
      return deviceInfo.kind === 'videoinput';
    });

    var backCameraIndex = this._videoDevices.findIndex(function (deviceInfo) {
      return deviceInfo.label.indexOf('back') !== -1;
    });

    if (backCameraIndex !== -1) {
      this._videoIndex = backCameraIndex;
    }

    Stream.start();
  };

  Camera.prototype.switch = function () {
    this._videoIndex = (this._videoIndex + 1) % this._videoDevices.length;
    Stream.restart();
  };

  Camera.prototype.getActiveVideoDevice = function () {
    return this._videoDevices[this._videoIndex];
  };

  Camera.prototype.captureSnapshot = function () {
    if (this.imageCaptureMode) {
      MainActions.toggleCaptureSnapshotButton(false);

      this.imageCapture.takePhoto(photoSettings)
        .then(function (blob) {
          var imageBlobUrl = BlobHelper.createURL(blob);

          Thumbnails.addThumbnail(imageBlobUrl);
          Preview.setActiveImage(imageBlobUrl);
          App.showOnlySelectionArea();
          Stream.stop();

          Logger.log('Photo captured successfully, size: ' + blob.size);
        })
        .catch(function (error) {
          console.error('takePhoto() error:', error)
        })
        .finally(function () {
          MainActions.toggleCaptureSnapshotButton(true);
        });
    } else {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      window.open(canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'), 'image');
    }
  };

  return new Camera();
})();

var Stream = (function () {
  function Stream() {
    this._isStreamActive = false;
  }

  Stream.prototype.isActive = function () {
    return this._isStreamActive;
  };

  Stream.prototype.start = function () {
    var videoDevice = Camera.getActiveVideoDevice();
    var constraints = {
      audio: false,
      video: {
        deviceId: {
          exact: videoDevice.deviceId
        }
      }
    };

    Logger.log('Switching to device: ' + videoDevice.label);

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

  Stream.prototype.toggle = function () {
    if (Stream.isActive()) {
      Stream.stop();
    } else {
      Stream.start();
    }
  };

  return new Stream();
})();

var Preview = (function () {
  function Preview() {
    this.activeImage = null;
    this.$previewImage = null;
    this.$removeImage = null;
    this.$downloadImage = null;
    this.$returnCaptureArea = null;
  }

  Preview.prototype.init = function () {
    this.$previewImage = document.getElementById('preview-image');
    this.$removeImage = document.getElementById('remove-image');
    this.$downloadImage = document.getElementById('download-image');
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
    this.$downloadImage.href = url;
    Thumbnails.setSelectedItem(url);
  };

  Preview.prototype.removeActiveImage = function () {
    Logger.log('Removing active image ' + this.activeImage);
    Thumbnails.remove(this.activeImage);
    BlobHelper.revokeURL(this.activeImage);
  };

  Preview.prototype.returnToCaptureArea = function () {
    App.showOnlyCaptureArea();
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
