import {useState, useEffect} from 'react';


import { ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {CustomToolTip} from './StockGraphToolTip.jsx'


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

function GetWeightedAverage(trade, current, num, weight=0.2) {
    current = (((trade.Open + trade.Close)/2) + current*num*weight) / (num*weight + 1)
    num += 1

    return [current, num]
}


function GetDefaultDate() {    
    // Create a date object from a date string
    var date = new Date();

    // Get year, month, and day part from the date
    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate
}

export function StockGraphBox({stockData, setStockData, selected, setSelected, height=600, width=1600, small=false}) {
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [hideState, setHideState] = useState(true)
    
    useEffect(() => {
        if (selected === undefined)
            setStockData()

            fetch(`/api/fdr/stocks/${selected}?start=${startDate}&end=${endDate}`, { headers:{accept: 'application/json'} })
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    return json
                })
            .then((json) => {
                    let avg=0, num=0
               
                    json.data = Array.from(json.data).map((trade) => {
                       [avg, num] = GetWeightedAverage(trade, avg, num)
                    
                       return {
                           ...CleanTradeData(trade),
                           Average: avg
                       }
                    })

                    console.log(json)
                    return json
                })
                .then((json) => {
                    // setZoomLevel(json.data.length)
                    return json
                })
                .then(setStockData)
            .catch(console.log)

        //window.scrollTo(0, 0) scroll to top
        
    }, [selected, startDate, endDate])

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
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {/* <XAxis height={80} dataKey="Date" angle={-45} textAnchor='end'/> */}
              <YAxis type="number" />
              {/* <Tooltip /> */}
              {/* <Tooltip content={<CustomToolTip />}  /> */}

              {/* <Bar dataKey="Bottom" stackId="a" fill="#FFFFFF" />  */}
              {/* <Bar shape={CustomBar} dataKey="Area" stackId="a" > */}
              <Line type="monotone" dataKey="Close" stroke="#0095f7" dot={false} />
            </LineChart>
            </div>
        )

    }
    
    if (stockData && !hideState) {
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
                    max={GetDefaultDate()}
                    onChange={(event) =>{
                        console.log(event.target.value)
                        setStartDate(event.target.value)
                    }}/> 
                </div>
                <div>
                  <label htmlFor="end">End date : </label>
                  <input
                    type="date"
                    id="end"
            /* value={GetDefaultDate()} */
                    max={GetDefaultDate()}
                    onChange={(event) => {
                        console.log(event.target.value)
                        setEndDate(event.target.value)
                    }}/>

                </div>
              
              {/* <button className="barchart-btn" onClick={() => setSelected()}>Close</button> */}
              </div>
              {/* <ResponsiveContainer width="100%" height="100%"> */}
              <ComposedChart className="barchart-chart"
                        width={width}
                        height={height}
                        data={stockData.data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis height={80} dataKey="Date" angle={-45} textAnchor='end'/>
                <YAxis type="number" />
                {/* <Tooltip /> */}
                <Tooltip content={<CustomToolTip />}  />

                <Bar dataKey="Bottom" stackId="a" fill="#FFFFFF" /> 
                <Bar shape={CustomBar} dataKey="Area" stackId="a" />
                <Line type="monotone" dataKey="Average" stroke="#0095f7" dot={false}  strokeDasharray="5 5"/>
              </ComposedChart>
              <BarChart
                className="volume-chart"
                width={width}
                height={height-220}
                data={stockData.data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 80,
                    bottom: 200,
                }}>
                
                <Tooltip />
                <Bar dataKey="Volume" fill="#8884d8" activeBar={<Rectangle fill="#8f8e8c" stroke="blue" />}/>
              </BarChart>
              {/* </ResponsiveContainer> */}
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
    
    
}
