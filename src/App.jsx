import { Search }  from './Components/Search'
import { useState } from 'react'
import './App.css'


const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
      </div>
    </main>
  )
}

export default App