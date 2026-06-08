(() => {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const expanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', String(!expanded));
            mobileMenu.hidden = expanded;
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const previous = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');
    let currentSlide = 0;
    let slideTimer = null;

    const showSlide = (target) => {
        if (!slides.length) {
            return;
        }

        currentSlide = (target + slides.length) % slides.length;
        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === currentSlide);
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === currentSlide);
        });
    };

    const startHero = () => {
        if (slideTimer) {
            window.clearInterval(slideTimer);
        }
        slideTimer = window.setInterval(() => showSlide(currentSlide + 1), 5200);
    };

    if (slides.length) {
        previous?.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            startHero();
        });
        next?.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            startHero();
        });
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startHero();
            });
        });
        startHero();
    }

    const filterInputs = Array.from(document.querySelectorAll('[data-page-filter]'));
    const filterScope = document.querySelector('[data-filter-scope]');

    if (filterInputs.length && filterScope) {
        const cards = Array.from(filterScope.querySelectorAll('.movie-card'));
        const runFilter = () => {
            const keyword = document.querySelector('[data-page-filter="keyword"]')?.value.trim().toLowerCase() || '';
            const region = document.querySelector('[data-page-filter="region"]')?.value || '';
            const type = document.querySelector('[data-page-filter="type"]')?.value || '';

            cards.forEach((card) => {
                const text = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(' ').toLowerCase();
                const okKeyword = !keyword || text.includes(keyword);
                const okRegion = !region || card.dataset.region === region;
                const okType = !type || card.dataset.type === type;
                card.classList.toggle('is-filtered-out', !(okKeyword && okRegion && okType));
            });
        };

        filterInputs.forEach((input) => {
            input.addEventListener('input', runFilter);
            input.addEventListener('change', runFilter);
        });
    }

    const searchResults = document.querySelector('[data-search-results]');
    const searchStatus = document.querySelector('[data-search-status]');
    const searchForm = document.querySelector('[data-search-form]');

    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();

    if (searchForm && query) {
        const input = searchForm.querySelector('input[name="q"]');
        if (input) {
            input.value = query;
        }
    }

    if (searchResults && Array.isArray(window.SEARCH_MOVIES) && query) {
        const normalized = query.toLowerCase();
        const matches = window.SEARCH_MOVIES.filter((movie) => {
            const text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();
            return text.includes(normalized);
        }).slice(0, 120);

        if (searchStatus) {
            searchStatus.textContent = matches.length ? `为你找到 ${matches.length} 条相关影片` : '没有找到相关影片';
        }

        searchResults.innerHTML = matches.map((movie) => `
            <article class="movie-card" data-title="${escapeHtml(movie.title)}">
                <a class="movie-poster" href="./${movie.url}" aria-label="观看${escapeHtml(movie.title)}">
                    <img src="${movie.cover}" alt="${escapeHtml(movie.title)}" loading="lazy">
                    <span class="movie-play">▶</span>
                    <span class="movie-badge">${escapeHtml(movie.year)}</span>
                </a>
                <div class="movie-card-body">
                    <h3><a href="./${movie.url}">${escapeHtml(movie.title)}</a></h3>
                    <p>${escapeHtml(movie.oneLine)}</p>
                    <div class="movie-meta">
                        <span>${escapeHtml(movie.region)}</span>
                        <span>${escapeHtml(movie.type)}</span>
                    </div>
                    <div class="tag-row">${movie.tags.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
                </div>
            </article>
        `).join('');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
