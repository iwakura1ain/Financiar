export function SearchBar({name, setName, sector, setSector}) {
    return (
	<div className="searchbar-search-box animated fadeInDown">	  
	  <div className="single-searchbar-form">
	    <h3 className="searchbar-label">Name</h3>
	    <form action="index.html">
	      <input className="searchbar-input"
		     type="text"
                     placeholder="Ex: 3M, Apple, Microsoft"
                     onChange={(event) =>
                         setName(event.target.value)
                     }/>
	    </form>
	    <div className="searchbar-form-icon">
	      <i className="flaticon-list-with-dots"></i>
	    </div>
	  </div>

	  <div className="single-searchbar-form">
	    <h3 className="searchbar-label">Sector</h3>
	    <form action="index.html">
	      <input className="searchbar-input"
		     type="text"
                     placeholder="Ex: Electronics, Finance"
                     onChange={(event) =>
                         setSector(event.target.value)
                     }/>
	    </form>
	    <div className="searchbar-form-icon">
	      <i className="flaticon-gps-fixed-indicator"></i>
	    </div>
	  </div>

	  <button className="searchbar-btn" >search</button>
	</div>

    )
}
