// Gère les commentaires utilisateur et les reviews TMDb
import { fetchEnglishReviews } from "./api.js";
import { fetchSeriesByPage } from "./api.js";
import { currentPage } from "./principale.js";

export const afficherDetailsSerie = (serie) => {
  const container = document.getElementById("serie-container");
  container.innerHTML = "";
  document.getElementById("pagination").style.display = "none";

  const details = document.createElement("div");
  details.className = "serie-details";

  const image = serie.poster_path
    ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'image";

  details.innerHTML = `
    <img src="${image}" alt="${serie.name}">
    <h2>${serie.name}</h2>
    <p><strong>Aperçu :</strong> ${serie.overview || "Pas de description."}</p>
    <p><strong>Popularité :</strong> ${serie.popularity}</p>
    <p><strong>Note :</strong> ${Math.round(serie.vote_average)} / 10</p>
    <button id="retour-btn">⬅ Revenir à la liste</button>
    <form id="comment-form">
      <label for="name-input">Votre nom :</label>
      <input type="text" id="name-input" required>
      <label for="comment-input">Commentaire :</label>
      <textarea id="comment-input" rows="4" required></textarea>
      <button type="submit">Envoyer</button>
    </form>
    <div id="comments-section">
      <h3>Commentaires :</h3>
      <ul id="comments-list"></ul>
    </div>
  `;

  container.appendChild(details);

  document.getElementById("retour-btn").onclick = () => {
    fetchSeriesByPage(currentPage);
    document.getElementById("pagination").style.display = "block";
  };

  const key = `comments_${serie.id}`;
  const existingComments = JSON.parse(localStorage.getItem(key)) || [];
  const commentsList = document.getElementById("comments-list");

  const renderComments = () => {
    commentsList.innerHTML = "";
    existingComments.forEach((c) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${c.name} :</strong> ${c.text}`;
      commentsList.appendChild(li);
    });
  };

  renderComments();

  // Ajout des reviews TMDb
  fetchEnglishReviews(serie.id).then((reviews) => {
    reviews.forEach((r) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${r.author} (Review TMDb):</strong> ${r.content}`;
      li.classList.add("review-tmdb");
      commentsList.appendChild(li);
    });
  });

  document.getElementById("comment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name-input").value.trim();
    const text = document.getElementById("comment-input").value.trim();
    if (name && text) {
      existingComments.push({ name, text });
      localStorage.setItem(key, JSON.stringify(existingComments));
      renderComments();
      e.target.reset();
    }
  });
};
