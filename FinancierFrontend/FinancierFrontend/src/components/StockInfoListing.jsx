import {useState, useEffect} from "react"

import {StockInfoItem} from "./StockInfoItem.jsx"
import {SearchBar} from "./Searchbar.jsx"
import {StockGraphBox} from "./StockGraph.jsx"

//import {StockAPIRoute} from "../APIRoutes.jsx"

export function StockInfoListing() {
    const [search, setSearch] = useState("")
    const [stocks, setStocks] = useState([])
    const [selected, setSelected] = useState({})

    useEffect(() => {
        console.log("fetching")
        fetch("/api/fdr/stocks", { headers:{accept: 'application/json'} })
            .then(response => (response.json()))
            .then(json => {
                console.log(json)
                return json
            })
            .then(setStocks)
            .catch(console.log)
    }, [search])
    
    
    return (
        <>
          <section  id="testimonials">

            <div className="container width-full">
              
              <div className="title-block animated fadeInDown">
                <h2>The Best Digital Agencies Recommend Our Software</h2>
                <p>Industry experts mention their experience using our software and the excellent results they have achieved</p>
              </div>

              <StockGraphBox selected={selected} setSelected={setSelected}/>

              <SearchBar search={search} setSearch={setSearch}/>
              
              <div className="row">
                {stocks.map((stock, i) => (
                    <StockInfoItem
                      key={i}
                      selected={selected}
                      setSelected={setSelected}
                      {...stock}
                    />
                ))}

              </div>
            </div>
          </section>
          

        </>
    )
}
