import { useState, useEffect } from 'react'
import { Search }  from './Components/Search'
import { Spinner } from './Components/Spinner'
import { MovieCard } from './Components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';
import './App.css'

// const API_BASE_URL = 'https://api.themoviedb.org/3/discover/movie';
const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const[errorMessage, setErrorMessage] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term/query to avoid unnecessary API calls by waiting for the user to stop typing for 500ms(0.5 seconds)
  useDebounce(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500, [searchQuery]);

  const fetchMovies = async(query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setAllMovies([]);
        return;
      }
      setAllMovies(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    }
    catch(error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
    finally {
      setIsLoading(false);
    }
  }

  const fetchTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    }
    catch(error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchTrendingMovies();
  }, [])

  return (
    <main>
      <div className="pattern" />

      <div className="container">
        <header>
          <img src="/hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className='text-gradient'>Movies</span> You Love To Watch Without the Hassle
          </h1>

          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending-movies'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {allMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )
          }

        </section>
      </div>
    </main>
  )
}

export default App