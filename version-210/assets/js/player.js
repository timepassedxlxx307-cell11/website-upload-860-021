import { H as Hls } from "./video-player-dru42stk.js";

export function initMoviePlayer(config) {
  const video = document.querySelector("[data-video-player]");
  const overlay = document.querySelector("[data-play-overlay]");

  if (!video || !config || !config.source) {
    return;
  }

  if (config.poster) {
    video.setAttribute("poster", config.poster);
  }

  let ready = false;
  let hls = null;

  const attach = () => {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = config.source;
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(config.source);
      hls.attachMedia(video);
      return;
    }

    video.src = config.source;
  };

  const start = () => {
    attach();

    if (overlay) {
      overlay.classList.add("is-hidden");
    }

    const playResult = video.play();

    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(() => {
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      });
    }
  };

  overlay?.addEventListener("click", start);

  video.addEventListener("click", () => {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener("play", () => {
    overlay?.classList.add("is-hidden");
  });

  window.addEventListener("beforeunload", () => {
    if (hls) {
      hls.destroy();
    }
  });
}
