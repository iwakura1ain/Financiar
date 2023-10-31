import {useState, useEffect} from 'react';


import { ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {CustomToolTip} from './StockGraphToolTip.jsx'
import {LoadingDots} from "./LoadingVisual.jsx"


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

function getVisibleArea(visibleIndex, visibleOffset, dataLength) {
    let [start, end] = [0,10]
    
    if (visibleIndex[0] > 0)
        start = visibleIndex[0] + visibleOffset[0]

    if (visibleIndex[1] > 0)
        end = visibleIndex[1] + visibleOffset[1] 

    console.log("INDEX", visibleIndex)
    console.log("OFFSET", visibleOffset)
    console.log("VISIBLE", start, end)
    return [start, end]
}

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


export function StockGraphBox({
    stockData, setStockData,
    selected, setSelected,
    fetchingStatus,
    startDate, setStartDate,
    endDate, setEndDate,
    height=600, width=1600,
    visibleOffset, setVisibleOffset
}) {
    const [avgWeight, setAvgWeight] = useState(0.2)
    const [showAverage, setShowAverage] = useState(true)
    const [showVolume, setShowVolume] = useState(true)
    const [visibility, setVisibility] = useState(true)
    const [visibleIndex, setVisibleIndex] = useState([-1, -1])

    // ====== avg ======
    useEffect(() => {
        if (fetchingStatus || !showAverage)
            return
        
        if (stockData === undefined)
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
    }, [fetchingStatus, avgWeight, showAverage])

    if (!visibility) {
        return (
            <button
              className="barchart-toggle"
              onClick={() => {
                  setVisibility(true)
              }}>Show Graph</button>
        )
    }

    if (!stockData)
        return (
            <div className='barchart-wrapper' /* style={{height:500, width:1000, marginBottom:"20px"}} */>
              {/* <button onClick={() => setZoomLevel(zoomLevel+10)}>+</button> */}
              {/* <button onClick={() => setZoomLevel(zoomLevel-10)}>-</button> */}

              <button
                className="barchart-toggle"
                onClick={() => {
                    setVisibility(false)
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

                <div>
                  <label htmlFor="end">Start : </label>
                  <input
                    type="number"
                    step={1}
                    value={visibleIndex[0]}
                    onChange={(event) => {
                        setVisibleIndex([+event.target.value, visibleIndex[1]])
                    }}/>
                </div>

                <div>
                  <label htmlFor="end">End : </label>
                  <input
                    type="number"
                    step={1}
                    value={visibleIndex[1]}
                    onChange={(event) => {
                        setVisibleIndex([visibleIndex[0], +event.target.value])
                    }}/>
                </div>
                
              </div>
              
              
              <ComposedChart
                className="barchart-chart"
                width={width}
                height={height}
                data={null}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 70,
                }}>
                <XAxis height={80} angle={-45} textAnchor='end'/>
                <YAxis type="number" />
                <CartesianGrid strokeDasharray="3 3" />
              </ComposedChart>
            </div>
        )        
    
    return (
        <div className='barchart-wrapper' /* style={{height:500, width:1000, marginBottom:"20px"}} */>
          {/* <button onClick={() => setZoomLevel(zoomLevel+10)}>+</button> */}
          {/* <button onClick={() => setZoomLevel(zoomLevel-10)}>-</button> */}

          <button
            className="barchart-toggle"
            onClick={() => {
                setVisibility(false)
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
            
            <div>
              <label htmlFor="end">Start : </label>
              <input
                type="number"
                step={1}
                value={visibleIndex[0]}
                onChange={(event) => {
                    setVisibleIndex([+event.target.value, visibleIndex[1]])
                }}/>
            </div>

            <div>
              <label htmlFor="end">End : </label>
              <input
                type="number"
                step={1}
                value={visibleIndex[1]}
                onChange={(event) => {
                    setVisibleIndex([visibleIndex[0], +event.target.value])
                }}/>
            </div>

          </div>

          <LoadingDots status={fetchingStatus}/>
          
          <ComposedChart
            className="barchart-chart"
            width={width}
            height={height}
        /* data={[...stockData.data, ...Array.apply(null, Array(stockData.count-stockData.data.length)).map(function () {})]} */
            data={stockData.data
                /* stockData.data.slice(getVisibleArea(visibleIndex, visibleOffset, stockData.data.length)[0], */
                /*                      getVisibleArea(visibleIndex, visibleOffset, stockData.data.length)[1]) */
            }
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

            <Bar dataKey="Bottom" stackId="a" fill="#FFFFFF" isAnimationActive={false} /> 
            <Bar shape={CustomBar} dataKey="Area" stackId="a" isAnimationActive={false} />
            <Line
              type="monotone"
              dataKey={showAverage && !fetchingStatus ? "Average" : ""}
              stroke="#0095f7"
              dot={false}
              strokeDasharray="5 5"
            />
          </ComposedChart>
          <BarChart
            className="volume-chart"
            width={width}
            height={height-220}
        /* data={showVolume ? [...stockData.data, ...Array.apply(null, Array(stockData.count-stockData.data.length)).map(function () {})] : null} */
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
              isAnimationActive={false} 
            />
          </BarChart>
        </div>
    )

}
