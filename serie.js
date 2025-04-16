
// Clé API fournie par The Movie Database (TMDb)
const apiKey = "acd658a6376438e3aa6631ccb18c6227";

// Nombre total de pages disponibles pour la pagination
const totalPages = 10;
let currentPage = 1;
let allSeries = [];

const serieContainer = document.getElementById("serie-container");
const currentPageSpan = document.getElementById("current-page");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const resetPageBtn = document.getElementById("reset-page-btn");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("search-input");
const suggestions = document.getElementById("suggestions");

const fetchSeriesByPage = async (page) => {
  serieContainer.innerHTML = "";
  allSeries = [];

  try {
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr-FR&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

    const data = await response.json();
    const favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];

    data.results.forEach((serie) => {
      allSeries.push(serie);

      const serieDiv = document.createElement("div");
      serieDiv.classList.add("serie");
      serieDiv.style.position = "relative";

      const imageUrl = serie.poster_path
        ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
        : "https://via.placeholder.com/300x450?text=Pas+d'image";

      const coeurIcon = document.createElement("span");
      coeurIcon.classList.add("coeur-icon");
      coeurIcon.innerHTML = favoris.includes(serie.id) ? "❤️" : "🤍";
      coeurIcon.style.cursor = "pointer";
      coeurIcon.style.fontSize = "1.5rem";
      coeurIcon.style.position = "absolute";
      coeurIcon.style.top = "10px";
      coeurIcon.style.right = "10px";

      coeurIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        let favoris = JSON.parse(localStorage.getItem("series_favoris")) || [];
        if (favoris.includes(serie.id)) {
          favoris = favoris.filter((id) => id !== serie.id);
          coeurIcon.innerHTML = "🤍";
        } else {
          favoris.push(serie.id);
          coeurIcon.innerHTML = "❤️";
        }
        localStorage.setItem("series_favoris", JSON.stringify(favoris));
      });

      serieDiv.innerHTML = `
        <img src="${imageUrl}" alt="${serie.name}">
        <h3>${serie.name}</h3>
        <p>Note : ${Math.round(serie.vote_average)} / 10</p>
      `;

      serieDiv.appendChild(coeurIcon);

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

fetchSeriesByPage(currentPage);

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

resetPageBtn.addEventListener("click", () => {
  currentPage = 1;
  fetchSeriesByPage(currentPage);
});

const afficherDetailsSerie = (serie) => {
  pagination.style.display = "none";
  serieContainer.innerHTML = "";

  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("serie-details");

  const image = document.createElement("img");
  image.src = serie.poster_path
    ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Pas+d'image";
  image.alt = serie.name;

  const title = document.createElement("h2");
  title.textContent = serie.name;

  const overviewParagraph = document.createElement("p");
  overviewParagraph.innerHTML = `<strong>Aperçu :</strong> ${serie.overview || "Pas de description."}`;

  const popularityParagraph = document.createElement("p");
  popularityParagraph.innerHTML = `<strong>Popularité :</strong> ${serie.popularity}`;

  const voteAverageParagraph = document.createElement("p");
  voteAverageParagraph.innerHTML = `<strong>Note moyenne :</strong> ${Math.round(serie.vote_average)} / 10`;

  const retourBtn = document.createElement("button");
  retourBtn.id = "retour-btn";
  retourBtn.textContent = "⬅ Revenir à la liste";
  retourBtn.addEventListener("click", () => {
    fetchSeriesByPage(currentPage);
    pagination.style.display = "block";
  });

  const commentForm = document.createElement("form");
  commentForm.id = "comment-form";

  const nameLabel = document.createElement("label");
  nameLabel.setAttribute("for", "name-input");
  nameLabel.textContent = "Votre nom :";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "name-input";
  nameInput.placeholder = "Entrez votre nom...";
  nameInput.required = true;

  const commentLabel = document.createElement("label");
  commentLabel.setAttribute("for", "comment-input");
  commentLabel.textContent = "Laisser un commentaire :";

  const commentInput = document.createElement("textarea");
  commentInput.id = "comment-input";
  commentInput.rows = 4;
  commentInput.placeholder = "Écrivez votre commentaire ici...";
  commentInput.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Envoyer";

  commentForm.appendChild(nameLabel);
  commentForm.appendChild(nameInput);
  commentForm.appendChild(commentLabel);
  commentForm.appendChild(commentInput);
  commentForm.appendChild(submitBtn);

  const commentsSection = document.createElement("div");
  commentsSection.id = "comments-section";

  const commentsTitle = document.createElement("h3");
  commentsTitle.textContent = "Commentaires :";

  const commentsList = document.createElement("ul");
  commentsList.id = "comments-list";

  commentsSection.appendChild(commentsTitle);
  commentsSection.appendChild(commentsList);

  detailsDiv.appendChild(image);
  detailsDiv.appendChild(title);
  detailsDiv.appendChild(overviewParagraph);
  detailsDiv.appendChild(popularityParagraph);
  detailsDiv.appendChild(voteAverageParagraph);
  detailsDiv.appendChild(retourBtn);
  detailsDiv.appendChild(commentForm);
  detailsDiv.appendChild(commentsSection);

  serieContainer.appendChild(detailsDiv);

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

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (query.length >= 2) {
    const matchedSeries = allSeries.filter((serie) =>
      serie.name.toLowerCase().includes(query)
    );

    matchedSeries.forEach((serie) => {
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
