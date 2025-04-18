const apiKey = 'TA_CLE_API_ICI'; 
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=acd658a6376438e3aa6631ccb18c6227&language=fr-FR&page=1`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const moviesDiv = document.getElementById('Film');
    let favoris = JSON.parse(localStorage.getItem("series_favoris")) || []; 

    data.results.forEach(movie => {
      const col = document.createElement('div');
      col.classList.add('col-md-4', 'col-lg-3');

      const card = document.createElement('div');
      card.classList.add('card', 'bg-dark', 'text-white', 'h-100');

      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      img.classList.add('card-img-top');
      img.alt = movie.title;

      const coeurIcon = document.createElement("span");
      coeurIcon.classList.add("coeur-icon");
      coeurIcon.innerHTML = favoris.includes(movie.id) ? "❤️" : "🤍";
      coeurIcon.style.cursor = "pointer";
      coeurIcon.style.fontSize = "1.5rem";
      coeurIcon.style.position = "absolute";
      coeurIcon.style.top = "10px";
      coeurIcon.style.right = "10px";

      coeurIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (favoris.includes(movie.id)) {
          favoris = favoris.filter((id) => id !== movie.id);
          coeurIcon.innerHTML = "🤍";
        } else {
          favoris.push(movie.id);
          coeurIcon.innerHTML = "❤️";
        }
        localStorage.setItem("series_favoris", JSON.stringify(favoris));
      });

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body', 'd-flex', 'flex-column');

      const titre = document.createElement('h5');
      titre.classList.add('card-title');
      titre.textContent = movie.title;

      const sortit = document.createElement('p');
      sortit.classList.add('card-text', 'small');
      sortit.textContent = movie.release_date;

      const note = document.createElement('p');
      note.classList.add('card-text');
      note.textContent = `${movie.vote_average} ⭐`;

      const bouton = document.createElement('button');
      bouton.classList.add('btn', 'btn-outline-light', 'mt-auto');
      bouton.setAttribute('data-bs-toggle', 'modal');
      bouton.setAttribute('data-bs-target', `#movieModal${movie.id}`);
      bouton.textContent = 'Voir plus';

      cardBody.appendChild(titre);
      cardBody.appendChild(sortit);
      cardBody.appendChild(note);
      cardBody.appendChild(bouton);

      card.appendChild(img);
      card.appendChild(coeurIcon); 
      card.appendChild(cardBody);

      col.appendChild(card);
      moviesDiv.appendChild(col);
    });
  })
  .catch(error => console.error('Erreur:', error));
