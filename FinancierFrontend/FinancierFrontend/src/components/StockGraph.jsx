import {useState, useEffect} from 'react';


import { ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

function GetWeightedAverage(trade, current, num, weight) {
    current = (((trade.Open + trade.Close)/2) + current*num*weight) / (num*weight + 1)
    num += 1

    return [current, num]
}


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

export function StockGraphBox({
    stockData,
    setStockData,
    selected,
    setSelected,
    height=600,
    width=1600,
    small=false
}) {
    const [startDate, setStartDate] = useState(GetDefaultDate()[1])
    const [endDate, setEndDate] = useState(GetDefaultDate()[0])
    const [hideState, setHideState] = useState(true)
    const [showAverage, setShowAverage] = useState(true)
    const [showVolume, setShowVolume] = useState(true)
    const [avgWeight, setAvgWeight] = useState(0.2)
    //const [loadingState, setLoadingState] = useState(false)


    console.log(GetDefaultDate())

    

    // ======= stock data fetch  ======= 
    useEffect(() => {
        console.log("SELECTED", selected)
        if (selected === undefined){            
            setStockData()
            return
        }


        // ======================== TODO: CHANGE TO ASYNC AWAIT FUNCTION!!!! ===========================================        
        let num = 0
        let nextPage = 1
        do {
            fetch(`/api/fdr/stocks/${selected}?start=${startDate}&end=${endDate}&page=${nextPage}`, { headers:{accept: 'application/json'} })
                .then(response => response.json())
                .then(json => {
                    console.log("FETCHED", json)
                    return json
                })
                .then((json) => {
                    let [avg, num] = [0, 0]
                    
                    json.data = Array.from(json.data).map((trade) => {
                        [avg, num] = GetWeightedAverage(trade, avg, num, avgWeight)                        
                        return {
                            ...CleanTradeData(trade),
                            Average: avg
                        }
                    })

                    return json
                })
                .then((json) => {
                    if (json.next == null)
                        nextPage = null
                    else {
                        const nextUrl = new URL(json.next)
                        nextPage = nextUrl.searchParams.get("page")
                        console.log("NEW NEXT", nextPage)
                    }

                    return json
                })
                .then((json) => {
                    if (stockData === undefined)
                        setStockData(stockData)

                    else {
                        setStockData({
                            ...stockData,
                            data: stockData.data + json.data
                        })
                    }
                    
                    
                })
                .catch(console.log)

            console.log("RAN ", num)
            num += 1

        } while (nextPage != null && num < 8)

        // ======================== TODO: CHANGE TO ASYNC AWAIT FUNCTION!!!! ===========================================
        
    }, [selected, startDate, endDate])

    // ======= avg ======= 
    useEffect(() => {
        if (!stockData || !showAverage)
            return
        
        let [avg, num] = [0, 0]
        
        const newData = stockData.data.map((trade) => {
            [avg, num] = GetWeightedAverage(trade, avg, num, avgWeight)
            
            return {
                ...trade,
                Average: avg
            }
        })

        setStockData({...stockData, data: newData})
    }, [avgWeight, showAverage])

    const CustomBar = (props) => {
        const {Color} = props;

        return (
            <Rectangle
              {...props}
              fill={Color == "red" ? "#FF0000" : "#0000FF"}
              className="recharts-bar-rectangle"
            />
        )
    }

    if (small && stockData) {
        return (
            <div>
            <LineChart
              className="barchart-chart pic-in-pic-graph"
              width={width}
              height={height}
              data={stockData.data}
              margin={{
                  top: 15,
                  right: 30,
                  left: -20,
                  bottom: 18,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis type="number" />
              <Line type="monotone" dataKey="Close" stroke="#0095f7" dot={false} />
            </LineChart>
            </div>
        )

    }

    // ======= Main Stockchart ======= 
    if (stockData && !hideState) {
        // if (loadingState) {
        //     console.log("LOADING!!")
        //     return (
        //         <LoadingDots />
        //     )
        // }
        
        return (
            <div className='barchart-wrapper' /* style={{height:500, width:1000, marginBottom:"20px"}} */>
              {/* <button onClick={() => setZoomLevel(zoomLevel+10)}>+</button> */}
              {/* <button onClick={() => setZoomLevel(zoomLevel-10)}>-</button> */}

              <button
                className="barchart-toggle"
                onClick={() => {
                    setHideState(true)
                }}>Hide Graph</button>
              
              <div className="barchart-controls">
                <div>
                  <label htmlFor="start">Start date : </label>
                  <input
                    type="date"
                    id="start"
                    max={GetDefaultDate()[0]}
                    value={startDate}
                    onChange={(event) =>{
                        //console.log(event.target.value)
                        setStartDate(event.target.value)
                    }}/> 
                </div>
                <div>
                  <label htmlFor="end">End date : </label>
                  <input
                    type="date"
                    id="end"
                    max={GetDefaultDate()[0]}
                    value={endDate}
                    onChange={(event) => {
                        //console.log(event.target.value)
                        setEndDate(event.target.value)
                    }}/>
                </div>
                <div>
                  <label htmlFor="end">Volume : </label>
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    onChange={() => {
                        setShowVolume(!showVolume)
                    }}/>
                </div>

                <div>
                  <label htmlFor="end">Average : </label>
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    onChange={() => {                        
                        setShowAverage(!showAverage)
                    }}/>
                </div>
                <div>
                  <label htmlFor="end">Weight : </label>
                  <input
                    type="number"
                    max={1.0}
                    min={0.0}
                    step={0.05}
                    value={avgWeight}
                    onChange={(event) => {
                        setAvgWeight(event.target.value)
                    }}/>
                </div>
              </div>
              
              <ComposedChart
                className="barchart-chart"
                width={width}
                height={height}
                data={stockData.data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 70,
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis height={80} dataKey="Date" angle={-45} textAnchor='end'/>
                <YAxis type="number" />

                <Tooltip content={<CustomToolTip />}  />

                <Bar dataKey="Bottom" stackId="a" fill="#FFFFFF" /> 
                <Bar shape={CustomBar} dataKey="Area" stackId="a" />
                <Line
                  type="monotone"
                  dataKey={showAverage ? "Average" : ""}
                  stroke="#0095f7"
                  dot={false}
                  strokeDasharray="5 5"
                />
              </ComposedChart>
              <BarChart
                className="volume-chart"
                width={width}
                height={height-220}
                data={showVolume ? stockData.data : null}
                margin={{
                    top: 20,
                    right: 30,
                    left: 80,
                    bottom: 265,
                }}>
                
                <Tooltip />
                <Bar
                  dataKey={showVolume ? "Volume" : null}
                  fill="#8884d8"
                  activeBar={<Rectangle fill="#8f8e8c" stroke="blue" />}
                />
              </BarChart>
            </div>
        )
    }
    else if (stockData && hideState) {
        return (
            <button
              className="barchart-toggle"
              onClick={() => {
                  setHideState(false)
              }}>Show Graph</button>
        )
    }

    else if(!small) {
        return (
            <div>
              <div className="barchart-toggle">Select Stock</div>
            </div>
        )        
    }

    // ======= PIP Stockchart ======= 
    else if(small) {
        return (
            <div>
              <LineChart
                className="barchart-chart pic-in-pic-graph"
                width={width}
                height={height}
                
                margin={{
                    top: 15,
                    right: 30,
                    left: 30,
                    bottom: 18,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
              </LineChart>
            </div>
        )
    }
}
