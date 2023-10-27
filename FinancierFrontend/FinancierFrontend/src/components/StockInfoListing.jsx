import {useState, useEffect} from "react"

import {StockInfoItem} from "./StockInfoItem.jsx"
import {SearchBar} from "./Searchbar.jsx"
import {StockGraphBox} from "./StockGraph.jsx"
import {PIPGraphBox} from "./PicInPicGraph.jsx"
import {TradeDataLoader2} from "./TradeDataLoader.jsx"
import {LoadingDots} from "./LoadingVisual.jsx"

import InfiniteScroll from 'react-infinite-scroll-component';


function GetDefaultDate() {    
    // Create a date object from a date string
    var date = new Date();

    var prevDate = new Date();
    prevDate.setFullYear(date.getFullYear() - 1);

    const getFormatted = (date) => {
        // Get year, month, and day part from the date
        var year = date.toLocaleString("default", { year: "numeric" });
        var month = date.toLocaleString("default", { month: "2-digit" });
        var day = date.toLocaleString("default", { day: "2-digit" });

        return year + "-" + month + "-" + day;
    }
    
    return [getFormatted(date), getFormatted(prevDate)]
}

export function StockInfoListing() {
    // ============= searchbar ====================
    const [searchName, setSearchName] = useState("")
    const [searchSector, setSearchSector] = useState("")

    // ============ stock listing =================
    const [stocks, setStocks] = useState([])
    const [selected, setSelected] = useState()
    const [paginateNext, setPaginateNext] = useState("")

    // ============= trade data for selected stock ===================
    const [stockData, setStockData] = useState()
    //const [nextStockData, setNextStockData] = useState(0)
    const [fetchingStatus, setFetchingStatus] = useState(false)
    const [startDate, setStartDate] = useState(GetDefaultDate()[1])
    const [endDate, setEndDate] = useState(GetDefaultDate()[0])

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
    
    return (
        <>
          <section id="testimonials">

            <TradeDataLoader2
              selected={selected}
              startDate={startDate} endDate={endDate}
              stockData={stockData} setStockData={setStockData}
              fetchingStatus={fetchingStatus} setFetchingStatus={setFetchingStatus}
            />

            {/* <TradeDataLoader */}
            {/*   selected={selected} */}
            {/*   startDate={startDate} endDate={endDate} */}
            {/*   stockData={stockData} setStockData={setStockData} */}
            {/*   nextStockData={nextStockData} setNextStockData={setNextStockData} */}
            {/*   fetchingStatus={fetchingStatus} setFetchingStatus={setFetchingStatus} */}
            {/* /> */}
            
            <div className="testimonials-container width-full">
              
              <div className="title-block animated fadeInDown">
                <h2 className='testimonials-title'>Financiar</h2>
                <p>Access all stocks anytime, anywhere, with ease.</p>
              </div>

              <StockGraphBox
                stockData={stockData} setStockData={setStockData}
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
          
          <PIPGraphBox
            stockData={stockData}
          />

        </>
    )
}
