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


export function TradeDataLoader2({
    selected,
    startDate, endDate, 
    stockData, setStockData,
    nextStockData, setNextStockData,
    fetchingStatus, setFetchingStatus,
}) {

    //const [fetchTarget, setFetchTarget] = useState(selected)
    const [tempStockData, setTempStockData] = useState([])

    const [prevStartDate, setPrevStartDate] = useState()
    const [prevEndDate, setPrevEndDate] = useState()
    
    const [minFetchStart, setMinFetchStart] = useState()
    const [minFetchEnd, setMinFetchEnd] = useState()
    const [minFetchNext, setMinFetchNext] = useState(0)
    const [minFetchBuff, setMinFetchBuff] = useState([])

    const [maxFetchStart, setMaxFetchStart] = useState()
    const [maxFetchEnd, setMaxFetchEnd] = useState()
    const [maxFetchNext, setMaxFetchNext] = useState(0)
    const [maxFetchBuff, setMaxFetchBuff] = useState([])

    // reset stockData and buffers when different stock selected
    useEffect(() => {
        (async () => {
            if (selected === undefined)
                return
            
            console.log("SELECTED", selected)
            

            await setMinFetchNext(0)
            await setMaxFetchNext(0)
            await setMinFetchBuff([])
            await setMaxFetchBuff([])
            
            await setStockData()
            setTempStockData([])

            setMinFetchStart(new Date(startDate))
            setMinFetchEnd(new Date(endDate))

            setMaxFetchStart()
            setMaxFetchEnd()

            
        })()        
    }, [selected])

    // set dates to fetch
    useEffect(() => {
        const newStartDate = new Date(startDate)
        const newEndDate = new Date(endDate)

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

    // fetch paged data 
    const fetchData = async (target, start, end, next) => {
        await setFetchingStatus(true)
        
        var [res, resNext] = [{}, 0]
        const fetchURL = `/api/fdr/stocks/${target}?start=${getFormatted(start)}&end=${getFormatted(end)}&page=${next}`
        await fetch(fetchURL, { headers:{ accept: 'application/json' } })
            .then(response => response.json())
            .then((json) => { // set stockdata
                res = json
                return json
            })
            .then((json) => { // get next page
                if (json.next !== null) {
                    const nextUrl = new URL(json.next)
                    resNext = nextUrl.searchParams.get("page")
                }

            })
            .then(() => (console.log("SUCCESS")))
            .catch(console.log)

        console.log(res, resNext)
        return [res, resNext]
    }

    //TODO: paginate backwards    
    // fetch for lower region 
    useEffect(() => {
        (async () => {
            if (minFetchNext == 0) {
                setMinFetchBuff([])
                return
            }
            
            const [res, resNext] = await fetchData(selected, minFetchStart, minFetchEnd, minFetchNext)
            await setMinFetchBuff((prevBuff) => ([...prevBuff, ...res.data]))
            await setMinFetchNext(resNext)
        })()
    }, [minFetchNext])

    // fetch for upper region
    useEffect(() => {
        (async () => {
            if (maxFetchNext == 0) {
                setMaxFetchBuff([])
                return
            }

            const [res, resNext] = await fetchData(selected, maxFetchStart, maxFetchEnd, maxFetchNext)
            await setMaxFetchBuff((prevBuff) => ([...prevBuff, ...res.data]))
            await setMaxFetchNext(resNext)
        })()
    }, [maxFetchNext])

    // call fetch effects when date changes
    useEffect(() => {
        (async () => {
            if (selected === undefined)
                return

            await setTempStockData(stockData !== undefined ? stockData.data : [])
            await setMaxFetchBuff([])
            await setMinFetchBuff([])

            if (minFetchStart !== undefined && minFetchEnd !== undefined)
                setMinFetchNext(1)

            if (maxFetchStart !== undefined && maxFetchEnd !== undefined)
                setMaxFetchNext(1)

        })()
    }, [minFetchStart, minFetchEnd, maxFetchStart, maxFetchEnd])

    // set stockData when fetchbuffer changes
    useEffect(() => {
        var newStockData = tempStockData
        var changed = false
        if (minFetchBuff.length != 0){
            newStockData = [...minFetchBuff, ...newStockData]
            changed = true
        }

        if (maxFetchBuff.length != 0){
            newStockData = [...newStockData, ...maxFetchBuff]
            changed = true
        }

        if (newStockData.length != 0 && changed){
            setStockData({
                data: newStockData
            })
            
            setPrevStartDate(new Date(newStockData[0].Date))
            setPrevEndDate(new Date(newStockData[newStockData.length-1].Date))
        }
        else
            setFetchingStatus(false)
        
        
    }, [minFetchBuff, maxFetchBuff])


    return (<></>)            
}

