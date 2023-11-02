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

function getFormatted(date, offset=false) {
    if (date === undefined)
        return date
    
    var val = new Date(date);

    if (offset) {
        val.setMonth(val.getMonth() - 6);
    }
    
    // Get year, month, and day part from the date
    var year = val.toLocaleString("default", { year: "numeric" });
    var month = val.toLocaleString("default", { month: "2-digit" });
    var day = val.toLocaleString("default", { day: "2-digit" });

    return year + "-" + month + "-" + day;
}



export function TradeDataLoader2({
    selected,
    startDate, setStartDate,
    endDate, setEndDate,
    stockData, setStockData,
    visibleOffset, setVisibleOffset,
    fetchingStatus, setFetchingStatus,
    
}) {

    const [tempStockData, setTempStockData] = useState([])

    const [prevStartDate, setPrevStartDate] = useState()
    const [prevEndDate, setPrevEndDate] = useState()
    
    const [minFetchStart, setMinFetchStart] = useState() //change to regular var?
    const [minFetchEnd, setMinFetchEnd] = useState() //change to regular var?
    const [minFetchNext, setMinFetchNext] = useState(0)
    const [minFetchBuff, setMinFetchBuff] = useState([])
    const [minFetchReady, setMinFetchReady] = useState(false)

    const [maxFetchStart, setMaxFetchStart] = useState() //change to regular var?
    const [maxFetchEnd, setMaxFetchEnd] = useState() //change to regular var?
    const [maxFetchNext, setMaxFetchNext] = useState(0)
    const [maxFetchBuff, setMaxFetchBuff] = useState([])
    const [maxFetchReady, setMaxFetchReady] = useState(false)

        
    useEffect(() => {
        console.log("PREFETCHING")        
        if (stockData === undefined || fetchingStatus)
            return
        
        if (visibleOffset[0] + visibleOffset[1] > stockData.data.length - 80) {
            console.log("setting start date to ", startDate)
            setFetchingStatus(true)
            setStartDate((currStartDate) => (getFormatted(currStartDate, true)))
        }
    }, [visibleOffset])

    // reset stockData and buffers when different stock selected
    useEffect(() => {
        (async () => {
            if (fetchingStatus)
                return
            
            if (selected === undefined)
                return
            
            console.log("SELECTED", selected)
            setFetchingStatus(true)

            await setMinFetchNext(0)
            await setMaxFetchNext(0)

            await setMinFetchBuff([])
            await setMaxFetchBuff([])
            
            await setStockData()
            await setTempStockData([])

            await setMinFetchStart(new Date(startDate))
            await setMinFetchEnd(new Date(endDate))
            setMinFetchReady(true)

            await setMaxFetchStart()
            await setMaxFetchEnd()
            
        })()        
    }, [selected])

    // set dates to fetch
    useEffect(() => {
        (async () => {
            // if (fetchingStatus)
            //     return
            // await setFetchingStatus(true)

            await console.log("SETTING FETCHING STATUS TRUE")
            

            const newStartDate = new Date(startDate)
            const newEndDate = new Date(endDate)

            if (newStartDate < prevStartDate) {
                 setMinFetchStart(newStartDate)
                 setMinFetchEnd(prevStartDate)
                await setMinFetchReady(true)
            }
            else {
                await setMinFetchStart()
                await setMinFetchEnd()
            }
            
            if (prevEndDate < newEndDate) {
                 setMaxFetchStart(prevEndDate)
                 setMaxFetchEnd(newEndDate)
                await setMaxFetchReady(true)
            }
            else {
                await setMaxFetchStart()
                await setMaxFetchEnd()
            }           
        })()
    }, [startDate, endDate])

    // fetch paged data 
    const fetchData = async (target, start, end, next, flip) => {
        await console.log("SETTING FETCHING STATUS TRUE")
        await setFetchingStatus(true)

        var [res, resNext] = [{}, 0]
        const fetchURL = `/api/fdr/stocks/${target}?start=${getFormatted(start)}&end=${getFormatted(end)}&page=${next}&flip=${flip}`
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
    
    // fetch for lower region 
    useEffect(() => {
        (async () => {
            if (minFetchNext == 0) {
                setMinFetchBuff([])
                return
            }

            console.log("fetching min")
            let [res, resNext] = await fetchData(selected, minFetchStart, minFetchEnd, minFetchNext, true)
            res.data = await res.data.reverse()
            await setMinFetchBuff((prevBuff) => ([ ...res.data, ...prevBuff]))
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

            console.log("fetching max")
            const [res, resNext] = await fetchData(selected, maxFetchStart, maxFetchEnd, maxFetchNext, false)
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

            //if (minFetchStart !== undefined && minFetchEnd !== undefined )
            if (minFetchReady)
                setMinFetchNext(1)

            //if (maxFetchStart !== undefined && maxFetchEnd !== undefined )
            if (maxFetchReady)
                setMaxFetchNext(1)

        })()
        //}, [minFetchStart, minFetchEnd, maxFetchStart, maxFetchEnd])
    }, [minFetchReady, maxFetchReady])

    // set stockData when fetchbuffer changes
    useEffect(() => {
        (async () => {        
            var newStockData = tempStockData
            
            var changed = false
            if (minFetchBuff.length != 0){
                newStockData = await [...minFetchBuff, ...newStockData]
                console.log("FETCHED MIN", newStockData.length)
                changed = true
            }

            if (maxFetchBuff.length != 0){
                newStockData = await [...newStockData, ...maxFetchBuff]            
                console.log("FETCHED MAX", newStockData.length)
                await setVisibleOffset((prevOffset) => ([prevOffset[0], prevOffset[1] + maxFetchBuff.length]))
                changed = true
            }

            if (newStockData.length != 0 && changed){
                await setStockData({
                    data: newStockData
                })
                
                // setPrevStartDate(new Date(newStockData[0].Date))
                // setPrevEndDate(new Date(newStockData[newStockData.length-1].Date))
                await setPrevStartDate(new Date(startDate))
                await setPrevEndDate(new Date(endDate))
            }
            // else if (!changed && minFetchBuff.length == 0 && maxFetchBuff.length == 0) {
            //     console.log(changed, minFetchBuff, maxFetchBuff)
            //     console.log("SETTING FETCHING STATUS FALSE")
            //     setFetchingStatus(false)
            // }

            if (minFetchNext == 0 && maxFetchNext == 0 && fetchingStatus) {
                console.log("SETTING FETCHING STATUS FALSE")
                await setFetchingStatus(false)
                await setMinFetchReady(false)
                await setMaxFetchReady(false)
            }
                
            console.log("FETCHSTATUS", fetchingStatus)
        })()
        
    }, [minFetchBuff, maxFetchBuff])



    return (<></>)            
}

