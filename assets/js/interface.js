import { getCurrentPage, setCurrentPage } from "./status.js";
import { totalPages } from "./principale.js";
import { fetchSeriesByPage } from "./api.js";
import { afficherDetailsSerie } from "./commentaires.js";

let allSeries = [];

export const renderSerieList = (series) => {
  allSeries = series;
  const container = document.getElementById("serie-container");
  container.innerHTML = "";

  const favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];

  series.forEach((serie) => {
    const div = document.createElement("div");
    div.classList.add("serie");

    const imageUrl = serie.poster_path
      ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
      : "https://via.placeholder.com/300x450?text=Pas+d'image";

    const coeurIcon = document.createElement("span");
    coeurIcon.className = "coeur-icon";
    coeurIcon.innerHTML = favoris.includes(serie.id) ? "❤️" : "🤍";
    coeurIcon.onclick = (e) => {
      e.stopPropagation();
      toggleFavori(serie.id, coeurIcon);
    };

    div.innerHTML = `
      <img src="${imageUrl}" alt="${serie.name}">
      <h3>${serie.name}</h3>
      <p>Note : ${Math.round(serie.vote_average)} / 10</p>
    `;
    div.appendChild(coeurIcon);
    div.onclick = () => afficherDetailsSerie(serie);
    container.appendChild(div);
  });

  document.getElementById("current-page").textContent = `Page ${getCurrentPage()}`;
};

const toggleFavori = (id, icon) => {
  let favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];
  if (favoris.includes(id)) {
    favoris = favoris.filter((f) => f !== id);
    icon.innerHTML = "🤍";
  } else {
    favoris.push(id);
    icon.innerHTML = "❤️";
  }
  localStorage.setItem("series_favoris", JSON.stringify(favoris));
};

export const setupPagination = () => {
  document.getElementById("prev-page").onclick = () => {
    if (getCurrentPage() > 1) {
      setCurrentPage(getCurrentPage() - 1);
      fetchSeriesByPage(getCurrentPage());
    }
  };
  document.getElementById("next-page").onclick = () => {
    if (getCurrentPage() < totalPages) {
      setCurrentPage(getCurrentPage() + 1);
      fetchSeriesByPage(getCurrentPage());
    }
  };
  document.getElementById("reset-page-btn").onclick = () => {
    setCurrentPage(1);
    fetchSeriesByPage(getCurrentPage());
  };
};

export const setupSearch = () => {
  const input = document.getElementById("search-input");
  const suggestions = document.getElementById("suggestions");

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    suggestions.innerHTML = "";
    if (query.length >= 2) {
      const matches = allSeries.filter((s) =>
        s.name.toLowerCase().includes(query)
      );
      matches.forEach((serie) => {
        const item = document.createElement("div");
        item.textContent = serie.name;
        item.className = "suggestion-item";
        item.onclick = () => {
          suggestions.innerHTML = "";
          input.value = serie.name;
          afficherDetailsSerie(serie);
        };
        suggestions.appendChild(item);
      });
    }
  });
};

// Gère l'affichage de la liste des séries favorites  
import { fetchFavorisDetails } from './api.js';

export const renderFavorisList = async () => {
  const container = document.getElementById("favoris-container");
  const favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];

  container.innerHTML = "";

  if (favoris.length === 0) {
    container.innerHTML = "<p>Aucune série favorite.</p>";
    return;
  }

  const series = await fetchFavorisDetails(favoris);

  series.forEach((serie) => {
    const div = document.createElement("div");
    div.className = "serie";

    const imageUrl = serie.poster_path
      ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
      : "https://via.placeholder.com/300x450?text=Pas+d'image";

    div.innerHTML = `
      <img src="${imageUrl}" alt="${serie.name}">
      <h3>${serie.name}</h3>
      <p>Note : ${Math.round(serie.vote_average)} / 10</p>
    `;

    container.appendChild(div);
  });
};




