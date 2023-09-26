export function SearchBar() {
    return (
        <div className="searchbar-serch-box animated fadeInDown">
	  <div className="searchbar-form">
	    <div className="single-searchbar-form">
	      <h3 className="searchbar-label">Name</h3>
	      <form action="index.html">
		<input type="text" placeholder="Ex: 3M, Apple, Microsoft" />
	      </form>
	      <div className="searchbar-form-icon">
		<i className="flaticon-list-with-dots"></i>
	      </div>
	    </div>
	    <div className="single-searchbar-form">
	      <h3 className="searchbar-label">Sector</h3>
	      <form action="index.html">
		<input type="text" placeholder="Ex: Electronics, Finance" />
	      </form>
	      <div className="searchbar-form-icon">
		<i className="flaticon-gps-fixed-indicator"></i>
	      </div>
	    </div>
	  </div>
	  <div className="searchbar-serch">
	    <button className="searchbar-btn" onclick="window.location.href='#'">
	      search  <i data-feather="search"></i> 
	    </button>
	  </div>
	</div>
    )
}
