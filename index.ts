import { writeFile } from 'fs/promises';

interface Movie {
    id: number;
    title: string;
    posterURL: string;
    imdbId: string;
}

async function fetchComedyMovies(): Promise<Movie[]> {
    const url = 'https://api.sampleapis.com/movies/comedy';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch comedy movies: ", error);
        return []; 
    }
}

function generateHTML(movies: Movie[]): string {
    const moviesHTML = movies.map(movie => `
        <div class="movie">
            <img src="${movie.posterURL}" alt="Poster for ${movie.title}">
            <h4>${movie.title}</h4>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comedy Movies</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <h1>Comedy Movies</h1>
            <div class="container">${moviesHTML}</div>
        </body>
        </html>
    `;
}

async function createHTMLFile() {
    const movies = await fetchComedyMovies();
    if (movies.length > 0) {
        const html = generateHTML(movies);
        await writeFile('index.html', html);
        console.log('HTML file has been created successfully.');
    } else {
        console.log("No movies to display.");
    }
}

createHTMLFile();
