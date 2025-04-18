
  const apiKey = "acd658a6376438e3aa6631ccb18c6227";
  const serieContainer = document.getElementById("serie-container");
  const searchInput = document.getElementById("search-input");
  const suggestions = document.getElementById("suggestions");
  const favoritesBtn = document.getElementById("favorites-btn");
  const mobileFavoritesBtn = document.getElementById("mobile-favorites-btn");
  const allSeriesBtn = document.getElementById("all-series-btn");
  const heroSection = document.getElementById("hero-section");
  const heroTitle = document.getElementById("hero-title");
  const heroOverview = document.getElementById("hero-overview");
  const carouselTitle = document.getElementById("carousel-title");
  const placeholderImage = "https://via.placeholder.com/300x450?text=Pas+d'image";
  let allSeries = [];
  let isDragging = false;
  let startX, scrollLeft;

  // Scroll carousel
  function scrollCarousel(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8 * direction;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  // Drag to scroll
  function setupDragScroll(container) {
    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.setPointerCapture(e.pointerId);
    });

    container.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('pointerup', () => {
      isDragging = false;
      container.releasePointerCapture();
    });

    container.addEventListener('pointerleave', () => {
      isDragging = false;
    });
  }

  // Render series
  function renderSeries(series, isFavorites = false) {
    serieContainer.innerHTML = "";
    series.forEach((serie) => {
      const serieDiv = document.createElement("div");
      serieDiv.classList.add("serie");
      serieDiv.style.opacity = "0";
      serieDiv.style.transition = "opacity 0.3s ease";

      const imageUrl = serie.poster_path
        ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
        : placeholderImage;

      const favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];
      const coeurIcon = document.createElement("span");
      coeurIcon.classList.add("coeur-icon");
      coeurIcon.innerHTML = favoris.includes(serie.id) ? "❤️" : "🤍";
      coeurIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        let favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];
        if (favoris.includes(serie.id)) {
          favoris = favoris.filter((id) => id !== serie.id);
          coeurIcon.innerHTML = "🤍";
        } else {
          favoris.push(serie.id);
          coeurIcon.innerHTML = "❤️";
        }
        localStorage.setItem("series_favoris", JSON.stringify(favoris));
        if (isFavorites) {
          renderSeries(allSeries.filter(s => favoris.includes(s.id)), true);
        }
      });

      serieDiv.innerHTML = `
        <img src="${imageUrl}" alt="${serie.name || 'Série'}" class="w-full rounded-t-lg" loading="lazy" onerror="this.src='${placeholderImage}'">
        <div class="serie-overlay">
          <h3 class="text-lg font-semibold truncate">${serie.name || 'Titre inconnu'}</h3>
          <p class="text-sm">Note : ${Math.round(serie.vote_average || 0)} / 10</p>
        </div>
      `;

      serieDiv.appendChild(coeurIcon);
      serieContainer.appendChild(serieDiv);

      // Fade-in animation
      setTimeout(() => {
        serieDiv.style.opacity = "1";
      }, 10);
    });

    setupDragScroll(serieContainer);
  }

  // Fetch and display series
  const fetchSeries = async () => {
    try {
      const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr-FR&page=1`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

      const data = await response.json();
      allSeries = data.results;

      // Update hero section
      const featured = allSeries[Math.floor(Math.random() * allSeries.length)];
      heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280${featured.backdrop_path || featured.poster_path || placeholderImage})`;
      heroTitle.textContent = featured.name || "Série en vedette";
      heroOverview.textContent = featured.overview || "Découvrez cette série captivante.";

      renderSeries(allSeries);
    } catch (error) {
      console.error("Erreur lors du chargement des séries :", error);
      serieContainer.innerHTML = "<p class='text-red-500 p-4'>Impossible de charger les séries.</p>";
    }
  };

  fetchSeries();

  // Favorites filter
  function showFavorites() {
    const favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];
    const favoriteSeries = allSeries.filter(serie => favoris.includes(serie.id));
    carouselTitle.textContent = "Mes Favoris";
    allSeriesBtn.classList.remove("hidden");
    renderSeries(favoriteSeries, true);
  }

  favoritesBtn.addEventListener("click", showFavorites);
  mobileFavoritesBtn.addEventListener("click", () => {
    showFavorites();
    document.getElementById("mobile-menu").classList.add("hidden");
  });

  // Show all series
  allSeriesBtn.addEventListener("click", () => {
    carouselTitle.textContent = "Séries Populaires";
    allSeriesBtn.classList.add("hidden");
    renderSeries(allSeries);
  });

  // Search functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    suggestions.classList.toggle("hidden", query.length < 2);
    suggestions.innerHTML = "";

    if (query.length >= 2) {
      const matchedSeries = allSeries.filter((serie) =>
        serie.name.toLowerCase().includes(query)
      );

      if (matchedSeries.length === 0) {
        suggestions.innerHTML = "<div class='suggestion-item'>Aucune série trouvée</div>";
        renderSeries(allSeries);
        return;
      }

      matchedSeries.forEach((serie) => {
        const div = document.createElement("div");
        div.textContent = serie.name;
        div.classList.add("suggestion-item");
        div.addEventListener("click", () => {
          suggestions.classList.add("hidden");
          searchInput.value = serie.name;
          renderSeries([serie]);
        });
        suggestions.appendChild(div);
      });

      renderSeries(matchedSeries);
    } else {
      renderSeries(allSeries);
    }
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Lazy load images
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('img');
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 200px 0px' });

  serieContainer.addEventListener('DOMNodeInserted', () => {
    serieContainer.querySelectorAll('.serie').forEach(serie => observer.observe(serie));
  });
