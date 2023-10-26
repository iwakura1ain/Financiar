import {useState, useEffect} from 'react';


import { ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {CustomToolTip} from './StockGraphToolTip.jsx'
import {LoadingDots} from "./LoadingVisual.jsx"


function GetWeightedAverage(trade, current, num, weight) {
    current = (((trade.Open + trade.Close)/2) + current*num*weight) / (num*weight + 1)
    num += 1

    return [current, num]
}


export function StockGraphBox({
    stockData,
    setStockData,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchStatus,
    height=600,
    width=1600
}) {
    const [visibility, setVisibility] = useState(true)

    const [showAverage, setShowAverage] = useState(true)
    const [avgWeight, setAvgWeight] = useState(0.2)
    const [showVolume, setShowVolume] = useState(true)
    
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

    useEffect(() => {
        if (!stockData || !showAverage)
            return

        if (fetchStatus)
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


    /// ============== hidden ============== 
    if (!visibility) {        
        return (
            <button
              className="barchart-toggle"
              onClick={() => {
                  setVisibility(false)
              }}>Show Graph</button>
        )
    }


    /// ============== visible ============== 
    // none selected
    if (!stockData) { 
        return (
            <div>
              <div className="barchart-toggle">Select Stock</div>
            </div>
        )        
    }

    // selected
    return (
        <div className='barchart-wrapper' /* style={{height:500, width:1000, marginBottom:"20px"}} */>
          {/* <button onClick={() => setZoomLevel(zoomLevel+10)}>+</button> */}
          {/* <button onClick={() => setZoomLevel(zoomLevel-10)}>-</button> */}

          <button
            className="barchart-toggle"
            onClick={() => {
                setVisibility(true)
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

