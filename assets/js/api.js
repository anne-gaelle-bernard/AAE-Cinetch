// Gère les appels à l'API TheMovieDB
import { renderSerieList } from "./interface.js";
import { currentPage } from "./principale.js";

const apiKey = "acd658a6376438e3aa6631ccb18c6227";

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

export const fetchSeriesByPage = async (page) => {
  const container = document.getElementById("serie-container");
  container.innerHTML = "";
  try {
    const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=fr-FR&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    renderSerieList(data.results);
  } catch (error) {
    container.innerHTML = "<p>Impossible de charger les séries.</p>";
    console.error("Erreur de chargement des séries :", error);
  }
};
