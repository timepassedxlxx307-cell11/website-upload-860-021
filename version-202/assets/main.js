(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function bindNav() {
        var toggle = document.querySelector(".nav-toggle");
        var nav = document.querySelector(".main-nav");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function bindHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        function show(next) {
            index = next;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show((index + 1) % slides.length);
        }, 5200);
    }

    function bindSearchForms() {
        Array.prototype.slice.call(document.querySelectorAll(".search-form")).forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";
                var prefix = form.getAttribute("data-prefix") || "";
                var target = prefix + "search.html";
                if (value) {
                    target += "?q=" + encodeURIComponent(value);
                }
                window.location.href = target;
            });
        });
    }

    function card(movie) {
        var tags = movie.genre.split(/[，,、/]/).filter(Boolean).slice(0, 2).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return "<article class=\"movie-card\">" +
            "<a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">" +
            "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
            "<span class=\"play-mark\">▶</span>" +
            "</a>" +
            "<div class=\"movie-card-body\">" +
            "<div class=\"movie-tags\">" + tags + "</div>" +
            "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>" +
            "<p>" + escapeHtml(movie.line) + "</p>" +
            "<div class=\"movie-meta\"><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span></div>" +
            "</div>" +
            "</article>";
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>\"]/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
            }[char];
        });
    }

    function renderSearch() {
        var root = document.querySelector("[data-search-root]");
        if (!root || !window.siteMovies) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var input = document.querySelector("#searchQuery");
        var type = document.querySelector("#typeFilter");
        var year = document.querySelector("#yearFilter");
        if (input && params.get("q")) {
            input.value = params.get("q");
        }
        function filter() {
            var q = input ? input.value.trim().toLowerCase() : "";
            var t = type ? type.value : "";
            var y = year ? year.value : "";
            var results = window.siteMovies.filter(function (movie) {
                var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.line].join(" ").toLowerCase();
                return (!q || haystack.indexOf(q) !== -1) && (!t || movie.type === t) && (!y || movie.year === y);
            }).slice(0, 96);
            if (!results.length) {
                root.innerHTML = "<div class=\"empty-state\">没有找到匹配的影片，换个关键词试试。</div>";
                return;
            }
            root.innerHTML = results.map(card).join("");
        }
        [input, type, year].forEach(function (element) {
            if (element) {
                element.addEventListener("input", filter);
                element.addEventListener("change", filter);
            }
        });
        var form = document.querySelector("#searchPageForm");
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                filter();
            });
        }
        filter();
    }

    ready(function () {
        bindNav();
        bindHero();
        bindSearchForms();
        renderSearch();
    });
}());
