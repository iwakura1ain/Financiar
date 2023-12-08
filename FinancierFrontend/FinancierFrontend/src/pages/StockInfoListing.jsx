import {useState, useEffect} from "react"

import {StockInfoItem} from "../components/StockInfoItem.jsx"
import {SearchBar} from "../components/Searchbar.jsx"
import {StockGraphBox} from "../components/StockGraph.jsx"
import {PIPGraphBox} from "../components/PicInPicGraph.jsx"
import {TradeDataLoader2} from "../components/TradeDataLoader.jsx"
import {LoadingDots} from "../components/LoadingVisual.jsx"
import {getDefaultDate, getDefaultVisibleOffset} from "../components/Utils.jsx"
import {backendURL} from "../components/Utils.jsx"

import InfiniteScroll from 'react-infinite-scroll-component';
// import { StockPreview } from "../components/StockPreview.jsx"



export function StockInfoListing({register, setRegister, width, setWidth}) {
    // ============= searchbar ====================
    const [searchName, setSearchName] = useState("")
    const [searchSector, setSearchSector] = useState("")

    // ============ stock listing =================
    const [stocks, setStocks] = useState([])
    const [selected, setSelected] = useState()
    const [paginateNext, setPaginateNext] = useState("")

    // ============ trade data ranges =================
    const [period, setPeriod] = useState("week")
    const [visibleOffset, setVisibleOffset] = useState(getDefaultVisibleOffset(period)) //  [a, b] => stockData.data: [ |---- b ---| ... a ... ]
    
    const defaultDates = getDefaultDate("week")
    const [startDate, setStartDate] = useState(defaultDates[0])
    const [endDate, setEndDate] = useState(defaultDates[1])
    
    // ============= trade data for selected stock ===================
    const [stockData, setStockData] = useState()
    const [fetchingStatus, setFetchingStatus] = useState(false)    

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
        const fetchUrl = `${backendURL}/api/fdr/stocks?name=${searchName}&sector=${searchSector}`
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
        const fetchUrl = `${backendURL}/api/fdr/stocks?name=${searchName}&sector=${searchSector}`
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
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
              period={period}
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
                period={period} setPeriod={setPeriod}
                fetchingStatus={fetchingStatus}
                register={register} setRegister={setRegister}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}        
                width={width} setWidth={setWidth}
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
                        register={register}
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
