import './App.css'


import {Layout} from "./pages/Layout.jsx"
import {StockInfoListing} from "./pages/StockInfoListing.jsx"
import {BackTesting} from "./pages/BackTesting.jsx"


import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
    return (
        <>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<StockInfoListing />} />
                <Route path="backtest" element={<BackTesting />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </>
    )
}

export default App
