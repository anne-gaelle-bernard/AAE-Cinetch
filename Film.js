const apiKey = 'acd658a6376438e3aa6631ccb18c6227'; 
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=acd658a6376438e3aa6631ccb18c6227&language=fr-FR&page=1`;
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr-FR`;
// variables pour stocker les films et les genres
let films = []; 
let genres = {}; 
// recherche de la liste des genres
fetch(genreUrl)
  .then(response => response.json())
  .then(data => {
    data.genres.forEach(genre => {
      genres[genre.id] = genre.name;
    });
  });




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

  let favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];

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

    // Bouton "Tous"
    const btnTous = document.createElement("button");
    btnTous.className = "btn m-1";
    btnTous.textContent = "Tous";
    btnTous.onclick = () => afficherFilms(films);
    divFiltres.appendChild(btnTous);

    // Les boutons par genre
    Object.entries(genres).forEach(([id, nom]) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline- m-1 text-color-white";
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

