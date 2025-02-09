const OMDB_API_KEY = "83a84361"; 
const YOUTUBE_API_KEY = "AIzaSyDVyUEFK_hfQLuE0Aw_-95uQU8RR0slguM"; 

document.getElementById("searchButton").addEventListener("click", async () => {
    const movieName = document.getElementById("movieInput").value.trim();
    if (!movieName) return alert("Please enter a movie name!");

    document.getElementById("movieResults").innerHTML = "<p>Loading movies...</p>";

    const movieDetails = await fetchMovies(movieName);
    displayMovieDetails(movieDetails);
});

// Fetch Multiple Movies from OMDB
async function fetchMovies(title) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${OMDB_API_KEY}`);
        const data = await response.json();
        return data.Response === "True" ? data.Search : [];
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return [];
    }
}

// Fetch Movie Trailer from YouTube
async function fetchYouTubeTrailer(title) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${title} official trailer&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`);
        const data = await response.json();
        return data.items.length ? `https://www.youtube.com/embed/${data.items[0].id.videoId}` : null;
    } catch (error) {
        console.error("Error fetching trailer:", error);
        return null;
    }
}

// Display Multiple Movie Search Results
function displayMovieDetails(movies) {
    const resultsDiv = document.getElementById("movieResults");

    if (movies.length === 0) {
        resultsDiv.innerHTML = "<p>No movies found.</p>";
        return;
    }

    resultsDiv.innerHTML = movies.map(movie => {
        return `
            <div class="movie" onclick="openMovieModal('${movie.Title}')">
                <h2>${movie.Title} (${movie.Year})</h2>
                <img src="${movie.Poster}" alt="${movie.Title}">
                <p><strong>Genre:</strong> ${movie.Type}</p>
            </div>
        `;
    }).join("");
}

// Open Movie Modal with Trailer & Details
async function openMovieModal(movieTitle) {
    const movieDetails = await fetchMovieDetails(movieTitle);
    const trailerUrl = await fetchYouTubeTrailer(movieTitle);

    if (!movieDetails) {
        alert("Movie details not available.");
        return;
    }

    document.getElementById("modalContent").innerHTML = `
        <h2>${movieDetails.Title} (${movieDetails.Year})</h2>
        <img src="${movieDetails.Poster}" alt="${movieDetails.Title}">
        <p><strong>Genre:</strong> ${movieDetails.Genre}</p>
        <p><strong>IMDB Rating:</strong> ${movieDetails.imdbRating}</p>
        <p><strong>Plot:</strong> ${movieDetails.Plot}</p>
        <p><strong>Reviews:</strong> ${movieDetails.imdbVotes}</p>
        ${trailerUrl ? `<iframe width="100%" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>` : "<p>Trailer not found.</p>"}
    `;

    // Show the modal with animation
    const modal = document.getElementById("movieModal");
    modal.classList.add("open");
}

// Fetch Detailed Movie Data from OMDB (For Modal)
async function fetchMovieDetails(title) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${OMDB_API_KEY}`);
        const data = await response.json();
        return data.Response === "True" ? data : null;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
}

// Open the Modal (for demonstration purposes)
function openModal() {
    const modal = document.getElementById("movieModal");
    modal.classList.add("open"); // Makes the modal visible
}

// Close the Modal when the close button is clicked
document.getElementById("closeModalButton").addEventListener("click", function() {
    const modal = document.getElementById("movieModal");
    modal.classList.remove("open"); // Closes the modal by removing the 'open' class
});

// Optionally, you can also close the modal if the background (outside modal) is clicked:
document.getElementById("movieModal").addEventListener("click", function(e) {
    if (e.target === this) {
        this.classList.remove("open");
    }
});
