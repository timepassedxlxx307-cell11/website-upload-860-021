(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    var stage = document.querySelector("[data-hero-stage]");
    if (stage) {
      stage.addEventListener("mouseenter", stop);
      stage.addEventListener("mouseleave", start);
    }

    show(0);
    start();
  }

  function setupHomeSearch() {
    var form = document.querySelector("[data-home-search-form]");
    var input = document.querySelector("[data-home-search-input]");
    if (!form || !input) {
      return;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = input.value.trim();
      var target = "./search.html";
      if (value) {
        target += "?q=" + encodeURIComponent(value);
      }
      window.location.href = target;
    });
  }

  function setupFilters() {
    var grid = document.querySelector("[data-filter-grid]");
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-filter-card]"));
    var input = document.querySelector("[data-search-input]");
    var region = document.querySelector("[data-region-filter]");
    var type = document.querySelector("[data-type-filter]");
    var year = document.querySelector("[data-year-filter]");
    var result = document.querySelector("[data-result-count]");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query && input) {
      input.value = query;
    }

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : "";
    }

    function apply() {
      var q = valueOf(input);
      var selectedRegion = valueOf(region);
      var selectedType = valueOf(type);
      var selectedYear = valueOf(year);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-category") || ""
        ].join(" ").toLowerCase();
        var ok = true;
        if (q && haystack.indexOf(q) === -1) {
          ok = false;
        }
        if (selectedRegion && valueOf({ value: card.getAttribute("data-region") || "" }) !== selectedRegion) {
          ok = false;
        }
        if (selectedType && valueOf({ value: card.getAttribute("data-type") || "" }) !== selectedType) {
          ok = false;
        }
        if (selectedYear && valueOf({ value: card.getAttribute("data-year") || "" }) !== selectedYear) {
          ok = false;
        }
        card.classList.toggle("hidden-card", !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (result) {
        result.textContent = "已匹配 " + visible + " 部作品";
      }
    }

    [input, region, type, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", apply);
        element.addEventListener("change", apply);
      }
    });

    apply();
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = document.getElementById("movie-video");
    var overlay = document.getElementById("player-overlay");
    var playButton = document.getElementById("detail-play-btn");
    if (!video || !streamUrl) {
      return;
    }

    var ready = false;
    var hls = null;

    function attach() {
      if (ready) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      ready = true;
    }

    function start() {
      attach();
      video.controls = true;
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }
    if (playButton) {
      playButton.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (!ready || video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  onReady(function () {
    setupNavigation();
    setupHero();
    setupHomeSearch();
    setupFilters();
  });
})();
