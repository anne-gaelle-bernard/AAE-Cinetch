const apiKey = "acd658a6376438e3aa6631ccb18c6227";
const totalPages = 2; // Tu peux augmenter ça si tu veux plus de pages

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

        serieContainer.appendChild(serieDiv);
      });
    }
  } catch (error) {
    console.error("❌ Une erreur :", error);
    document.getElementById("serie-container").innerHTML = "<p>Impossible de charger les séries.</p>";
  }
};

fetchAllPopularSeries();
