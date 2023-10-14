import {useState, useEffect} from "react"

import {StockInfoItem} from "./StockInfoItem.jsx"
import {SearchBar} from "./Searchbar.jsx"
import {StockGraphBox} from "./StockGraph.jsx"
import {GraphPictureInPicture} from "./GraphPictureInPicture.jsx"

import InfiniteScroll from 'react-infinite-scroll-component';


export function StockInfoListing() {
    const [searchName, setSearchName] = useState("")
    const [searchSector, setSearchSector] = useState("")
    const [stocks, setStocks] = useState([])
    const [selected, setSelected] = useState({})
    const [summary, setSummary] = useState("summary-hidden")  // WHAT? 

    const [paginateNext, setPaginateNext] = useState("")

    
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
                // setPaginatePrev(json.previous)
                setStocks(json.results)
            })
            .catch(console.log)


    }, [searchSector, searchName])

    const getNextPage = () => {        
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
                // setPaginatePrev(json.previous)
                setStocks(stocks.concat(json.results))
            })
            .catch(console.log)
    }

    const showSummary = () => {
      setSummary('summary-visible')
    }
    
    
    return (
        <>
          <section id="testimonials">

            <div className="testimonials-container width-full">

              <div className="title-block animated fadeInDown">
                <h2 className='testimonials-title' onMouseOver={showSummary}>Financiar</h2>
                <p className={summary}>Access all stocks anytime, anywhere, with ease.</p>
              </div>
              <StockGraphBox selected={selected} setSelected={setSelected}/>
              
              <SearchBar
                name={searchName}
                setName={setSearchName}
                sector={searchSector}
                setSector={setSearchSector}
              />

              <div className="row">
                <InfiniteScroll
                  className="row"
                  dataLength={stocks.length} //This is important field to render the next data
                  next={getNextPage}
                  hasMore={true}
                  loader={
                      <h4>Loading...</h4>
                  }
                  endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                      </p>
                  }
                >
                  {stocks.map((stock, i) => (
                      <StockInfoItem
                        key={i}
                        selected={selected}
                        setSelected={setSelected}
                        {...stock}
                      />
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          </section>
          
        <GraphPictureInPicture selected={selected} setSelected={setSelected} />

        </>
    )
}
