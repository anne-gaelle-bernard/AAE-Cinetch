const apiKey = 'acd658a6376438e3aa6631ccb18c6227';
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`;
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr-FR`;

let films = [];
let genres = {};

fetch(genreUrl)
  .then(response => response.json())
  .then(data => {
    data.genres.forEach(genre => {
      genres[genre.id] = genre.name;
    });
  })
  .catch(error => console.error('Erreur:', error));

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    films = data.results;
    afficherFilms(films);
    activerFiltre();
  })
  .catch(error => console.error('Erreur:', error));

function afficherFilms(liste) {
  const moviesDiv = document.getElementById('Film');
  moviesDiv.innerHTML = "";

  let favoris = JSON.parse(localStorage.getItem("films_favoris")) || [];
  let commentaires = JSON.parse(localStorage.getItem("films_commentaires")) || {};

  liste.forEach(movie => {
    const col = document.createElement('div');
    col.classList.add('col-md-4', 'col-lg-3');

    const card = document.createElement('div');
    card.classList.add('card', 'bg-dark', 'text-white', 'h-100', 'position-relative');

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
      localStorage.setItem("films_favoris", JSON.stringify(favoris));
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

    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = `movieModal${movie.id}`;
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', `movieModalLabel${movie.id}`);
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="movieModalLabel${movie.id}">${movie.title}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" class="img-fluid mb-3" alt="${movie.title}">
            <p><strong>Date de sortie :</strong> ${movie.release_date}</p>
            <p><strong>Note :</strong> ${movie.vote_average} ⭐</p>
            <p><strong>Résumé :</strong> ${movie.overview}</p>
            <hr>
            <h5>Commentaires</h5>
            <div id="comments-list-${movie.id}" class="mb-4"></div>
            <h6>Ajouter un commentaire</h6>
            <textarea id="new-comment-${movie.id}" class="form-control mb-2" rows="3" placeholder="Écrivez votre commentaire ici..."></textarea>
            <button id="post-comment-${movie.id}" class="btn btn-primary">Poster</button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    `;

    const commentsList = modal.querySelector(`#comments-list-${movie.id}`);
    if (commentaires[movie.id]) {
      commentaires[movie.id].forEach(({ content, date }) => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('mb-3', 'p-3', 'bg-secondary', 'rounded');
        commentDiv.innerHTML = `
          <p><strong>Vous</strong> <em>(${date})</em> :</p>
          <p>${content}</p>
        `;
        commentsList.appendChild(commentDiv);
      });
    }

    modal.querySelector(`#post-comment-${movie.id}`).addEventListener('click', () => {
      const newComment = document.getElementById(`new-comment-${movie.id}`).value;
      if (newComment.trim() === '') {
        alert('Veuillez écrire un commentaire avant de poster.');
        return;
      }

      const currentDate = new Date().toLocaleString();
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('mb-3', 'p-3', 'bg-secondary', 'rounded');
      commentDiv.innerHTML = `
        <p><strong>Vous</strong> <em>(${currentDate})</em> :</p>
        <p>${newComment}</p>
      `;
      commentsList.appendChild(commentDiv);

      if (!commentaires[movie.id]) {
        commentaires[movie.id] = [];
      }
      commentaires[movie.id].push({ content: newComment, date: currentDate });
      localStorage.setItem("films_commentaires", JSON.stringify(commentaires));

      document.getElementById(`new-comment-${movie.id}`).value = '';
    });

    cardBody.appendChild(titre);
    cardBody.appendChild(sortit);
    cardBody.appendChild(note);
    cardBody.appendChild(bouton);

    card.appendChild(img);
    card.appendChild(coeurIcon);
    card.appendChild(cardBody);

    col.appendChild(card);
    moviesDiv.appendChild(col);
    moviesDiv.appendChild(modal);
  });
}

function activerFiltre() {
  const btnFiltrer = document.getElementById("btnfiltrer");

  btnFiltrer.addEventListener("click", () => {
    let exist = document.getElementById("zone-filtre");
    if (exist) {
      exist.remove();
      return;
    }

    const divFiltres = document.createElement("div");
    divFiltres.id = "zone-filtre";
    divFiltres.className = "my-3 d-flex flex-wrap justify-content-center";

    const btnTous = document.createElement("button");
    btnTous.className = "btn m-1";
    btnTous.textContent = "Tous";
    btnTous.onclick = () => afficherFilms(films);
    divFiltres.appendChild(btnTous);

    Object.entries(genres).forEach(([id, nom]) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-light m-1";
      btn.textContent = nom;
      btn.onclick = () => {
        const filtered = films.filter(film => film.genre_ids.includes(parseInt(id)));
        afficherFilms(filtered);
      };
      divFiltres.appendChild(btn);
    });

    btnFiltrer.after(divFiltres);
  });
}

