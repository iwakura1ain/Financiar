//import {logo} from "../assets/images/logo.png"
// import NavBarItem from './NavbarItem.jsx'

import { Outlet, Link } from "react-router-dom";
import {StockInfoListing} from "./StockInfoListing.jsx"
import {BackTesting} from "./BackTesting.jsx"

export function NavBar() {

    return (
        <>
        <nav className="navbar navbar-default navbar-expand-lg fixed-top custom-navbar">
        {/* <nav className="custom-navbar"> */}
          <div className="navbar-container">
            <div className='navbar-logo'>
              <Link to="/">Financiar</Link>
            </div>
            <div className='navbar-logo'>
              <Link to="/backtest">BackTesting</Link>
            </div>
          </div>


        </nav>
        </>
    )    
}
