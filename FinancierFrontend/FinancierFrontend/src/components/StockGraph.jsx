import {useState, useEffect} from 'react';


import {
    ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { useScrollDirection } from 'react-use-scroll-direction'


import {CustomToolTip} from './StockGraphToolTip.jsx'
import {LoadingDots, LoadingSpinny} from "./LoadingVisual.jsx"


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

function GetSlicedStockData(data, visibleOffset) {
    let start = data.length - (visibleOffset[0] + visibleOffset[1])
    let end = data.length - (visibleOffset[0])
    let padding = start < 0 ? Array.apply(null, Array(Math.abs(start))).map(function () {}) : []

    return [...padding, ...data.slice(start > 0 ? start : 0, end)]
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


const AddGraphListener = ({eventAddStatus, setEventAddStatus, visibleOffset, setVisibleOffset}) => {
    var element = document.getElementById("barchart-scrollable")
    if (element == null || eventAddStatus)
        return

    element.addEventListener('wheel', preventScroll, {passive: false});
    console.log("EVENT ADDED")

    
    function preventScroll(e){
        e.preventDefault();
        e.stopPropagation();
        
        var scrollAmount = e.deltaY > 0 ? 2 : -2
        console.log("SCROLLED", scrollAmount)
        
        setVisibleOffset((prevOffset) => (
            [prevOffset[0] + scrollAmount > 0 ? prevOffset[0] + scrollAmount : 0, prevOffset[1]]
        ))

        return false;
    }

    setEventAddStatus(true)
}

export function StockGraphBox({
    stockData, setStockData,
    visibleOffset, setVisibleOffset,
    selected, setSelected,
    fetchingStatus,
    startDate, setStartDate,
    endDate, setEndDate,
    height=600, width=1600,
}) {
    const [avgWeight, setAvgWeight] = useState(0.2)
    const [showAverage, setShowAverage] = useState(false)
    const [showVolume, setShowVolume] = useState(true)
    const [visibility, setVisibility] = useState(true)
    const [eventAddStatus, setEventAddStatus] = useState(false)

    const GraphControls = () => (
        <div className="barchart-controls">
          <div>
            <label htmlFor="start">Start date : </label>
            <input
              type="date"
              id="start"
              max={GetDefaultDate()[0]}
              value={startDate}
              onChange={(event) =>{
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
            <label htmlFor="end">A (offset from end): </label>
            <input
              type="number"
              step={10}
              min={0}
              value={visibleOffset[0]}
              onChange={(event) => {
                  setVisibleOffset([+event.target.value, visibleOffset[1]])
              }}/>
          </div>

          <div>
            <label htmlFor="end">B (len of data) : </label>
            <input
              type="number"
              step={1}
              min={0}
              value={visibleOffset[1]}
              onChange={(event) => {
                  setVisibleOffset([visibleOffset[0], +event.target.value])
              }}/>
          </div>
          <div>
        <p>LEN: {stockData ? stockData.data.length: 0}</p>
          </div>

        </div>              
    )

    const GraphZoomButton = () => (
        <>
          <button
            className="barchart-zoom"
            id="barchart-zoom-in"
            onClick={() => {
                setVisibleOffset((prevOffset) => ([prevOffset[0], prevOffset[1]-10]))
            }}>
            <img src="/src/assets/plus.svg"  />
          </button>
          
          <button
            className="barchart-zoom"
            id="barchart-zoom-out"
            onClick={() => {
                setVisibleOffset((prevOffset) => ([prevOffset[0], prevOffset[1]+10]))
            }}>
            <img src="/src/assets/minus.svg" />
          </button>
        </>
    )
    
    const MainGraph = () => {
        if (visibleOffset[1] > 250)
            return (
                <>
                  <AddGraphListener
                    eventAddStatus={eventAddStatus}
                    setEventAddStatus={setEventAddStatus}
                    visibleOffset={visibleOffset}
                    setVisibleOffset={setVisibleOffset}
                  />

                  <LineChart
                    className="barchart-chart"
                    width={width}
                    height={height}
                    data={GetSlicedStockData(stockData.data, visibleOffset)}
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

                    <Line type="monotone" dataKey="Close" stroke="#646cffaa" dot={false} isAnimationActive={false} />
                    <Line
                      type="monotone"
                      dataKey={showAverage && !fetchingStatus ? "Average" : ""}
                      stroke="#0095f7"
                      dot={false}
                      strokeDasharray="5 5"
                      isAnimationActive={false} 
                    />
                  </LineChart>
                </>
            )

        return (
            <>
              <ComposedChart
                className="barchart-chart"
                width={width}
                height={height}
            /* data={[...stockData.data, ...Array.apply(null, Array(stockData.count-stockData.data.length)).map(function () {})]} */
                data={GetSlicedStockData(stockData.data, visibleOffset)}
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
            </>
        )
    }
    
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
            <div
              className='barchart-wrapper'
              id="barchart-scrollable"
            >
                            
              <button
                className="barchart-toggle"
                onClick={() => {
                    setVisibility(false)
                }}>Hide Graph</button>
              
              <GraphControls />
              <GraphZoomButton />             

              <div id="barchart-scrollable">
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
            </div>
        )        
    
    return (
        <div
          className='barchart-wrapper'
        >
          <AddGraphListener
            eventAddStatus={eventAddStatus}
            setEventAddStatus={setEventAddStatus}
            visibleOffset={visibleOffset}
            setVisibleOffset={setVisibleOffset}
          />
          <button
            className="barchart-toggle"
            onClick={() => {
                setVisibility(false)
            }}>Hide Graph</button>
          
          <GraphControls />
          <GraphZoomButton />

          {/* <LoadingDots status={fetchingStatus}/> */}
          <LoadingSpinny status={fetchingStatus}/>

          <div id="barchart-scrollable">
            <MainGraph />
            
            <BarChart
              className="volume-chart"
              width={width}
              height={height-220}
        /* data={showVolume ? [...stockData.data, ...Array.apply(null, Array(stockData.count-stockData.data.length)).map(function () {})] : null} */
              data={GetSlicedStockData(stockData.data, visibleOffset)}

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
        </div>
        
    )

}
