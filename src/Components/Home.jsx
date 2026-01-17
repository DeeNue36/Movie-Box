import { useState, useEffect } from 'react'
import { Search }  from './Search.jsx'
import { Spinner } from './Spinner'
import { MovieCard } from './MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from '../appwrite';
import { API_BASE_URL, API_OPTIONS } from '../api.js';

export const Home = ({ onMovieClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [allMovies, setAllMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);

    // States to track pages and total number of movies
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [totalPages, setTotalPages] = useState(0); // Total number of pages from API response
    const [totalMovies, setTotalMovies] = useState(0); // Total number of movie results from API response

    // Debounce the search term/query to avoid unnecessary API calls by waiting for the user to stop typing for 500ms(0.5 seconds)
    useDebounce(() => {
        setDebouncedSearchQuery(searchQuery);
    }, 1000, [searchQuery]);

    const fetchMovies = async(query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
        const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

        const response = await fetch(endpoint, API_OPTIONS);
        if(!response.ok) {
            throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        console.log(data);

        if(data.response === 'False') {
            setErrorMessage(data.Error || 'Failed to fetch movies');
            setAllMovies([]);
            return;
        }
        setAllMovies(data.results || []);
        setTotalPages(data.total_pages || 0); // store the number of pages
        setTotalMovies(data.total_results || 0); // store the number of movie results

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
        fetchMovies(debouncedSearchQuery, currentPage);
    }, [debouncedSearchQuery, currentPage]);

    useEffect(() => {
        fetchTrendingMovies();
    }, []);

    // Pagination Functions
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


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
                        <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie.id)}/>
                    ))}
                    </ul>
                )
                }
                
                {totalPages > 1 && (
                    <div className="pagination">
                        {/* Previous Button */}
                        <button 
                            className="pagination-btn"
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                        >
                            ← Previous
                        </button>
                        
                        {/* Page Number */}
                        <span className="page-info">
                            <span className="page-no">
                                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                            </span>
                            {totalMovies > 0 && (
                                <p className="results-count">
                                    Showing {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalMovies)} of <strong>{totalMovies.toLocaleString()}</strong> movies
                                </p>
                            )}

                        </span>

                        {/* Next Button */}
                        <button 
                            className="pagination-btn"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                )
                }
            </section>

        </div>
        </main>
    )
}