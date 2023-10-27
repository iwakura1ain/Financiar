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

function getFormatted(date) {
    if (date === undefined)
        return date
    
    var val = new Date(date);
    // Get year, month, and day part from the date
    var year = val.toLocaleString("default", { year: "numeric" });
    var month = val.toLocaleString("default", { month: "2-digit" });
    var day = val.toLocaleString("default", { day: "2-digit" });

    return year + "-" + month + "-" + day;
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
        setStockData()
    }, [selected])
    
    const fetchData = async (start, end, next, tempStockData, fetchBuffer) => {
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
            .then((json) => {
                if (stockData === undefined) {
                    setStockData(json)
                }
                
                setStockData(prevStockData => ({
                    ...prevStockData,
                    data: [...tempStockData, ...fetchBuffer]
                }))
            })
            .then((json) => { // TODO: original stockData remains unchanged!!!
                console.log("STOCKDATA STATUS", stockData)

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
                await setStockData(prevStockData => ({
                    ...prevStockData,
                    data: [...fetchBuffer, ...tempStockData]
                }))

                console.log("Changed", stockData)
            } while (nextPage != 0)

            tempStockData = stockData ? stockData.data : [];
            nextPage = 1
            
            fetchBuffer = []
            do {
                nextPage = await fetchData(maxFetchStart, maxFetchEnd, nextPage, tempStockData, fetchBuffer)
                
                console.log("Changed", stockData)
            } while (nextPage != 0)

            
            await setDates()
        })()
    }, [selected, minFetchStart, minFetchEnd, maxFetchStart, maxFetchEnd])

    return (<></>)            
}



export function TradeDataLoader2({
    selected,
    startDate, endDate, 
    stockData, setStockData,
    nextStockData, setNextStockData,
    fetchingStatus, setFetchingStatus,
}) {

    const [fetchTarget, setFetchTarget] = useState(selected)    
    const [fetchBuffer, setFetchBuffer] = useState([])
    const [tempStockData, setTempStockData] = useState()

    const [prevStartDate, setPrevStartDate] = useState()
    const [prevEndDate, setPrevEndDate] = useState()
    
    const [minFetchStart, setMinFetchStart] = useState()
    const [minFetchEnd, setMinFetchEnd] = useState()
    const [minFetchNext, setMinFetchNext] = useState(0)

    const [maxFetchStart, setMaxFetchStart] = useState()
    const [maxFetchEnd, setMaxFetchEnd] = useState()
    const [maxFetchNext, setMaxFetchNext] = useState(0)

    const [cleanup, setCleanup] = useState(false)

    useEffect(() => {
        if (selected === undefined)
            return
        
        console.log("SELECTED", selected)
        setStockData()
        setFetchTarget(selected)
        setFetchingStatus(false)
        //setNextFetch(1)
    }, [selected])

    useEffect(() => {
        const newStartDate = new Date(startDate)
        const newEndDate = new Date(endDate)

        if (prevStartDate === undefined || prevEndDate === undefined) {
            setMinFetchStart(newStartDate)
            setMinFetchEnd(newEndDate)
            return
        }
            
        if (newStartDate < prevStartDate) {
            setMinFetchStart(newStartDate)
            setMinFetchEnd(prevStartDate)
        }
        else {
            setMinFetchStart()
            setMinFetchEnd()
        }
        
        if (prevEndDate < newEndDate) {
            setMaxFetchStart(prevEndDate)
            setMaxFetchEnd(newEndDate)

        }
        else {
            setMaxFetchStart()
            setMaxFetchEnd()
        }
    }, [startDate, endDate])
    
    const fetchData = async (isMin) => {

        const [target, start, end, next] = isMin
              ? [selected, getFormatted(minFetchStart), getFormatted(minFetchEnd), minFetchNext]
              : [selected, getFormatted(maxFetchStart), getFormatted(maxFetchEnd), maxFetchNext]

        const setNext = isMin ? setMinFetchNext : setMaxFetchNext

        const setPrevDate = isMin ? setPrevStartDate : setPrevEndDate
        
        if (start === undefined || end === undefined || next === 0) {
            setFetchBuffer([])
            return
        }

        console.log("FETCHING")
        const fetchURL = `/api/fdr/stocks/${target}?start=${start}&end=${end}&page=${next}`
        await fetch(fetchURL, { headers:{ accept: 'application/json' } })
            .then(response => response.json())
            .then((json) => { // get next page
                if (json.next !== null) {
                    const nextUrl = new URL(json.next)
                    setNext(nextUrl.searchParams.get("page"))
                    console.log("NEXT PAGE ", next)
                }
                else {
                    console.log("LAST PAGE ", next)
                    setNext(0)
                    setFetchBuffer([])

                }

                return json
            })
            .then((json) => { // set stockdata
                if (next == 0)
                    return
                
                console.log("SETTING BUFFER")
                if (fetchBuffer.length == 0) 
                    setFetchBuffer(json.data)
                
                else 
                    setFetchBuffer((prevBuffer) => ([...prevBuffer, ...json.data]))

                console.log("FETCHBUFFER", fetchBuffer)
            })
            .then(() => (console.log("SUCCESS")))
            .catch(console.log)
    }

    useEffect(() => {
        (async () => {
            console.log("FETCHING MIN PAGE ", minFetchNext)
            
            if (minFetchNext == 1)
                setFetchingStatus(true)

            else if (minFetchNext == 0) {
                setFetchingStatus(false)
                return
            }

            await fetchData(true)

            await setStockData({
                ...tempStockData,
                data: [...fetchBuffer, ...tempStockData.data]
            })

        })()
    }, [minFetchNext])

    useEffect(() => {
        (async () => {
            console.log("FETCHING MAX PAGE ", maxFetchNext)
            
            if (maxFetchNext == 1)
                setFetchingStatus(true)

            else if (maxFetchNext == 0) {
                setFetchingStatus(false)
                return
            }

            await fetchData(false)

            await setStockData({
                ...tempStockData,
                data: [...tempStockData.data, ...fetchBuffer]
            })

        })()
    }, [maxFetchNext])

    useEffect(() => {
        (async () => {
            if (selected === undefined)
                return

            await console.log("======= START WITH =====", stockData)
            
            await setTempStockData(stockData === undefined ? {data:[]} : stockData)
            
            await console.log("SAVING TEMP FOR MIN", tempStockData)
            
            await setMinFetchNext(1)

            await setTempStockData(stockData === undefined ? {data:[]} : stockData)
            await console.log("SAVING TEMP FOR MAX", tempStockData)

            await setMaxFetchNext(1)
        })()
    }, [selected, minFetchStart, minFetchEnd, maxFetchStart, maxFetchEnd])


    useEffect(() => {
        if (stockData === undefined || stockData.data.length == 0)
            return
        
        setPrevStartDate(new Date(stockData.data[0].Date))
        setPrevEndDate(new Date(stockData.data[stockData.data.length-1].Date))

        console.log(prevStartDate, prevEndDate)
    }, [stockData])

    return (<></>)            
}
