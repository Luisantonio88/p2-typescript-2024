import { writeFile } from "fs/promises";

interface Movie {
  id: number;
  title: string;
  posterURL: string;
  imdbId: string;
}

async function fetchMovies(): Promise<Movie[]> {
  const url = "https://api.sampleapis.com/movies/animation";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch movies: ", error);
    return [];
  }
}

function generateMainHTML(movies: Movie[]): string {
  const movieHTML = movies
    .map(
      (movie) => `
        <div class="movie">
            <a href="movie-${movie.id}.html">
                <img class="image" src="${movie.posterURL}" alt="Poster for ${movie.title}">
                <h4>${movie.title}</h4>
            </a>
        </div>
    `
    )
    .join("");

  return `
        <html>
        <head><title>Movies</title><link rel="stylesheet" href="styles.css"></head>
        <body>
            <h1>Movies</h1>
            <div class="container">${movieHTML}</div>
        </body>
        </html>
    `;
}

async function generateDetailedHTML(movie: Movie): Promise<string> {
  return `
        <html>
        <head>
            <title>${movie.title}</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <div class="moviebig">
            <h2>${movie.title}</h2>
            <img class="imagebig" src="${movie.posterURL}" alt="Poster for ${movie.title}">
            <a href="https://www.imdb.com/title/${movie.imdbId}/" target="_blank">
            <img id="imdb" src="./imdb.svg" alt="IMDb">
            </a>
            <a href="index.html">Back to list</a>
            </div>
        </body>
        </html>
    `;
}

async function createHTMLFiles(movies: Movie[]) {
  for (const movie of movies) {
    const html = await generateDetailedHTML(movie);
    await writeFile(`movie-${movie.id}.html`, html);
  }
  const mainHtml = generateMainHTML(movies);
  await writeFile("index.html", mainHtml);
  console.log("All HTML files have been created successfully.");
}

async function init() {
  const movies = await fetchMovies();
  if (movies.length > 0) {
    await createHTMLFiles(movies);
  } else {
    console.log("No movies to display.");
  }
}

init();
