(function () {
  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('.menu-toggle');
  if (menuButton && header) {
    menuButton.addEventListener('click', function () {
      header.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;
  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }
  var nextButton = document.querySelector('.hero-next');
  var prevButton = document.querySelector('.hero-prev');
  if (nextButton) {
    nextButton.addEventListener('click', function () {
      showSlide(current + 1);
    });
  }
  if (prevButton) {
    prevButton.addEventListener('click', function () {
      showSlide(current - 1);
    });
  }
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });
  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('.catalog-grid .movie-card'));
  var inputs = Array.prototype.slice.call(document.querySelectorAll('.catalog-search .search-input, .nav-search .search-input'));
  var statusNodes = Array.prototype.slice.call(document.querySelectorAll('.filter-status'));
  function textOf(card) {
    return [
      card.getAttribute('data-title'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-tags'),
      card.getAttribute('data-region'),
      card.getAttribute('data-year')
    ].join(' ').toLowerCase();
  }
  function applyFilter(value) {
    var keyword = String(value || '').trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var visible = !keyword || textOf(card).indexOf(keyword) !== -1;
      card.classList.toggle('is-hidden', !visible);
      if (visible) {
        shown += 1;
      }
    });
    statusNodes.forEach(function (node) {
      node.textContent = keyword ? '已筛选到 ' + shown + ' 部相关影片' : '';
    });
  }
  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      inputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      applyFilter(input.value);
    });
  });
  Array.prototype.slice.call(document.querySelectorAll('.catalog-search, .nav-search')).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('.search-input');
      if (cards.length && input) {
        event.preventDefault();
        applyFilter(input.value);
        var target = document.querySelector('#catalog, #category-list, #ranking-list');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
  Array.prototype.slice.call(document.querySelectorAll('.tag-chip')).forEach(function (button) {
    button.addEventListener('click', function () {
      var tag = button.getAttribute('data-tag') || '';
      inputs.forEach(function (input) {
        input.value = tag;
      });
      applyFilter(tag);
      var target = document.querySelector('#catalog');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  var query = new URLSearchParams(window.location.search).get('q');
  if (query) {
    inputs.forEach(function (input) {
      input.value = query;
    });
    applyFilter(query);
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-cover');
    if (!video || !button) {
      return;
    }
    var source = video.currentSrc || video.getAttribute('src');
    var prepared = false;
    function playVideo() {
      shell.classList.add('is-playing');
      if (prepared) {
        video.play().catch(function () {});
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.getAttribute('src')) {
          video.setAttribute('src', source);
        }
        prepared = true;
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        video.removeAttribute('src');
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          prepared = true;
          video.play().catch(function () {});
        });
        return;
      }
      video.setAttribute('src', source);
      prepared = true;
      video.play().catch(function () {});
    }
    button.addEventListener('click', playVideo);
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
  });

  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('is-visible', window.scrollY > 360);
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
