const apiKey = 'acd658a6376438e3aa6631ccb18c6227';

const renderFavorisFilms = async () => {
  const container = document.getElementById('favoris-films');
  const favoris = JSON.parse(localStorage.getItem("films_favoris")) || [];

  container.innerHTML = "";

  if (favoris.length === 0) {
    container.innerHTML = "<p>Aucun film favori.</p>";
    return;
  }

  // Récupération des détails pour chaque film favori
  const promises = favoris.map((id) =>
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR`)
      .then(res => res.json())
  );

  const films = await Promise.all(promises);

  films.forEach((movie) => {
    const col = document.createElement('div');
    col.classList.add('col-md-4', 'col-lg-3');

    const card = document.createElement('div');
    card.classList.add('card', 'bg-dark', 'text-white', 'h-100');

    const img = document.createElement('img');
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=Pas+d'image";
    img.classList.add('card-img-top');
    img.alt = movie.title;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const titre = document.createElement('h5');
    titre.classList.add('card-title');
    titre.textContent = movie.title;

    const sortie = document.createElement('p');
    sortie.classList.add('card-text', 'small');
    sortie.textContent = `Sortie : ${movie.release_date}`;

    const note = document.createElement('p');
    note.classList.add('card-text');
    note.textContent = `${movie.vote_average} ⭐`;

    cardBody.appendChild(titre);
    cardBody.appendChild(sortie);
    cardBody.appendChild(note);

    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
  });
};

document.addEventListener("DOMContentLoaded", renderFavorisFilms);
