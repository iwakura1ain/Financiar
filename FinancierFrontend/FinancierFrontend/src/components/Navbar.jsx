//import {logo} from "../assets/images/logo.png"
import NavBarItem from './NavbarItem.jsx' 

export function NavBar() {
    const menuItems = ["home", "default"]
    const logo = "/src/assets/images/logo.png"
    
    return (
        <>
        <nav className="navbar navbar-default navbar-expand-lg fixed-top custom-navbar">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="icon ion-md-menu"></span>
              <img src={logo} className="img-fluid nav-logo-mobile" alt="Company Logo"></img>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <div className="container">
                <img src={logo} className="img-fluid nav-logo-desktop" alt="Company Logo"></img>
                <ul className="navbar-nav ml-auto nav-right" data-easing="easeInOutExpo" data-speed="1250" data-offset="65">
                  {menuItems.map((item, i) => (
                      <NavBarItem key={i} menuItem={item}/>
                  ))}
                </ul>
              </div>
            </div>
        </nav>
          
        </>
    )
    
}
