(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });

        show(0);
        start();
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
        var cards = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-title]"));
        var keyword = document.querySelector("[data-filter-keyword]");
        var year = document.querySelector("[data-filter-year]");
        var region = document.querySelector("[data-filter-region]");
        var genre = document.querySelector("[data-filter-genre]");
        var empty = document.querySelector("[data-empty-state]");

        function valueOf(input) {
            return input ? String(input.value || "").trim().toLowerCase() : "";
        }

        function applyFilter() {
            var key = valueOf(keyword);
            var selectedYear = valueOf(year);
            var selectedRegion = valueOf(region);
            var selectedGenre = valueOf(genre);
            var visible = 0;

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-category")
                ].join(" ").toLowerCase();

                var ok = true;
                if (key && text.indexOf(key) === -1) {
                    ok = false;
                }
                if (selectedYear && String(card.getAttribute("data-year")).toLowerCase() !== selectedYear) {
                    ok = false;
                }
                if (selectedRegion && String(card.getAttribute("data-region")).toLowerCase().indexOf(selectedRegion) === -1) {
                    ok = false;
                }
                if (selectedGenre && String(card.getAttribute("data-genre")).toLowerCase().indexOf(selectedGenre) === -1 && String(card.getAttribute("data-tags")).toLowerCase().indexOf(selectedGenre) === -1) {
                    ok = false;
                }

                card.classList.toggle("is-hidden-by-filter", !ok);
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [keyword, year, region, genre].forEach(function (input) {
            if (input) {
                input.addEventListener("input", applyFilter);
                input.addEventListener("change", applyFilter);
            }
        });

        applyFilter();
    }
})();
