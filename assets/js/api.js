// Gère les appels à l'API TheMovieDB
import { renderSerieList } from "./interface.js";
import { currentPage } from "./principale.js";

// Clé API
const apiKey = "acd658a6376438e3aa6631ccb18c6227";

// URL genres TV 
const genreUrl = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=fr-FR`;

// Stockage des genres
let genres = {};

fetch(genreUrl)
  .then(response => response.json())
  .then(data => {
    data.genres.forEach(genre => {
      genres[genre.id] = genre.name;
    });
  })
  .catch(error => console.error('Erreur récupération des genres :', error));


// Récupérer les reviews

export const fetchEnglishReviews = async (serieId) => {
  const url = `https://api.themoviedb.org/3/tv/${serieId}/reviews?api_key=${apiKey}&language=en-US`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Erreur review TMDb :", error);
    return [];
  }
};


// Récupérer les séries par page

export const fetchSeriesByPage = async (page) => {
  const container = document.getElementById("serie-container");
  container.innerHTML = "";
  try {
    const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=fr-FR&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    renderSerieList(data.results);

    // Active les filtres une fois les séries chargées
    activerFiltreSeries(data.results);

  } catch (error) {
    container.innerHTML = "<p>Impossible de charger les séries.</p>";
    console.error("Erreur de chargement des séries :", error);
  }
};

// Récupérer les favoris enregistrés

export const fetchFavorisDetails = async (favoris) => {
  const promises = favoris.map(async (id) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=fr-FR`
      );
      if (!response.ok) throw new Error("Erreur API");
      return await response.json();
    } catch (e) {
      console.error("Erreur API favori ID:", id, e);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((s) => s); // enlève les null
};


// Filtres par genre

export function activerFiltreSeries(seriesList) {
  const btnFiltrer = document.getElementById("btnfiltrer");

  if (!btnFiltrer) {
    console.warn("Bouton de filtre (btnfiltrer) non trouvé dans le HTML");
    return;
  }

  btnFiltrer.addEventListener("click", () => {
    let exist = document.getElementById("zone-filtre");
    if (exist) {
      exist.remove();
      return;
    }

    const divFiltres = document.createElement("div");
    divFiltres.id = "zone-filtre";
    divFiltres.className = "my-3 d-flex flex-wrap justify-content-center";

    // Bouton "Toutes les séries"
    const btnTous = document.createElement("button");
    btnTous.className = "btn m-1 btn-outline-light";
    btnTous.textContent = "Toutes les séries";
    btnTous.onclick = () => renderSerieList(seriesList);
    divFiltres.appendChild(btnTous);

    // Boutons pour chaque genre
    Object.entries(genres).forEach(([id, nom]) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-light m-1";
      btn.textContent = nom;
      btn.onclick = () => {
        const filtered = seriesList.filter(serie => serie.genre_ids.includes(parseInt(id)));
        renderSerieList(filtered);
      };
      divFiltres.appendChild(btn);
    });

    btnFiltrer.after(divFiltres);
  });
}
