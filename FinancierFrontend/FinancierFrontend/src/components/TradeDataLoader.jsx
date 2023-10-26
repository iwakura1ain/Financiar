import {useState, useEffect} from 'react';

import {CustomToolTip} from './StockGraphToolTip.jsx'
import {LoadingDots} from "./LoadingVisual.jsx"


function CleanTradeData(trade) {
    const [bottom, area, color] =
          trade.Open < trade.Close ?
          [trade.Open, trade.Close-trade.Open, "red"] :
          [trade.Close, trade.Open-trade.Close, "blue"]

    return {
        ...trade,
        Bottom: bottom,
        Area: area,
        Color: color
    }
}


export function TradeDataLoader({
    selected,
    startDate, endDate, 
    stockData, setStockData,
    nextStockData, setNextStockData,
    fetchingStatus, setFetchingStatus,
}) {
    //const [fetchPage, setFetchPage] = useState(1)
    const [minDate, setMinDate] = useState()
    const [maxDate, setMaxDate] = useState()

    const [minFetchStart, setMinFetchStart] = useState()
    const [minFetchEnd, setMinFetchEnd] = useState()

    const [maxFetchStart, setMaxFetchStart] = useState(startDate)
    const [maxFetchEnd, setMaxFetchEnd] = useState(endDate)

    var fetchBuffer = []
    
    useEffect(() => {
        const newMinDate = new Date(startDate)
        const newMaxDate = new Date(endDate)

        if (newMinDate < minDate) {
            setMinFetchStart(newMinDate)
            setMinFetchEnd(minDate)
        }
        
        if (maxDate < newMaxDate) {
            setMaxFetchStart(maxDate)
            setMaxFetchEnd(newMaxDate)

        }
    }, [startDate, endDate])
    
    useEffect(() => {
        if (selected === undefined){
            setStockData()
            return
        }
        
        setStockData()
    }, [selected])
    
    const fetchData = async ( start, end, next) => {
        if (start === undefined || end === undefined) {
            return 0
        }

        let nextPage = next
        await fetch(`/api/fdr/stocks/${selected}?start=${start}&end=${end}&page=${nextPage}`, { headers:{accept: 'application/json'} })
            .then(response => response.json())
            .then((json) => { // get next page
                console.log("FETCHED", next)
                
                if (json.next !== null) {
                    const nextUrl = new URL(json.next)                    
                    nextPage = nextUrl.searchParams.get("page")
                }
                else {
                    nextPage = 0
                }
                
                return json
            })
            .then((json) => {
                //console.log(json.data)
                fetchBuffer = [...fetchBuffer, ...json.data]
                return json
            })
            .then((json) => { // TODO: original stockData remains unchanged!!!
                console.log("STOCKDATA STATUS", stockData)
                if (stockData == undefined) {
                    setStockData(json)
                }

                return 
            })
            .catch(console.log)

        return nextPage
    }

    const setDates = () => { //TODO: using buffer instead of stockData here
        setMinDate(new Date(fetchBuffer[0].Date))
        setMaxDate(new Date(fetchBuffer.slice(-1).Date))
        setFetchingStatus(!fetchingStatus)            
    }
    
    useEffect(() => {
        (async () => {
            if (selected === undefined || fetchingStatus)
                return
            await setFetchingStatus(!fetchingStatus)
            
            var tempStockData = stockData ? stockData.data : []
            var nextPage = 1

            fetchBuffer = []
            do {                
                nextPage = await fetchData(minFetchStart, minFetchEnd, nextPage)
                await setStockData({
                    ...stockData,
                    data: [...fetchBuffer, ...tempStockData]
                })

                console.log("Changed", stockData)
            } while (nextPage != 0)

            tempStockData = stockData ? stockData.data : [];
            nextPage = 1
            
            fetchBuffer = []
            do {
                nextPage = await fetchData(maxFetchStart, maxFetchEnd, nextPage)
                await setStockData({
                    ...stockData,
                    data: [...tempStockData, ...fetchBuffer]
                })

                console.log("Changed", stockData)
            } while (nextPage != 0)

            
            await setDates()
        })()
    }, [selected, minFetchStart, minFetchEnd, maxFetchStart, maxFetchEnd])

    return (<></>)            
}
