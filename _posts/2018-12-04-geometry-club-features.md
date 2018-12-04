# Geometry Club features

## Features

- Photo captures via [ImageCapture API](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture)
- Offline support via [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) and
  [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) APIs
- Photo processing in separate thread using [Web Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- Add to home screen behaviour, theme colour via [Web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- Download of blob URLs via [`download` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Attributes)
- Fullscreen support via [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
  (if PWA is not installed)
- Progressive enhancement (where?) and graceful degradation (where?)

### Roadmap

- Complete `canvas` fallback
- Save photos in `LocalStorage` to persist them across uses
- Share photos via [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
  [(waiting for image or blob support)](https://github.com/WICG/web-share/issues/12)
