document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  initHero();
  initFilters();
  initSearch();
  initPlayers();
});

function initHero() {
  var hero = document.querySelector('[data-hero]');

  if (!hero) {
    return;
  }

  var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
  var prev = hero.querySelector('[data-hero-prev]');
  var next = hero.querySelector('[data-hero-next]');
  var index = 0;
  var timer = null;

  function show(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === index);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === index);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
    }
  }

  if (prev) {
    prev.addEventListener('click', function () {
      show(index - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      show(index + 1);
      start();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      show(Number(dot.getAttribute('data-hero-dot')) || 0);
      start();
    });
  });

  start();
}

function initFilters() {
  var input = document.querySelector('[data-filter-input]');
  var region = document.querySelector('[data-filter-region]');
  var year = document.querySelector('[data-filter-year]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
  var empty = document.querySelector('[data-empty-tip]');

  if (!cards.length) {
    return;
  }

  function apply() {
    var q = input ? input.value.trim().toLowerCase() : '';
    var r = region ? region.value : '';
    var y = year ? year.value : '';
    var shown = 0;

    cards.forEach(function (card) {
      var text = card.getAttribute('data-search') || '';
      var cardRegion = card.getAttribute('data-region') || '';
      var cardYear = card.getAttribute('data-year') || '';
      var ok = true;

      if (q && text.indexOf(q) === -1) {
        ok = false;
      }

      if (r && cardRegion !== r) {
        ok = false;
      }

      if (y && cardYear !== y) {
        ok = false;
      }

      card.style.display = ok ? '' : 'none';

      if (ok) {
        shown += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('show', shown === 0);
    }
  }

  [input, region, year].forEach(function (item) {
    if (item) {
      item.addEventListener('input', apply);
      item.addEventListener('change', apply);
    }
  });
}

function initSearch() {
  var input = document.getElementById('searchInput');
  var region = document.getElementById('searchRegion');
  var type = document.getElementById('searchType');
  var results = document.getElementById('searchResults');
  var data = window.SITE_MOVIES || [];

  if (!input || !results || !data.length) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char];
    });
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    var r = region ? region.value : '';
    var t = type ? type.value : '';
    var matched = data.filter(function (item) {
      var text = item.search || '';

      if (q && text.indexOf(q) === -1) {
        return false;
      }

      if (r && item.regionGroup !== r) {
        return false;
      }

      if (t && String(item.type).indexOf(t) === -1 && String(item.genre).indexOf(t) === -1) {
        return false;
      }

      return true;
    }).slice(0, 120);

    if (!matched.length) {
      results.innerHTML = '<p class="empty-tip show">没有匹配的影片</p>';
      return;
    }

    results.innerHTML = matched.map(function (item) {
      return '<article class="movie-card">' +
        '<a class="poster-link" href="' + escapeHtml(item.url) + '">' +
          '<span class="poster-frame">' +
            '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
            '<span class="play-chip">▶</span>' +
          '</span>' +
        '</a>' +
        '<div class="card-content">' +
          '<div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.duration) + '</span></div>' +
          '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
          '<p>' + escapeHtml(item.oneLine) + '</p>' +
          '<div class="score-row"><span>★ ' + escapeHtml(item.rating) + '</span><span>' + escapeHtml(item.views) + ' 次</span></div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  [input, region, type].forEach(function (item) {
    if (item) {
      item.addEventListener('input', render);
      item.addEventListener('change', render);
    }
  });

  render();
}

function initPlayers() {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (box) {
    var video = box.querySelector('video');
    var trigger = box.querySelector('[data-play-trigger]');

    if (!video) {
      return;
    }

    var stream = video.getAttribute('data-stream');

    if (!stream) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      box._hls = hls;
    } else {
      video.src = stream;
    }

    function playVideo() {
      if (trigger) {
        trigger.classList.add('is-hidden');
      }

      var played = video.play();

      if (played && typeof played.catch === 'function') {
        played.catch(function () {
          if (trigger) {
            trigger.classList.remove('is-hidden');
          }
        });
      }
    }

    if (trigger) {
      trigger.addEventListener('click', playVideo);
    }

    video.addEventListener('play', function () {
      if (trigger) {
        trigger.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0 && trigger) {
        trigger.classList.remove('is-hidden');
      }
    });
  });
}
