const apiKey = "acd658a6376438e3aa6631ccb18c6227";
const totalPages = 10;
let currentPage = 1;
let allSeries = [];

const serieContainer = document.getElementById("serie-container");
const currentPageSpan = document.getElementById("current-page");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pagination = document.getElementById("pagination");

const fetchSeriesByPage = async (page) => {
  serieContainer.innerHTML = "";
  allSeries = [];

  try {
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr-FR&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();

    data.results.forEach(serie => {
      allSeries.push(serie);

      const serieDiv = document.createElement("div");
      serieDiv.classList.add("serie");

      const imageUrl = serie.poster_path
        ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
        : "https://via.placeholder.com/300x450?text=Pas+d'image";

      serieDiv.innerHTML = `
        <img src="${imageUrl}" alt="${serie.name}">
        <h3>${serie.name}</h3>
        <p>Note : ${serie.vote_average} / 10</p>
      `;

      serieDiv.addEventListener("click", () => {
        afficherDetailsSerie(serie);
      });

      serieContainer.appendChild(serieDiv);
    });

    currentPageSpan.textContent = `Page ${currentPage}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

  } catch (error) {
    console.error("❌ Une erreur :", error);
    serieContainer.innerHTML = "<p>Impossible de charger les séries.</p>";
  }
};

// Appel initial de la fonction
fetchSeriesByPage(currentPage);

// Navigation entre pages
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchSeriesByPage(currentPage);
  }
});

nextPageBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchSeriesByPage(currentPage);
  }
});

const afficherDetailsSerie = (serie) => {
  serieContainer.innerHTML = "";

  // ⛔ Masquer la pagination
  pagination.style.display = "none";

  const imageUrl = serie.poster_path
    ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'image";

  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("serie-details");

  detailsDiv.innerHTML = `
    <img src="${imageUrl}" alt="${serie.name}">
    <h2>${serie.name}</h2>
    <p><strong>Aperçu :</strong> ${serie.overview || "Pas de description."}</p>
    <p><strong>Popularité :</strong> ${serie.popularity}</p>
    <p><strong>Note moyenne :</strong> ${serie.vote_average} / 10</p>
    <button id="retour-btn">⬅ Revenir à la liste</button>
    <form id="comment-form">
      <label for="name-input">Votre nom :</label>
      <input type="text" id="name-input" placeholder="Entrez votre nom..." required />
      <label for="comment-input">Laisser un commentaire :</label>
      <textarea id="comment-input" rows="4" placeholder="Écrivez votre commentaire ici..." required></textarea>
      <button type="submit">Envoyer</button>
    </form>
    <div id="comments-section">
      <h3>Commentaires :</h3>
      <ul id="comments-list"></ul>
    </div>
  `;

  serieContainer.appendChild(detailsDiv);

  document.getElementById("retour-btn").addEventListener("click", () => {
    pagination.style.display = "block"; // ✅ Réaffiche la pagination
    fetchSeriesByPage(currentPage);
  });

  const commentForm = document.getElementById("comment-form");
  const commentsList = document.getElementById("comments-list");
  const localStorageKey = `comments_${serie.id}`;

  const existingComments = JSON.parse(localStorage.getItem(localStorageKey)) || [];

  const renderComments = () => {
    commentsList.innerHTML = "";
    existingComments.forEach((comment) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${comment.name} :</strong> ${comment.text}`;
      commentsList.appendChild(li);
    });
  };

  renderComments();

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("name-input");
    const commentInput = document.getElementById("comment-input");

    const newComment = {
      name: nameInput.value.trim(),
      text: commentInput.value.trim(),
    };

    if (newComment.name && newComment.text) {
      existingComments.push(newComment);
      localStorage.setItem(localStorageKey, JSON.stringify(existingComments));
      renderComments();
      nameInput.value = "";
      commentInput.value = "";
    }
  });
};

// 🔍 Barre de recherche avec suggestions
const searchInput = document.getElementById("search-input");
const suggestions = document.getElementById("suggestions");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (query.length >= 2) {
    const matchedSeries = allSeries.filter(serie =>
      serie.name.toLowerCase().includes(query)
    );

    matchedSeries.forEach(serie => {
      const div = document.createElement("div");
      div.textContent = serie.name;
      div.classList.add("suggestion-item");

      div.addEventListener("click", () => {
        suggestions.innerHTML = "";
        searchInput.value = serie.name;
        afficherDetailsSerie(serie);
      });

      suggestions.appendChild(div);
    });
  }
});
