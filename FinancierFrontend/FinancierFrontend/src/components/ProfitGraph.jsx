import {useState, useEffect} from 'react';


import {
    ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { useScrollDirection } from 'react-use-scroll-direction'


import {CustomToolTip} from './StockGraphToolTip.jsx'
import {LoadingDots, LoadingSpinny} from "./LoadingVisual.jsx"

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

const GraphScrollListener = ({barchartId, eventAddStatus, setEventAddStatus, visibleOffset, setVisibleOffset}) => {
    console.log("ADDING LISTENER FOR ", barchartId)
    
    var element = document.getElementById(`barchart-scrollable-${barchartId}`)
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


export function ProfitGraphBox({
    barchartId=0,
    //stockData, setStockData, // object with individual trade data
    visibleOffset, setVisibleOffset, // offset for scrolling the graph 
    //selected, setSelected, //ticker for currently selected stock
    //fetchingStatus,
    // startDate, setStartDate,
    // endDate, setEndDate,
    height=600, width=1600,
    showControls=false,
}) {
    const [avgWeight, setAvgWeight] = useState(0.2)
    const [showAverage, setShowAverage] = useState(false)
    const [showVolume, setShowVolume] = useState(true)
    const [visibility, setVisibility] = useState(true)
    const [eventAddStatus, setEventAddStatus] = useState(false)

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
        return (
            <>
              <LineChart
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis height={80} dataKey="Date" angle={-45} textAnchor='end'/>
                <YAxis type="number" />
                <Line type="monotone" dataKey="Close" stroke="#646cffaa" dot={false} isAnimationActive={false} />
              </LineChart>
            </>
        )

        
    }

    return (            
        <div
          className='barchart-wrapper'
          id={`barchart-scrollable-${barchartId}`}
        >

          <GraphScrollListener
            barchartId={barchartId}
            eventAddStatus={eventAddStatus}
            setEventAddStatus={setEventAddStatus}
            visibleOffset={visibleOffset}
            setVisibleOffset={setVisibleOffset}
          />              
          <GraphZoomButton />             

          <div   id={`barchart-scrollable-${barchartId}`}>
            <MainGraph />
          </div>
        </div>
    )       

}
