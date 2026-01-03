document.addEventListener('DOMContentLoaded', function (event) {
  DebugMode.init();
});

// From https://github.com/thewarpaint/caracteres/blob/master/assets/main.js
var DebugMode = (function () {
  function DebugMode() {}

  DebugMode.prototype.init = function () {
    // Primitive query string parameter check, but enough for our needs.
    // TODO: Add localstorage feature detection.
    if (window.location.search.indexOf('debugMode=true') !== -1) {
      localStorage.setItem('debugMode', 'true');
    } else if (window.location.search.indexOf('debugMode=false') !== -1) {
      localStorage.removeItem('debugMode');
    }
  }

  return new DebugMode();
})();
