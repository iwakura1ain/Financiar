import { Outlet, Link } from "react-router-dom";
import {NavBar} from "./Navbar.jsx"
import {Footer} from "./Footer.jsx"
import {StockInfoListing} from "./StockInfoListing.jsx"
import {BackTesting} from "./BackTesting.jsx"
export const Layout = () => {
    return (
        <>
          <NavBar/>
          <Outlet/>
          <Footer/>
        </>
    )
};


