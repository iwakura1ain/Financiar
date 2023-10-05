import {useState, useEffect} from "react"

import {StockInfoItem} from "./StockInfoItem.jsx"
import {SearchBar} from "./Searchbar.jsx"
import {StockGraphBox} from "./StockGraph.jsx"


export function StockInfoListing() {
    const [searchName, setSearchName] = useState("")
    const [searchSector, setSearchSector] = useState("")
    const [stocks, setStocks] = useState([])
    const [selected, setSelected] = useState({})

    const [paginateNext, setPaginateNext] = useState("")
    const [paginatePrev, setPaginatePrev] = useState("")
    const [pressedNext, setPressedNext] = useState(false)
    const [pressedPrev, setPressedPrev] = useState(false)

    
    const baseUrl="/api/fdr/stocks"
    useEffect(() => {
        console.log("fetching")

        let fetchUrl = `${baseUrl}?name=${searchName}&sector=${searchSector}`
        fetch(fetchUrl, { headers:{accept: 'application/json'} })
            .then(response => (response.json()))
            .then(json => {
                console.log(json)
                return json
            })
            .then(json => {
                setPaginateNext(json.next)
                setPaginatePrev(json.previous)
                setStocks(json.results)
            })
            .catch(console.log)

    }, [searchSector, searchName])

    useEffect(() => {
        if (!pressedNext || paginateNext == null)
            return
        setPressedNext(false)
        
        let nextUrl = new URL(paginateNext);
        let nextPage = nextUrl.searchParams.get("page")
        
        console.log(`fetching ${nextPage}`)
        let fetchUrl = `${baseUrl}?name=${searchName}&sector=${searchSector}`
        fetch(`${fetchUrl}&page=${nextPage}`, { headers:{accept: 'application/json'} })
            .then(response => (response.json()))
            .then(json => {
                console.log(json)
                return json
            })
            .then(json => {
                setPaginateNext(json.next)
                setPaginatePrev(json.previous)
                setStocks(json.results)
            })
            .catch(console.log)

    }, [pressedNext])

    useEffect(() => {
        if (!pressedPrev || paginatePrev == null)
            return
        setPressedPrev(false)
        
        let prevUrl = new URL(paginatePrev);
        let prevPage = prevUrl.searchParams.get("page")
        if (prevPage == null)
            prevPage = 1
        
        console.log(`fetching ${prevPage}`)
        let fetchUrl = `${baseUrl}?name=${searchName}&sector=${searchSector}`
        fetch(`${fetchUrl}&page=${prevPage}`, { headers:{accept: 'application/json'} })
            .then(response => (response.json()))
            .then(json => {
                console.log(json)
                return json
            })
            .then(json => {
                setPaginateNext(json.next)
                setPaginatePrev(json.previous)
                setStocks(json.results)
            })
            .catch(console.log)
    }, [pressedPrev])
    
    return (
        <>
          <section  id="testimonials">

            <div className="container width-full">
              
              <div className="title-block animated fadeInDown">
                <h2>The Best Digital Agencies Recommend Our Software</h2>
                <p>Industry experts mention their experience using our software and the excellent results they have achieved</p>
              </div>

              <StockGraphBox selected={selected} setSelected={setSelected}/>

              <SearchBar
                name={searchName}
                setName={setSearchName}
                sector={searchSector}
                setSector={setSearchSector}
              />
              
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
              <div className="navigation">
                <button className="navigation-button" onClick={() => {
                    console.log("PRESSED PREV")
                    setPressedPrev(true)
                }}>Prev</button>
                <button className="navigation-button" onClick={() => {
                    console.log("PRESSED NEXT")
                    setPressedNext(true)
                }}>Next</button>
                
              </div>
            </div>
          </section>
          

        </>
    )
}
