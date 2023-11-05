import {useState, useEffect} from 'react';

const sectorList = ['Industrials',
                 'Health Care',
                 'Information Technology',
                 'Communication Services',
                 'Consumer Staples',
                 'Utilities',
                 'Financials',
                 'Materials',
                 'Real Estate',
                 'Consumer Discretionary',
                 'Energy']

export function SearchBar({name, setName, sector, setSector}) {
    const [searchName, setSearchName] = useState(name)
    const [searchSector, setSearchSector] = useState(sector)
    const [dropdownStatus, setDropdownStatus] = useState(false)

    const Dropdown = () => {
        if (dropdownStatus)
            return (
                <>
                  <button className="searchbar-button-wrapper" onClick={() => (setDropdownStatus(!dropdownStatus))}>
                    <img className="searchbar-dropdown-button" src="/src/assets/up.svg"></img>
                  </button>
                  <div className="searchbar-dropdown">
                    {sectorList.map((sectorItem, i) => 
                        (<button
                           className="searchbar-dropdown-item"
                           onClick={() => {
                               setSearchSector(sectorItem)
                               document.forms["searchbar-sector-form"].requestSubmit();
                               setDropdownStatus(false)
                           }}>
                           <h5 className="testimonials-name">{sectorItem}</h5>
                        </button>)
                    )}
                  </div>
                </>
            )

        return (
            <button className="searchbar-button-wrapper" onClick={() => (setDropdownStatus(!dropdownStatus))}>
              <img className="searchbar-dropdown-button" src="/src/assets/down.svg"></img>
            </button>
        )
    }
    
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
                }/>              
              
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
            }}
                  name="searchbar-sector-form">
	      <input
                className="searchbar-input"
	    	type="text"
                placeholder="Ex: Electronics, Finance"
                value={searchSector}
                onChange={(event) =>
                    setSearchSector(event.target.value)
                }
              />
              
              <Dropdown />
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
