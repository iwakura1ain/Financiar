import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {NavBar} from "./components/Navbar.jsx"
import {StockInfoListing} from "./components/StockInfoListing.jsx"
import {Footer} from "./components/Footer.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
        <NavBar />
        
        <StockInfoListing />
        <Footer />
      </>
  )
}

export default App
