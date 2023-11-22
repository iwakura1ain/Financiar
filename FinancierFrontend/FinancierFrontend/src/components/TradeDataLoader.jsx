import {useState, useEffect} from 'react';

import {CustomToolTip} from './StockGraphToolTip.jsx'
import {LoadingDots} from "./LoadingVisual.jsx"

import {getFormattedDate, backendURL} from "./Utils.jsx"
 

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

/*
  Component that fetches paged trade data and fills stockData.
  
  - selected: ticker for currently selected stock
  "MMM"

  - startDate / endDate: start and end date for fetching, defaults to 1 year
  "2022-01-01" / "2023-01-01"

  - stockData: object with individual trade data
  {
  ...
  data: [...]  <--- list of trades 
  }

  - visibleOffset: offset for scrolling the graph where B is the visible area 
  [A, B] =>  [ |---- B ---| ... A ... ]

  - fetchingStatus:
  TradeDataLoader is fetching data -> true
  TradeDataLoader is not fetching data -> false
*/
export function TradeDataLoader2({
    // all must be unique states to retrieve multiple values
    selected,
    startDate, setStartDate,
    endDate, setEndDate,
    period, 
    stockData, setStockData,
    visibleOffset, setVisibleOffset,
    fetchingStatus, setFetchingStatus,
    
}) {

    const [tempStockData, setTempStockData] = useState([])
    const [tempStockInfo, setTempStockInfo] = useState({})

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

        // prefetch min
        if (visibleOffset[0] + visibleOffset[1] > stockData.data.length - 80) {
            console.log("setting start date to ", startDate)
            setFetchingStatus(true)
            setStartDate((currStartDate) => (getFormattedDate(currStartDate, true)))
        }

        // // TODO: truncate
        // if (stockData.data.length > 800) {
        //     setStockData((currStockData) => ({
        //         data: currStockData.data.slice(0, currStockData.data.length-100)
        //     }))
        //     setVisibleOffset((currVisibleOffset) => ([currVisibleOffset[0]-100, currVisibleOffset[1]]))
        // }
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
            await setTempStockInfo({})

            await setMinFetchStart(new Date(startDate))
            await setMinFetchEnd(new Date(endDate))
            setMinFetchReady(true)

            await setMaxFetchStart()
            await setMaxFetchEnd()
            
        })()        
    }, [selected, period])

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
        await setFetchingStatus(true)

        var [res, resNext] = [{}, 0]
        const fetchURL = `${backendURL}/api/fdr/stocks/${target}?`
              + `period=${period}`
              + `&start=${getFormattedDate(start)}`
              + `&end=${getFormattedDate(end)}`
              + `&page=${next}`
              + `&flip=${flip}`
        
        await fetch(fetchURL, {
            headers:{
                accept: 'application/json',
            }})
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
            .then(() => (console.log("FETCH SUCCESS")))
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
            const [res, resNext] = await fetchData(selected, minFetchStart, minFetchEnd, minFetchNext, true)
            let {data, ...info} = res
            data = await data.reverse()
            
            await setTempStockInfo({...info})
            await setMinFetchBuff((prevBuff) => ([ ...data, ...prevBuff]))
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
            let {data, ...info} = res

            await setTempStockInfo({...info})
            await setMaxFetchBuff((prevBuff) => ([...prevBuff, ...data]))
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
                    ...tempStockInfo,
                    data: newStockData
                })

                await console.log("FETCHED INFO", stockData)
                
                // setPrevStartDate(new Date(newStockData[0].Date))
                // setPrevEndDate(new Date(newStockData[newStockData.length-1].Date))
                await setPrevStartDate(new Date(startDate))
                await setPrevEndDate(new Date(endDate))
            }

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

