import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Components/Home';
import { MovieDetails } from './Components/MovieDetails';
import './App.css'


const App = () => {
  const [movieDetails, setMovieDetails] = useState(null);

  const handleMovieClick = (movieId) => {
    setMovieDetails(movieId);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onMovieClick={handleMovieClick}/>} />
        <Route path="/movie/:id" element={<MovieDetails movieDetails={movieDetails} />} />
      </Routes>
    </Router>
  )
}

export default App