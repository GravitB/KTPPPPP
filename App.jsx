import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; 

function App() {
  const [movies, setMovies] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null); 

  const [songQuery, setSongQuery] = useState(''); 
  const [recommendations, setRecommendations] = useState(null);
  const [songLoading, setSongLoading] = useState(false); 
  const [songError, setSongError] = useState(null); 

  const API_KEY = 'c56e5fa6';

  useEffect(() => {
    if (!searchQuery) return;

    setLoading(true);
    fetch(`https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.Response === 'True' ? data.Search : []);
        setError(data.Response === 'False' ? 'No movies found' : null);
      })
      .catch(() => setError('Error fetching data'))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const fetchMovieDetails = async (imdbID) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setSelectedMovie(data);s
      } else {
        setError('No details available for this movie.');
      }
    } catch (error) {
      setError('Error fetching movie details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSongRecommendations = async () => {
    if (!songQuery) {
      setSongError('Please enter a song query.');
      return;
    }

    setSongLoading(true);
    setSongError(null);
    setRecommendations(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/recommend', {
        song_query: songQuery,
      });
      const recommendedMovie = response.data.recommendations; 
      setRecommendations(recommendedMovie); 
      setSearchQuery(recommendedMovie);
    } catch (err) {
      setSongError('Error fetching recommendations. Please try again.');
      console.error(err);
    } finally {
      setSongLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Movie Search</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a movie..."
        className="search-input"
      />
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="movie-container">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="movie-card"
            onClick={() => fetchMovieDetails(movie.imdbID)} 
          >
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
              alt={movie.Title}
              className="movie-poster"
            />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={() => setSelectedMovie(null)}>
              &times;
            </button>
            <h2>{selectedMovie.Title}</h2>
            <p>{selectedMovie.Plot}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
            <p><strong>Rating:</strong> {selectedMovie.imdbRating}</p>
          </div>
        </div>
      )}

      <h1 className="title">Song-Based Movie Recommendations</h1>
      <input
        type="text"
        value={songQuery}
        onChange={(e) => setSongQuery(e.target.value)}
        placeholder="Enter a song to get movie recommendations..."
        className="search-input"
      />
      <button onClick={fetchSongRecommendations} className="search-button">
        Get Recommendations
      </button>

      {songLoading && <p className="loading">Loading...</p>}
      {songError && <p className="error-message">{songError}</p>}

      {recommendations && (
        <div className="recommendations">
          <h2>Movie Recommendations:</h2>
          <p>{recommendations}</p>
        </div>
      )}
    </div>
  );
}

export default App;
