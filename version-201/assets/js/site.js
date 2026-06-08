(function() {
  var menuButton = document.querySelector('[data-menu-button]');
  var menu = document.querySelector('[data-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function() {
      menu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function() {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var regionFilter = document.querySelector('[data-filter-region]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var categoryFilter = document.querySelector('[data-filter-category]');
  var emptyState = document.querySelector('[data-empty-state]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-list] .movie-card, [data-movie-list] .ranking-row'));

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get('q') || '';
    if (keyword && searchInput) {
      searchInput.value = keyword;
    }
  }

  function includesText(source, value) {
    return !value || source.indexOf(value) !== -1;
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var typeValue = typeFilter ? typeFilter.value.trim().toLowerCase() : '';
    var regionValue = regionFilter ? regionFilter.value.trim().toLowerCase() : '';
    var yearValue = yearFilter ? yearFilter.value.trim().toLowerCase() : '';
    var categoryValue = categoryFilter ? categoryFilter.value.trim().toLowerCase() : '';
    var visible = 0;

    cards.forEach(function(card) {
      var title = (card.dataset.title || '').toLowerCase();
      var type = (card.dataset.type || '').toLowerCase();
      var region = (card.dataset.region || '').toLowerCase();
      var year = (card.dataset.year || '').toLowerCase();
      var genre = (card.dataset.genre || '').toLowerCase();
      var tags = (card.dataset.tags || '').toLowerCase();
      var haystack = [title, type, region, year, genre, tags, card.textContent.toLowerCase()].join(' ');
      var matched = includesText(haystack, keyword) &&
        includesText(type + ' ' + genre, typeValue) &&
        includesText(region + ' ' + haystack, regionValue) &&
        includesText(year, yearValue) &&
        includesText(haystack, categoryValue);

      card.classList.toggle('hidden-card', !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('visible', visible === 0);
    }
  }

  [searchInput, typeFilter, regionFilter, yearFilter, categoryFilter].forEach(function(element) {
    if (element) {
      element.addEventListener('input', applyFilters);
      element.addEventListener('change', applyFilters);
    }
  });

  readQuery();
  applyFilters();
})();
