
        // Cinétech Entrance Animation
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const entrance = document.querySelector('.cinetech-entrance');
                entrance.style.opacity = '0';
                setTimeout(() => {
                    entrance.style.display = 'none';
                }, 1000);
            }, 2500);
        });
        
        // API Configuration
        const apiKey = "acd658a6376438e3aa6631ccb18c6227";
        const baseURL = "https://api.themoviedb.org/3";
        const imageBaseURL = "https://image.tmdb.org/t/p/";
        
        // Favorites Management
        let favorites = [];
        
        // Load favorites from localStorage
        function loadFavorites() {
            const storedFavorites = localStorage.getItem('cinetech-favorites');
            if (storedFavorites) {
                favorites = JSON.parse(storedFavorites);
            }
        }
        
        // Save favorites to localStorage
        function saveFavorites() {
            localStorage.setItem('cinetech-favorites', JSON.stringify(favorites));
        }
        
        // Add or remove from favorites
        function toggleFavorite(media) {
            const index = favorites.findIndex(item => 
                item.id === media.id && item.type === media.type
            );
            
            if (index === -1) {
                favorites.push(media);
            } else {
                favorites.splice(index, 1);
            }
            
            saveFavorites();
            renderFavorites();
            
            // Update favorite buttons on all sections
            document.querySelectorAll(`.favorite-btn[data-id="${media.id}"][data-type="${media.type}"]`).forEach(btn => {
                btn.classList.toggle('active');
                btn.innerHTML = isFavorite(media.id, media.type) ? '❤' : '♡';
            });
        }
        
        // Check if item is in favorites
        function isFavorite(id, type) {
            return favorites.some(item => item.id === id && item.type === type);
        }
        
        // Fetch data from API
        async function fetchData(endpoint) {
            try {
                const response = await fetch(`${baseURL}${endpoint}`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching data:", error);
                return null;
            }
        }
        
        // Create movie card
        function createMediaCard(item, type = 'movie') {
            const card = document.createElement('div');
            card.className = 'movie-card';
            
            const posterPath = item.poster_path || item.backdrop_path;
            const imageUrl = posterPath ? `${imageBaseURL}w500${posterPath}` : '/api/placeholder/200/300';
            
            // Store media info
            const media = {
                id: item.id,
                type: type,
                title: item.title || item.name,
                overview: item.overview,
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path
            };
            
            card.innerHTML = `
                <img src="${imageUrl}" alt="${media.title}">
                <button class="favorite-btn ${isFavorite(media.id, type) ? 'active' : ''}" 
                       data-id="${media.id}" 
                       data-type="${type}">
                    ${isFavorite(media.id, type) ? '❤' : '♡'}
                </button>
                <div class="movie-info">
                    <h3>${media.title}</h3>
                    <p>${item.vote_average ? item.vote_average.toFixed(1) + '/10' : 'No rating'}</p>
                </div>
            `;
            
            // Add event listeners
            card.addEventListener('click', () => {
                updateHero(media);
            });
            
            const favBtn = card.querySelector('.favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(media);
            });
            
            return card;
        }
        
        // Populate a slider with media items
        function populateSlider(containerId, items, mediaType = 'movie') {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            
            // Randomize the order of items
            const shuffledItems = [...items].sort(() => Math.random() - 0.5);
            
            // Take at most 15 items
            const selectedItems = shuffledItems.slice(0, 15);
            
            selectedItems.forEach(item => {
                const card = createMediaCard(item, mediaType);
                container.appendChild(card);
            });
        }
        
        // Update hero section
        function updateHero(media) {
            const heroSection = document.querySelector('.hero');
            const heroTitle = document.getElementById('hero-title');
            const heroOverview = document.getElementById('hero-overview');
            const heroFavoriteBtn = document.getElementById('hero-favorite-btn');
            
            heroTitle.textContent = media.title;
            heroOverview.textContent = media.overview || 'No description available';
            
            if (media.backdrop_path) {
                heroSection.style.backgroundImage = `url(${imageBaseURL}original${media.backdrop_path})`;
            } else if (media.poster_path) {
                heroSection.style.backgroundImage = `url(${imageBaseURL}original${media.poster_path})`;
            }
            
            heroFavoriteBtn.textContent = isFavorite(media.id, media.type) ? 'Remove from My List' : 'Add to My List';
            
            heroFavoriteBtn.onclick = () => {
                toggleFavorite(media);
                heroFavoriteBtn.textContent = isFavorite(media.id, media.type) ? 'Remove from My List' : 'Add to My List';
            };
        }
        
        // Render favorites section
        function renderFavorites() {
            const container = document.getElementById('favorites-list');
            if (!container) return;
            
            container.innerHTML = '';
            
            if (favorites.length === 0) {
                const message = document.createElement('p');
                message.textContent = 'You have no items in your list. Add some favorites!';
                message.style.padding = '20px';
                container.appendChild(message);
                return;
            }
            
            favorites.forEach(media => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                
                const posterPath = media.poster_path || media.backdrop_path;
                const imageUrl = posterPath ? `${imageBaseURL}w500${posterPath}` : '/api/placeholder/200/300';
                
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${media.title}">
                    <button class="favorite-btn active" data-id="${media.id}" data-type="${media.type}">❤</button>
                    <div class="movie-info">
                        <h3>${media.title}</h3>
                    </div>
                `;
                
                card.addEventListener('click', () => {
                    updateHero(media);
                });
                
                const favBtn = card.querySelector('.favorite-btn');
                favBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorite(media);
                });
                
                container.appendChild(card);
            });
        }
        
        // Navigation
        function setupNavigation() {
            const navItems = document.querySelectorAll('nav ul li');
            const sections = {
                'home': document.getElementById('home-section'),
                'movies': document.getElementById('movies-section'),
                'series': document.getElementById('series-section'),
                'favorites': document.getElementById('favorites-section')
            };
            
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Update active nav item
                    navItems.forEach(navItem => navItem.classList.remove('active'));
                    item.classList.add('active');
                    
                    // Show current section, hide others
                    const sectionId = item.getAttribute('data-section');
                    Object.keys(sections).forEach(key => {
                        if (sections[key]) {
                            sections[key].style.display = key === sectionId ? 'block' : 'none';
                        }
                    });
                    
                    // If favorites section is selected, re-render it
                    if (sectionId === 'favorites') {
                        renderFavorites();
                    }
                });
            });
        }
        
        // Initialize app
        async function init() {
            loadFavorites();
            setupNavigation();
            
            // Fetch initial data
            const trendingMovies = await fetchData('/trending/movie/week?api_key=' + apiKey);
            const popularSeries = await fetchData('/tv/popular?api_key=' + apiKey);
            const topRated = await fetchData('/movie/top_rated?api_key=' + apiKey);
            
            // Home page content
            if (trendingMovies && trendingMovies.results) {
                populateSlider('trending-movies', trendingMovies.results, 'movie');
                // Set hero banner to a random trending movie
                const randomIndex = Math.floor(Math.random() * trendingMovies.results.length);
                updateHero({
                    ...trendingMovies.results[randomIndex],
                    title: trendingMovies.results[randomIndex].title,
                    type: 'movie'
                });
            }
            
            if (popularSeries && popularSeries.results) {
                populateSlider('popular-series', popularSeries.results, 'tv');
            }
            
            if (topRated && topRated.results) {
                populateSlider('top-rated', topRated.results, 'movie');
            }
            
            // Movies section content
            const popularMovies = await fetchData('/movie/popular?api_key=' + apiKey);
            const actionMovies = await fetchData('/discover/movie?api_key=' + apiKey + '&with_genres=28');
            const comedyMovies = await fetchData('/discover/movie?api_key=' + apiKey + '&with_genres=35');
            
            if (popularMovies && popularMovies.results) {
                populateSlider('popular-movies', popularMovies.results, 'movie');
            }
            
            if (actionMovies && actionMovies.results) {
                populateSlider('action-movies', actionMovies.results, 'movie');
            }
            
            if (comedyMovies && comedyMovies.results) {
                populateSlider('comedy-movies', comedyMovies.results, 'movie');
            }
            
            // Series section content
            const trendingSeries = await fetchData('/trending/tv/week?api_key=' + apiKey);
            const dramaSeries = await fetchData('/discover/tv?api_key=' + apiKey + '&with_genres=18');
            const scifiSeries = await fetchData('/discover/tv?api_key=' + apiKey + '&with_genres=10765');
            
            if (trendingSeries && trendingSeries.results) {
                populateSlider('trending-series', trendingSeries.results, 'tv');
            }
            
            if (dramaSeries && dramaSeries.results) {
                populateSlider('drama-series', dramaSeries.results, 'tv');
            }
            
            if (scifiSeries && scifiSeries.results) {
                populateSlider('scifi-series', scifiSeries.results, 'tv');
            }
            
            // Render favorites
            renderFavorites();
        }
        
        // Run init when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
   