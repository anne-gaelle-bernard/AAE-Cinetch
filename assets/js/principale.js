// Point d’entrée principal du projet
import { fetchSeriesByPage } from "./api.js";
import { setupPagination, setupSearch } from "./interface.js";

export let currentPage = 1;
export const totalPages = 10;

window.addEventListener("DOMContentLoaded", () => {
  fetchSeriesByPage(currentPage);
  setupPagination();
  setupSearch();
});
