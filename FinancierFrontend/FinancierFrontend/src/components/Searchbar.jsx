import {useState, useEffect} from 'react';

export function SearchBar({name, setName, sector, setSector}) {
    const [searchName, setSearchName] = useState(name)
    const [searchSector, setSearchSector] = useState(sector)
    
    return (
	<div className="searchbar-search-box animated fadeInDown">
          
	  <div className="single-searchbar-form">
	    <h3 className="searchbar-label">Name</h3>
	    <form onSubmit={(event) => {
                event.preventDefault();
                setName(searchName)
            }}>
	      <input
                className="searchbar-input"
		type="text"
                placeholder="Ex: 3M, Apple, Microsoft"
                value={searchName}
                onChange={(event) =>
                    setSearchName(event.target.value)
                }
                
              />              
            </form>
	    
	    <div className="searchbar-form-icon">
	      <i className="flaticon-list-with-dots"></i>
	    </div>
	  </div>

	  <div className="single-searchbar-form">
	    <h3 className="searchbar-label">Sector</h3>
	    <form onSubmit={(event) => {
                event.preventDefault();
                setSector(searchSector)
            }}>
	      <input
                className="searchbar-input"
		type="text"
                placeholder="Ex: Electronics, Finance"
                value={searchSector}
                onChange={(event) =>
                    setSearchSector(event.target.value)
                }                
              />
            </form>
	    
	    <div className="searchbar-form-icon">
	      <i className="flaticon-gps-fixed-indicator"></i>
	    </div>
	  </div>

	  <button
            className="searchbar-btn"
            onClick={() => {
                setSearchName("")
                setSearchSector("")
                setName("")
                setSector("")
                
            }}
          >
            Clear
          </button>

	</div>

    )
}
