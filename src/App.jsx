import { useState, useEffect } from 'react'
import { Search }  from './Components/Search'
import { Spinner } from './Components/Spinner'
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

  const fetchMovies = async() => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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

    }
    catch(error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [])

  return (
    <main>
      <div className="pattern" />

      <div className="container">
        <header>
          <img src="../public/hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className='text-gradient'>Movies</span> You Love To Watch Without the Hassle
          </h1>

          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <h1 className='text-white'>{searchQuery}</h1>
        </header>

        <section className='all-movies'>
          <h2 className='mt-[2.5rem]'>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {allMovies.map((movie) => (
                <p key={movie.id} className='text-white'>{movie.title}</p>
                // <li key={movie.id}>
                //   <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                //   <p>{movie.title}</p>
                // </li>
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