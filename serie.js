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
        <p>Note : ${Math.round(serie.vote_average)} / 10</p>
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
  // Cacher la pagination
  pagination.style.display = "none";

  // Vide la zone où les séries sont affichées
  serieContainer.innerHTML = "";

  // Crée un nouveau conteneur pour les détails
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("serie-details");

  // Crée l'image
  const image = document.createElement("img");
  image.src = serie.poster_path
    ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'image";
  image.alt = serie.name;

  // Crée le titre de la série
  const title = document.createElement("h2");
  title.textContent = serie.name;

  // Crée l'aperçu (description)
  const overviewParagraph = document.createElement("p");
  overviewParagraph.innerHTML = `<strong>Aperçu :</strong> ${serie.overview || "Pas de description."}`;

  // Crée la popularité
  const popularityParagraph = document.createElement("p");
  popularityParagraph.innerHTML = `<strong>Popularité :</strong> ${serie.popularity}`;

  // Crée la note moyenne
  const voteAverageParagraph = document.createElement("p");
  voteAverageParagraph.innerHTML = `<strong>Note moyenne :</strong> ${serie.vote_average} / 10`;

  // Crée le bouton pour revenir à la liste
  const retourBtn = document.createElement("button");
  retourBtn.id = "retour-btn";
  retourBtn.textContent = "⬅ Revenir à la liste";
  
  // Ajoute l'événement pour revenir à la liste des séries
  retourBtn.addEventListener("click", () => {
    fetchSeriesByPage(currentPage);
    pagination.style.display = "block";  // Réafficher la pagination
  });

  // Crée le formulaire de commentaire
  const commentForm = document.createElement("form");
  commentForm.id = "comment-form";

  // Crée le champ pour le nom
  const nameLabel = document.createElement("label");
  nameLabel.setAttribute("for", "name-input");
  nameLabel.textContent = "Votre nom :";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "name-input";
  nameInput.placeholder = "Entrez votre nom...";
  nameInput.required = true;

  // Crée le champ pour le commentaire
  const commentLabel = document.createElement("label");
  commentLabel.setAttribute("for", "comment-input");
  commentLabel.textContent = "Laisser un commentaire :";

  const commentInput = document.createElement("textarea");
  commentInput.id = "comment-input";
  commentInput.rows = 4;
  commentInput.placeholder = "Écrivez votre commentaire ici...";
  commentInput.required = true;

  // Crée le bouton d'envoi du commentaire
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Envoyer";

  // Ajoute les éléments du formulaire
  commentForm.appendChild(nameLabel);
  commentForm.appendChild(nameInput);
  commentForm.appendChild(commentLabel);
  commentForm.appendChild(commentInput);
  commentForm.appendChild(submitBtn);

  // Crée la section des commentaires
  const commentsSection = document.createElement("div");
  commentsSection.id = "comments-section";

  const commentsTitle = document.createElement("h3");
  commentsTitle.textContent = "Commentaires :";

  const commentsList = document.createElement("ul");
  commentsList.id = "comments-list";

  commentsSection.appendChild(commentsTitle);
  commentsSection.appendChild(commentsList);

  // Ajoute les éléments dans le div des détails
  detailsDiv.appendChild(image);
  detailsDiv.appendChild(title);
  detailsDiv.appendChild(overviewParagraph);
  detailsDiv.appendChild(popularityParagraph);
  detailsDiv.appendChild(voteAverageParagraph);
  detailsDiv.appendChild(retourBtn);
  detailsDiv.appendChild(commentForm);
  detailsDiv.appendChild(commentsSection);

  // Ajoute le div des détails dans le conteneur principal
  serieContainer.appendChild(detailsDiv);

  // Récupère les commentaires existants depuis le localStorage
  const localStorageKey = `comments_${serie.id}`;
  const existingComments = JSON.parse(localStorage.getItem(localStorageKey)) || [];

  // Fonction pour rendre les commentaires
  const renderComments = () => {
    commentsList.innerHTML = "";
    existingComments.forEach((comment) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${comment.name} :</strong> ${comment.text}`;
      commentsList.appendChild(li);
    });
  };

  renderComments();

  // Ajoute un commentaire
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
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

const resetPageBtn = document.getElementById("reset-page-btn");

resetPageBtn.addEventListener("click", () => {
  currentPage = 1;  // Réinitialise la page à 1
  fetchSeriesByPage(currentPage);  // Recharge les séries de la page 1
});
