import {useState, useEffect} from 'react';


import { Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export function StockGraphBox({selected, setSelected}) {
    const [stockData, setStockData] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    
    useEffect(() => {
        if (selected === undefined)
            setStockData()

        // (Array.from(json).map())
        else {
            fetch(`/api/fdr/stocks/${selected}?start=${startDate}&end=${endDate}`, { headers:{accept: 'application/json'} })
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    return json
                })
                .then((json) => {
                    json.data = Array.from(json.data).map(CleanTradeData)
                    return json
                })
                .then((json) => {
                    // setZoomLevel(json.data.length)
                    return json
                })
                .then(setStockData)
                .catch(console.log)
        }
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
    
    if (stockData) {
        return (
            <div className='barchart-wrapper' style={{height:500, width:1000, marginBottom:"20px"}}>
              {/* <button onClick={() => setZoomLevel(zoomLevel+10)}>+</button> */}
              {/* <button onClick={() => setZoomLevel(zoomLevel-10)}>-</button> */}

              <label htmlFor="start">Start date:</label>
              <input
                type="date"
                id="start"
                max={GetDefaultDate()}
                onChange={(event) =>{
                    console.log(event.target.value)
                    setStartDate(event.target.value)
                }}/> 

              <label htmlFor="end">End date:</label>
              <input
                type="date"
                id="end"
                /* value={GetDefaultDate()} */
                max={GetDefaultDate()}
                onChange={(event) => {
                    console.log(event.target.value)
                    setEndDate(event.target.value)
                }}/>

              <button onClick={() => setSelected()}>Close</button>

              {/* <ResponsiveContainer width="100%" height="100%"> */}
                <BarChart className="barchart-chart"
                  width={700}
                  height={500}
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
                  <Bar shape={CustomBar} dataKey="Area" stackId="a" >
                  </Bar>
                </BarChart>
                <button className="barchart-btn" onClick={() => setSelected()}>Close</button>
              {/* </ResponsiveContainer> */}
            </div>
        )
    }

    return (
        <div>
          <p>SELECT A STOCK</p>
        </div>
    )
    
    
}
