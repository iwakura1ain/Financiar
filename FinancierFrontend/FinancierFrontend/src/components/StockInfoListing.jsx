import {useState, useEffect} from "react"

import {StockInfoItem} from "./StockInfoItem.jsx"
import {SearchBar} from "./Searchbar.jsx"
import {StockGraphBox} from "./StockGraph.jsx"
import {GraphPictureInPicture} from "./GraphPictureInPicture.jsx"
import {LoadingDots} from "./LoadingVisual.jsx"

import InfiniteScroll from 'react-infinite-scroll-component';


export function StockInfoListing() {
    const [searchName, setSearchName] = useState("")
    const [searchSector, setSearchSector] = useState("")

    const [stocks, setStocks] = useState([])
    const [selected, setSelected] = useState()
    const [paginateNext, setPaginateNext] = useState("")

    const [stockData, setStockData] = useState()

    
    const baseUrl = "/api/fdr/stocks"

    const rateStock = (ticker) => {
        fetch(`/api/fdr/stocks/${ticker}/rate`, {headers:{method: "PUT", accept: 'application/json'}})
            .then(response => response.json())
            .then(json => {
                console.log(json)
                return json
            })
            .then((newStock) => setStocks(stocks.map(s => s.ticker !== ticker ? s : newStock)) )
            .catch(console.log)
    }

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
    
    return (
        <>
          <section id="testimonials">
            
            <div className="testimonials-container width-full">
              
              <div className="title-block animated fadeInDown">
                <h2 className='testimonials-title'>Financiar</h2>
                <p>Access all stocks anytime, anywhere, with ease.</p>
              </div>

              <StockGraphBox
                stockData={stockData}
                setStockData={setStockData}
                selected={selected}
                setSelected={setSelected}
              />
              
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
                      <LoadingDots />
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
                        rateStock={rateStock}
                        {...stock}
                      />
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          </section>
          
          <GraphPictureInPicture
            stockData={stockData}
            setStockData={setStockData}
            selected={selected}
            setSelected={setSelected}
          />

        </>
    )
}
