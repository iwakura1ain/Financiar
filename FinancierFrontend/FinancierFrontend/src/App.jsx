import './App.css'

import {Layout} from "./pages/Layout.jsx"
import {StockInfoListing} from "./pages/StockInfoListing.jsx"
import {BackTesting} from "./pages/BackTesting.jsx"

import {useState, useEffect} from "react"


import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
    const [register, setRegister] = useState(new Set())
    
    
    return (
        <>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<StockInfoListing register={register} setRegister={setRegister}/>} />
                <Route path="backtest" element={<BackTesting register={register} setRegister={setRegister}/>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </>
    )
}

export default App
