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

    const [fetchTarget, setFetchTarget] = useState(selected)
    
    useEffect(() => {
        if (selected === undefined){
            setStockData()
            return
        }
        
        console.log("SELECTED", selected)
        setStockData()
        setFetchTarget(selected)
        setFetchingStatus(false)
        setNextStockData(1)
    }, [selected, startDate, endDate])

    

    useEffect(() => {
        (async () => {
            if (!fetchingStatus && nextStockData == 1)
                setFetchingStatus(true)

            else if (nextStockData == 0) {
                setFetchingStatus(false)
                return
            }

            
            const fetchURL = `/api/fdr/stocks/${fetchTarget}?start=${startDate}&end=${endDate}&page=${nextStockData}`
            fetch(fetchURL, { headers:{ accept: 'application/json' } })
                .then(response => response.json())

                .then((json) => { // TODO: maybe move to backend?
                    json.data = Array.from(json.data).map((trade) => {
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
                    })

                    return json
                })
            
                .then((json) => { // get next page
                    if (json.next !== null) {
                        const nextUrl = new URL(json.next)
                        setNextStockData(nextUrl.searchParams.get("page"))
                    }
                    else 
                        setNextStockData(0)

                    return json
                })
                .then((json) => { // set stockdata
                    if (stockData === undefined) {
                        setStockData({
                            ...json,                           
                        })
                    }
                    else {
                        setStockData({
                            ...stockData,
                            data: [...stockData.data, ...json.data]
                        })
                    }
                })
                .catch(console.log)
            
        })()
    }, [fetchTarget, nextStockData])


    return (<></>)            
}
