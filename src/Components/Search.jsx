import React from 'react'

export const Search = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="search">
            <div>
                <img src="../../public/search.svg" alt="Search Icon" />

                <input 
                    type="text"
                    placeholder="What would you like to watch today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
            </div>
        </div>
    )
}
