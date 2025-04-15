const fetchSeries = async () => {
  try {
    const response = await fetch('./serie.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching series:', error);
  }
};

// Appel de la fonction
fetchSeries();