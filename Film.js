const apiKey = 'TA_CLE_API_ICI'; 
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=acd658a6376438e3aa6631ccb18c6227&language=fr-FR&page=1`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const moviesDiv = document.getElementById('Film');
    data.results.forEach(movie => {
      const col = document.createElement('div');
      col.classList.add('col-md-4', 'col-lg-3');

      col.innerHTML = `
        <div class="card bg-dark text-white h-100">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text small">${movie.release_date}</p>
            <p class="card-text">${movie.vote_average} ⭐</p>
            <button class="btn btn-outline-light mt-auto" data-bs-toggle="modal" data-bs-target="#movieModal${movie.id}">Voir plus</button>
          </div>
        </div>
        <div class="modal fade" id="movieModal${movie.id}" tabindex="-1" aria-labelledby="movieModalLabel${movie.id}" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-white">
              <div class="modal-header">
                <h5 class="modal-title" id="movieModalLabel${movie.id}">${movie.title}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="img-fluid mb-3">
                <p>${movie.overview}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      moviesDiv.appendChild(col);
    });
  })
  .catch(error => console.error('Erreur:', error));
