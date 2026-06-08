(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('active', idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('active', idx === current);
      });
    }

    function startHero() {
      if (timer || slides.length < 2) {
        return;
      }

      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (slides.length) {
      showSlide(0);
      startHero();

      if (prev) {
        prev.addEventListener('click', function () {
          stopHero();
          showSlide(current - 1);
          startHero();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          stopHero();
          showSlide(current + 1);
          startHero();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          stopHero();
          showSlide(Number(dot.getAttribute('data-target') || 0));
          startHero();
        });
      });
    }

    Array.prototype.slice.call(document.querySelectorAll('.search-widget')).forEach(function (widget) {
      var input = widget.querySelector('.search-input');
      var results = widget.querySelector('.search-results');
      var data = window.SEARCH_MOVIES || [];

      if (!input || !results) {
        return;
      }

      input.addEventListener('input', function () {
        var term = normalize(input.value);
        results.innerHTML = '';

        if (term.length < 1) {
          results.classList.remove('is-open');
          return;
        }

        var matches = data.filter(function (item) {
          return normalize(item.title + ' ' + item.region + ' ' + item.type + ' ' + item.year + ' ' + item.genre).indexOf(term) !== -1;
        }).slice(0, 10);

        if (!matches.length) {
          var empty = document.createElement('span');
          empty.textContent = '暂无匹配影片';
          results.appendChild(empty);
          results.classList.add('is-open');
          return;
        }

        matches.forEach(function (item) {
          var link = document.createElement('a');
          var isDetail = window.location.pathname.indexOf('/movies/') !== -1;
          link.href = isDetail ? '../movies/' + item.file : './movies/' + item.file;
          link.textContent = item.title;

          var meta = document.createElement('small');
          meta.textContent = item.year + ' · ' + item.region + ' · ' + item.genre;
          link.appendChild(meta);
          results.appendChild(link);
        });

        results.classList.add('is-open');
      });

      document.addEventListener('click', function (event) {
        if (!widget.contains(event.target)) {
          results.classList.remove('is-open');
        }
      });
    });

    var grid = document.querySelector('.filterable-grid');
    var filterInput = document.querySelector('.filter-input');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var emptyState = document.querySelector('.empty-state');
    var activeFilter = '全部';

    function applyFilter() {
      if (!grid) {
        return;
      }

      var term = normalize(filterInput ? filterInput.value : '');
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' '));
        var filterOk = activeFilter === '全部' || haystack.indexOf(normalize(activeFilter)) !== -1;
        var termOk = !term || haystack.indexOf(term) !== -1;
        var shouldShow = filterOk && termOk;
        card.classList.toggle('is-hidden', !shouldShow);
        if (shouldShow) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    if (filterInput) {
      filterInput.addEventListener('input', applyFilter);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter') || '全部';
        filterButtons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilter();
      });
    });
  });
}());
