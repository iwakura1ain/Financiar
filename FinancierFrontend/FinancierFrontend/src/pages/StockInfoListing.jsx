import {useState, useEffect} from "react"

import {StockInfoItem} from "../components/StockInfoItem.jsx"
import {SearchBar} from "../components/Searchbar.jsx"
import {StockGraphBox} from "../components/StockGraph.jsx"
import {PIPGraphBox} from "../components/PicInPicGraph.jsx"
import {TradeDataLoader2} from "../components/TradeDataLoader.jsx"
import {LoadingDots} from "../components/LoadingVisual.jsx"
import {getDefaultDate} from "../components/Utils.jsx"

import InfiniteScroll from 'react-infinite-scroll-component';


export function StockInfoListing() {
    // ============= searchbar ====================
    const [searchName, setSearchName] = useState("")
    const [searchSector, setSearchSector] = useState("")

    // ============ stock listing =================
    const [stocks, setStocks] = useState([])
    const [selected, setSelected] = useState()
    const [selectedElement, setSelectedElement] = useState()
    const [paginateNext, setPaginateNext] = useState("")

    // ============= trade data for selected stock ===================
    const [stockData, setStockData] = useState()
    const [visibleOffset, setVisibleOffset] = useState([0, 180]) //  [a, b] => stockData.data: [ |---- b ---| ... a ... ]
    const [fetchingStatus, setFetchingStatus] = useState(false)
    const [startDate, setStartDate] = useState(getDefaultDate()[1])
    const [endDate, setEndDate] = useState(getDefaultDate()[0])
    

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

    useEffect(() => {
        console.log("STATUS", fetchingStatus)
    }, [fetchingStatus])

    return (
        <>
          <section id="testimonials">

            <TradeDataLoader2
              selected={selected}
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
              stockData={stockData} setStockData={setStockData}
              visibleOffset={visibleOffset} setVisibleOffset={setVisibleOffset}
              fetchingStatus={fetchingStatus} setFetchingStatus={setFetchingStatus}
            />
            
            <div className="testimonials-container width-full">
              
              <div className="title-block animated fadeInDown">
                <h2 className='testimonials-title'>Financiar</h2>
                <p>Access all stocks anytime, anywhere, with ease.</p>
              </div>

              <StockGraphBox
                barchartId={200}
                stockData={stockData} setStockData={setStockData}
                visibleOffset={visibleOffset} setVisibleOffset={setVisibleOffset}
                selected={selected} setSelected={setSelected}
                fetchingStatus={fetchingStatus}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}                 
              />
              
              <SearchBar
                name={searchName}
                setName={setSearchName}
                sector={searchSector}
                setSector={setSearchSector}
              />

              <div className="stock-items">
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
                        selectedElement={selectedElement}
                        setSelectedElement={setSelectedElement}
                        {...stock}
                      />
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          </section>
          
          <PIPGraphBox
            selected={selected}             
            stockData={stockData}
            visibleOffset={visibleOffset}
          />

        </>
    )
}
