const apiKey = 'TA_CLE_API_ICI'; 
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=acd658a6376438e3aa6631ccb18c6227&language=fr-FR&page=1`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const moviesDiv = document.getElementById('Film');
    data.results.forEach(movie => {
      const col = document.createElement('div');
      col.classList.add('col-md-4', 'col-lg-3');

      const card = document.createElement('div');
      card.classList.add('card', 'bg-dark', 'text-white', 'h-100');

      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      img.classList.add('card-img-top');
      img.alt = movie.title;

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body', 'd-flex', 'flex-column');

      const title = document.createElement('h5');
      title.classList.add('card-title');
      title.textContent = movie.title;

      const releaseDate = document.createElement('p');
      releaseDate.classList.add('card-text', 'small');
      releaseDate.textContent = movie.release_date;

      const rating = document.createElement('p');
      rating.classList.add('card-text');
      rating.textContent = `${movie.vote_average} ⭐`;

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-light', 'mt-auto');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', `#movieModal${movie.id}`);
      button.textContent = 'Voir plus';

      cardBody.appendChild(title);
      cardBody.appendChild(releaseDate);
      cardBody.appendChild(rating);
      cardBody.appendChild(button);

      card.appendChild(img);
      card.appendChild(cardBody);

      col.appendChild(card);
      moviesDiv.appendChild(col);
    });
  })
  .catch(error => console.error('Erreur:', error));
