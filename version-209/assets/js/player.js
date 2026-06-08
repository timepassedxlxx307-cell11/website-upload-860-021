(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (box) {
      var video = box.querySelector('video');
      var button = box.querySelector('.player-start');
      var playUrl = box.getAttribute('data-play');
      var hls = null;
      var attached = false;

      function attachVideo() {
        if (!video || !playUrl || attached) {
          return;
        }

        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = playUrl;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(playUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          });
          return;
        }

        video.src = playUrl;
      }

      function beginPlay() {
        attachVideo();
        box.classList.add('is-playing');
        video.controls = true;
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            box.classList.remove('is-playing');
          });
        }
      }

      if (button) {
        button.addEventListener('click', beginPlay);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (!box.classList.contains('is-playing')) {
            beginPlay();
            return;
          }

          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });

        video.addEventListener('play', function () {
          box.classList.add('is-playing');
        });
      }
    });
  });
}());
