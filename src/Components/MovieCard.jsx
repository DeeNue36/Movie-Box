import React from 'react'
import { useNavigate } from 'react-router-dom'

export const MovieCard = ({movie: {id, title, vote_average, release_date, poster_path, original_language}, onClick }) => {
    const navigateTo = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick(id);
        }
        navigateTo(`/movie/${id}`);
    }

    return (
        <div className='movie-card' onClick={handleClick}>
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/No-Movie-Poster.png'} alt={title} />

            <div className='mt-4'>
                <h3>{title}</h3>
            </div>

            <div className="content">
                <div className="rating">
                    <img src="/star.svg" alt="star" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>

                <span>•</span>
                <p className="lang">{original_language.toUpperCase()}</p>

                <span>•</span>
                <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
            </div>
        </div>
    )
}
