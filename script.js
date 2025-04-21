
    // API Key for TMDB
    const apiKey = "acd658a6376438e3aa6631ccb18c6227";
    
    // DOM Elements
    const seriesContainer = document.getElementById("series-container");
    const moviesContainer = document.getElementById("movies-container");
    const hero = document.getElementById("hero");
    const heroTitle = document.getElementById("hero-title");
    const heroType = document.getElementById("hero-type");
    const heroYear = document.getElementById("hero-year");
    const heroRating = document.getElementById("hero-rating");
    const heroDescription = document.getElementById("hero-description");
    const categories = document.querySelectorAll(".category");
    const watchBtn = document.getElementById("watch-btn");
    const favoritesLink = document.getElementById("favorites-link");
    const mobileFavorites = document.getElementById("mobile-favorites");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const toast = document.getElementById("toast");
    
    // App Data
    let allSeries = [];
    let allMovies = [];
    let currentCategory = "all";
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
    });
    
    // Show toast notification
    function showToast(message, duration = 3000) {
      toast.textContent = message;
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
      
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
      }, duration);
    }
    
    // Format rating as stars
    function getStarRating(rating) {
      const stars = Math.round(rating) / 2; // Convert to 5-star scale
      return "★".repeat(Math.floor(stars)) + "☆".repeat(5 - Math.floor(stars));
    }
    
    // Create content card
    function createCard(item, type) {
      const card = document.createElement("div");
      card.classList.add("card");
      
      const imageUrl = item.poster_path
        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
        : "https://via.placeholder.com/300x450?text=Pas+d'image";
      
      // Check if in favorites
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isFavorite = favorites.some(fav => fav.id === item.id && fav.type === type);
      
      card.innerHTML = `
        <img src="${imageUrl}" alt="${item.title || item.name}">
        <div class="favorite">${isFavorite ? "❤️" : "🤍"}</div>
        <div class="card-info">
          <h3 class="card-title">${item.title || item.name}</h3>
          <div class="card-meta">
            <span>${type === "movie" ? new Date(item.release_date).getFullYear() : new Date(item.first_air_date).getFullYear()}</span>
            <span class="rating">${getStarRating(item.vote_average)}</span>
          </div>
        </div>
      `;
      
      // Toggle favorite
      const favoriteBtn = card.querySelector(".favorite");
      favoriteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(item, type, favoriteBtn);
      });
      
      // Show in hero when clicked
      card.addEventListener("click", () => {
        displayInHero(item, type);
      });
      
      return card;
    }
    
    // Toggle favorite status
    function toggleFavorite(item, type, button) {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const index = favorites.findIndex(fav => fav.id === item.id && fav.type === type);
      
      if (index !== -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        button.textContent = "🤍";
        showToast(`${item.title || item.name} retiré des favoris`);
      } else {
        // Add to favorites
        favorites.push({
          id: item.id,
          type: type,
          title: item.title || item.name,
          poster_path: item.poster_path,
          vote_average: item.vote_average,
          release_date: item.release_date || item.first_air_date,
          overview: item.overview
        });
        button.textContent = "❤️";
        showToast(`${item.title || item.name} ajouté aux favoris`);
      }
      
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    
    // Display content in hero section
    function displayInHero(item, type) {
      const backdropUrl = item.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : (item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : null);
      
      if (backdropUrl) {
        hero.style.backgroundImage = `url(${backdropUrl})`;
      }
      
      heroType.textContent = type === "movie" ? "Film" : "Série";
      heroTitle.textContent = item.title || item.name;
      heroDescription.textContent = item.overview || "Aucune description disponible.";
      
      const releaseDate = type === "movie" ? item.release_date : item.first_air_date;
      heroYear.textContent = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
      
      heroRating.textContent = getStarRating(item.vote_average);
      
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
    
    // Display random featured content
    function displayRandomContent() {
      const allContent = [...allSeries, ...allMovies];
      if (allContent.length === 0) return;
      
      const randomItem = allContent[Math.floor(Math.random() * allContent.length)];
      const type = randomItem.hasOwnProperty("first_air_date") ? "tv" : "movie";
      
      displayInHero(randomItem, type);
    }
    
    // Filter content by category
    function filterByCategory(category) {
      // Update active tab
      categories.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.category === category);
      });
      
      currentCategory = category;
      
      // Show random content when switching categories
      displayRandomContent();
      
      switch(category) {
        case "series":
          renderContent(seriesContainer, allSeries, "tv");
          document.getElementById("series-section").style.display = "block";
          document.getElementById("movies-section").style.display = "none";
          break;
          
        case "movies":
          renderContent(moviesContainer, allMovies, "movie");
          document.getElementById("series-section").style.display = "none";
          document.getElementById("movies-section").style.display = "block";
          break;
          
        case "trending":
          const trending = [...allSeries, ...allMovies].sort((a, b) => b.popularity - a.popularity);
          const trendingSeries = trending.filter(item => item.hasOwnProperty("first_air_date"));
          const trendingMovies = trending.filter(item => item.hasOwnProperty("release_date"));
          
          document.getElementById("series-section").style.display = "block";
          document.getElementById("movies-section").style.display = "block";
          document.querySelector("#series-section .section-title").textContent = "Séries Tendances";
          document.querySelector("#movies-section .section-title").textContent = "Films Tendances";
          
          renderContent(seriesContainer, trendingSeries, "tv");
          renderContent(moviesContainer, trendingMovies, "movie");
          break;
          
        case "recent":
          const sortByDate = (a, b) => {
            const dateA = new Date(a.release_date || a.first_air_date || "2000-01-01");
            const dateB = new Date(b.release_date || b.first_air_date || "2000-01-01");
            return dateB - dateA;
          };
          
          const recentContent = [...allSeries, ...allMovies].sort(sortByDate);
          const recentSeries = recentContent.filter(item => item.hasOwnProperty("first_air_date"));
          const recentMovies = recentContent.filter(item => item.hasOwnProperty("release_date"));
          
          document.getElementById("series-section").style.display = "block";
          document.getElementById("movies-section").style.display = "block";
          document.querySelector("#series-section .section-title").textContent = "Séries Récentes";
          document.querySelector("#movies-section .section-title").textContent = "Films Récents";
          
          renderContent(seriesContainer, recentSeries, "tv");
          renderContent(moviesContainer, recentMovies, "movie");
          break;
          
        default: // "all"
          document.getElementById("series-section").style.display = "block";
          document.getElementById("movies-section").style.display = "block";
          document.querySelector("#series-section .section-title").textContent = "Séries Populaires";
          document.querySelector("#movies-section .section-title").textContent = "Films Populaires";
          
          renderContent(seriesContainer, allSeries, "tv");
          renderContent(moviesContainer, allMovies, "movie");
      }
    }
    
    // Show favorites
    function showFavorites() {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      
      if (favorites.length === 0) {
        showToast("Vous n'avez pas encore de favoris");
        return;
      }
      
      const favSeries = favorites.filter(item => item.type === "tv");
      const favMovies = favorites.filter(item => item.type === "movie");
      
      document.getElementById("series-section").style.display = "block";
      document.getElementById("movies-section").style.display = "block";
      document.querySelector("#series-section .section-title").textContent = "Séries Favorites";
      document.querySelector("#movies-section .section-title").textContent = "Films Favoris";
      
      // Unselect all category tabs
      categories.forEach(tab => tab.classList.remove("active"));
      
      renderContent(seriesContainer, favSeries, "tv");
      renderContent(moviesContainer, favMovies, "movie");
    }
    
    // Render content to container
    function renderContent(container, items, type) {
      container.innerHTML = "";
      
      if (items.length === 0) {
        container.innerHTML = "<p style='color: #888; padding: 20px 0;'>Aucun contenu disponible</p>";
        return;
      }
      
      items.forEach(item => {
        const card = createCard(item, type);
        container.appendChild(card);
      });
    }
    
    // Fetch series from API
    async function fetchSeries() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr-FR&page=1`);
        const data = await response.json();
        allSeries = data.results;
        return data.results;
      } catch (error) {
        console.error("Erreur lors du chargement des séries:", error);
        return [];
      }
    }
    
    // Fetch movies from API
    async function fetchMovies() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`);
        const data = await response.json();
        allMovies = data.results;
        return data.results;
      } catch (error) {
        console.error("Erreur lors du chargement des films:", error);
        return [];
      }
    }
    
    // Initialize app
    async function init() {
      // Fetch data
      await Promise.all([fetchSeries(), fetchMovies()]);
      
      // Show initial category
      filterByCategory("all");
      
      // Set up event listeners
      categories.forEach(tab => {
        tab.addEventListener("click", () => {
          filterByCategory(tab.dataset.category);
        });
      });
      
      favoritesLink.addEventListener("click", (e) => {
        e.preventDefault();
        showFavorites();
      });
      
      mobileFavorites.addEventListener("click", (e) => {
        e.preventDefault();
        showFavorites();
        mobileMenu.style.display = "none";
      });
      
      watchBtn.addEventListener("click", () => {
        showToast("La lecture commence...");
      });
    }
    
    // Start the app
    init();
  