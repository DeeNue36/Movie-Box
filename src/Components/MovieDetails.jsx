import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Spinner } from './Spinner'


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
