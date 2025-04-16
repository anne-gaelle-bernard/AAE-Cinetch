const apiKey = "acd658a6376438e3aa6631ccb18c6227";
const totalPages = 2; //   pour afficher plus de pages + la valeur ^^ 

const fetchAllPopularSeries = async () => {
  const serieContainer = document.getElementById("serie-container");

  try {
    for (let page = 1; page <= totalPages; page++) {
      const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr-FR&page=${page}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();

      data.results.forEach(serie => {
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
      
        // 👉 Clique sur la série
        serieDiv.addEventListener("click", () => {
          afficherDetailsSerie(serie);
        });
      
        serieContainer.appendChild(serieDiv);
      });
      
    }
  } catch (error) {
    console.error("❌ Une erreur :", error);
    document.getElementById("serie-container").innerHTML = "<p>Impossible de charger les séries.</p>";
  }
};

fetchAllPopularSeries();

const afficherDetailsSerie = (serie) => {
  const serieContainer = document.getElementById("serie-container");

  serieContainer.innerHTML = "";

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

  // bouton retour
  document.getElementById("retour-btn").addEventListener("click", () => {
    serieContainer.innerHTML = "";
    fetchAllPopularSeries();
  });

  const commentForm = document.getElementById("comment-form");
  const commentsList = document.getElementById("comments-list");

  const localStorageKey = `comments_${serie.id}`;

  //  Charger les commentaires  depuis le Storage
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

  //  Gestion de l'envoi du formulaire
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

      // Réinitialiser le formulaire
      nameInput.value = "";
      commentInput.value = "";
    }
  });
};

