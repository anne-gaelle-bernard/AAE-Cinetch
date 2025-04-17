

    // Function to shuffle an array (random order)
    function shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    // Function to create movie/show card
    function createCard(item) {
      const card = document.createElement('div');
      card.className = 'movie-card';
      
      // TMDb URL based on type (movie or tv)
      const tmdbUrl = item.type === 'movie' 
        ? `https://api.themoviedb.org/3/movie/changes?page=1`
        : `https://www.themoviedb.org/tv/${item.id}`;
      
      card.innerHTML = `
        <a href="${tmdbUrl}" target="_blank">
          <img src="${item.image}" alt="${item.title}">
          <div class="movie-info">
            <h3 class="movie-title">${item.title}</h3>
            <p class="movie-year">${item.year}</p>
          </div>
        </a>
      `;
      
      return card;
    }

    // Function to populate rows
    function populateRow(rowId, items) {
      const row = document.getElementById(rowId);
      if (!row) return;
      
      const shuffledItems = shuffleArray(items);
      
      shuffledItems.forEach(item => {
        row.appendChild(createCard(item));
      });
    }

    // Function to scroll slider
    function scrollSlider(slider, direction) {
      const scrollAmount = slider.clientWidth * 0.8 * direction;
      slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }

    // Sticky navbar
    window.addEventListener('scroll', function() {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Initialize the page
    window.onload = function() {
      // Populate rows with random content
      populateRow('popular-row', [...movies, ...tvShows]);
      populateRow('trending-row', shuffleArray([...movies, ...tvShows]));
      populateRow('tvshows-row', tvShows);
    };
