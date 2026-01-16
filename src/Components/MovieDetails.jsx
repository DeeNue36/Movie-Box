import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Spinner } from './Spinner'
import { API_BASE_URL, API_OPTIONS } from '../api'


export const MovieDetails = () => {
    const { id } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const endpoint = `${API_BASE_URL}/movie/${id}?append_to_response=credits`
                const response = await fetch(endpoint, API_OPTIONS);

                if(!response.ok) {
                    throw new Error('Failed to fetch movie details');
                }

                const movieData = await response.json();
                
                if (movieData.response === 'False') {
                    setErrorMessage(movieData.Error || 'Failed to fetch movie details');
                    setMovieDetails(null);
                    return;
                }
                setMovieDetails(movieData || null);
            } 
            catch (error) {
                console.error(`Error fetching movie details: ${error}`);
                setErrorMessage('Error fetching movie details. Please try again later.');
            }
            finally {
                setIsLoading(false);
            }
        }

        getMovieDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="movie-details-page">
                <div className="movie-details-container">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (errorMessage || !movieDetails) {
        return (
            <div className="movie-details-page">
                <div className="movie-details-container">
                    <Link to="/" className="back-btn">
                        ← Back to Movies
                    </Link>
                    <p className="error-message">{errorMessage || 'Movie not found'}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="movie-details-page">
            <div className="pattern" />

            <div className="movie-details-container">
                <Link to="/" className="back-btn">
                    ← Back to Movies
                </Link>

                <div className="movie-details-content">
                    <div className="movie-details-image">
                        <img src={movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : '/No-Movie-Poster.png'} alt={movieDetails.title} />
                    </div>

                    <div className="movie-details-info">
                        <h1>{movieDetails.title}</h1>
                        <p className="movie-status">Status: {movieDetails.status}</p>
                        <p className="movie-release-date">Release Date: {movieDetails.release_date ? movieDetails.release_date : 'N/A'}</p>

                        {movieDetails.tagline && <p className="tagline">"{movieDetails.tagline}"</p>}

                        <div className="movie-meta">
                            <div className="rating">
                                <img src="/star.svg" alt="star" />
                                <p>{movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : 'N/A'}</p>
                            </div>

                            <span>•</span>
                            <p className="lang">{movieDetails.original_language.toUpperCase()}</p>

                            <span>•</span>
                            <p className="year">{movieDetails.release_date ? movieDetails.release_date.split('-')[0] : 'N/A'}</p>
                            {movieDetails.runtime && (
                                <>
                                    <span>•</span>
                                    <p className="runtime">{movieDetails.runtime} minutes</p>
                                </>
                            )}
                        </div>

                        <div className="movie-budget">
                            <h3>Budget:
                                <span>{movieDetails.budget ? `$${movieDetails.budget.toLocaleString()}` : 'N/A'}</span>
                            </h3>
                        </div>

                        <div className="movie-overview">
                            <h3>Overview</h3>
                            <p>{movieDetails.overview || 'No overview available.'}</p>
                        </div>

                        {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                            <div className="movie-production-companies">
                                <h3>Production Companies</h3>
                                <div className="companies-list">
                                    {movieDetails.production_companies.map((company) => (
                                        <div className="company-card">
                                            <span className="company-name">{company.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {movieDetails.genres && movieDetails.genres.length > 0 && (
                            <div className="movie-genres">
                                <h3>Genres</h3>
                                <ul className="genres-list">
                                    {movieDetails.genres.map((genre) => (
                                        <li key={genre.id} className="genre-tag">
                                            {genre.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {movieDetails.homepage && (
                            <a href={movieDetails.homepage} target="_blank" rel="noopener noreferrer" className="movie-homepage-link">
                                Visit Official Website →
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
