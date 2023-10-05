//import {logo} from "../assets/images/logo.png"
// import NavBarItem from './NavbarItem.jsx' 

import { useState } from "react"

export function NavBar() {
    // const menuItems = ["home", "default"]
    // const logo = "/src/assets/images/logo.png"
    const [burger_class, setBurgerClass] = useState("burger-bar unclicked")
    const [menu_class, setMenuClass] = useState("menu hidden")
    const [isMenuClicked, setIsMenuClicked] = useState(false)
    
    const updateMenu = () => {
      if(!isMenuClicked) {
        setBurgerClass("burger-bar clickced")
        setMenuClass("menu visible")
      }
      else {
        setBurgerClass("burger-bar unclicked")
        setMenuClass("menu hidden")
      }
      setIsMenuClicked(!isMenuClicked)
    }

    return (
        <>
        <nav className="navbar navbar-default navbar-expand-lg fixed-top custom-navbar">
          <div className="navbar-container">
            <div className='navbar-hamburger' onClick={updateMenu}>
              <div className={burger_class} ></div>
              <div className={burger_class} ></div>
              <div className={burger_class} ></div>
            </div>
            <div className='navbar-logo'>Financiar</div>
            <div className='navbar-dummy'>DUMMY</div>
          </div>
          <div className={menu_class}></div>

            {/* <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="icon ion-md-menu"></span>
              <img src={logo} className="img-fluid nav-logo-mobile" alt="Company Logo"></img>
            </button> */}

            {/* <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <div className="container">
                <img src={logo} className="img-fluid nav-logo-desktop" alt="Company Logo"></img>
                <ul className="navbar-nav ml-auto nav-right" data-easing="easeInOutExpo" data-speed="1250" data-offset="65">
                  {menuItems.map((item, i) => (
                      <NavBarItem key={i} menuItem={item}/>
                  ))}
                </ul>
              </div>
            </div> */}
        </nav>
        </>
    )
    
}
