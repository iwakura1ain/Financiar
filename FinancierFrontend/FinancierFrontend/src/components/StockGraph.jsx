import {useState, useEffect, useMemo} from 'react';


import {
    ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter,  ResponsiveContainer
} from 'recharts';


import { StockPreview } from './StockPreview.jsx';
import {CustomToolTip} from './StockGraphToolTip.jsx'
import {LoadingDots, LoadingSpinny} from "./LoadingVisual.jsx"
import {getWeightedAverage, getDefaultDate, getSlicedStockData, getFormattedDate, getOffsetDate, getDefaultVisibleOffset} from "./Utils.jsx"


const CustomBar = (props) => {
    const {Color} = props;
    
    return (
        <>
          <Rectangle
            {...props}
            fill={Color == "red" ? "#f25e8d" : "#605ef2"}
            className="recharts-bar-rectangle"
          />
        </>
    )
}


const CustomScatterHigh = (props) => {
    const {Color} = props;

    return (
        <Rectangle
          {...props}
          height={1}
          
          fill="red"
          className="recharts-bar-rectangle"
        />
    )
}

const CustomScatterLow = (props) => {
    const {Color} = props;

    return (
        <Rectangle
          {...props}
          height={1}
          
          fill="blue"
          className="recharts-bar-rectangle"
        />
    )
}

const GraphScrollListener = ({barchartId, eventAddStatus, setEventAddStatus, visibleOffset, setVisibleOffset}) => {
    //console.log("ADDING LISTENER FOR ", barchartId)

    if (window.innerWidth < 768)
        return
    
    var element = document.getElementById(`barchart-scrollable-${barchartId}`)
    if (element == null || eventAddStatus)
        return

    element.addEventListener('wheel', preventScroll, {passive: false});
    //console.log("EVENT ADDED")

    
    function preventScroll(e){
        e.preventDefault();
        e.stopPropagation();
        
        var scrollAmount = e.deltaY > 0 ? 2 : -2
        //console.log("SCROLLED", scrollAmount)
        
        setVisibleOffset((prevOffset) => (
            [prevOffset[0] + scrollAmount > 0 ? prevOffset[0] + scrollAmount : 0, prevOffset[1]]
        ))

        return false;
    }

    setEventAddStatus(true)
}

/*
  Component that renders data inside stockData.

  - stockData: object with individual trade data
  {
    ...
    data: [...]  <--- list of trades 
  }

  - visibleOffset: offset for scrolling the graph where B is the visible area 
  [A, B] =>  [ |---- B ---| ... A ... ]

  - selected: ticker for currently selected stock
  "MMM"

  - fetchingStatus:
  TradeDataLoader is fetching data -> true
  TradeDataLoader is not fetching data -> false
*/
export function StockGraphBox({
    barchartId=0,
    stockData, setStockData, // object with individual trade data
    visibleOffset, setVisibleOffset, // offset for scrolling the graph 
    selected, setSelected, // ticker for currently selected stock
    fetchingStatus,
    startDate, setStartDate,
    endDate, setEndDate,
    register, setRegister,
    period, setPeriod,
    callback=(e)=>{},     
    showControls=true,
}) {
    const [avgWeight, setAvgWeight] = useState(0.2)
    const [showAverage, setShowAverage] = useState(false)
    const [showVolume, setShowVolume] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [visibility, setVisibility] = useState(true)
    const [eventAddStatus, setEventAddStatus] = useState(false)

    const [registerButtonText, setRegisterButtonText] = useState()

    const [chartType, setChartType] = useState("bar")

    const [graphWidth, setGraphWidth] = useState(600)
    const [graphHeight, setGraphHeight] = useState(570)

    const [stockDataLen, setStockDataLen] = useState(0)

    useMemo(() => {
        
        
        window.addEventListener('resize', function(event) {
            let tmp = document.getElementById(`barchart-scrollable-${barchartId}`).offsetWidth
            if (tmp < 530)
                setVisibleOffset((prevVisibleOffset) => ([prevVisibleOffset[0], prevVisibleOffset[0]/2]))
            tmp = window.innerWidth-105
            
            setGraphWidth(tmp)
        }, true)
    }, [])
    
    
    
    useEffect(() => {
        setRegisterButtonText(register.has(selected) ? "Remove" : "Add")
    }, [register, selected])

    useEffect(() => {
        let tmp = document.getElementById(`barchart-scrollable-${barchartId}`).offsetWidth
        if (tmp < 530) 
            tmp = window.innerWidth-105
        setGraphWidth(tmp)
    }, [])
    
    

    const GraphRegister = () => {
        const callback = () => {
            if (register.has(selected))
                setRegister((prevRegister) => {
                    var element = document.getElementById(`stock-item-${selected}`)
                    if (element)
                        element.style.border = "unset"
                    
                    prevRegister.delete(selected)
                    setRegisterButtonText("Add")
                    return prevRegister
                })
            else {
                setRegister((prevRegister) => {
                    var element = document.getElementById(`stock-item-${selected}`)
                    if (element)
                        element.style.border = "5px solid #0095f7"
                    
                    prevRegister.add(selected)                     
                    setRegisterButtonText("Remove")
                    return prevRegister
                })
            }
        }
        
        return (<button className="barchart-register" onClick={() => callback()}>{registerButtonText}</button>)

    }
    
    const GraphControls = () => {

      const capitalLetterUpperCase = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }

      if (showControls)
          return (
              <div className="barchart-controls">
                <GraphRegister />
                <div 
                  className={'controls-btn' + (showVolume ? ' btn-clicked' : '')}
                  onClick={() => {
                    setShowVolume(!showVolume)
                  }}
                  >
                  Volume
                </div>

                <div 
                  className={'controls-btn' + (showAverage ? ' btn-clicked' : '')}
                  onClick={() => {
                    setShowAverage(!showAverage)
                  }}
                  >
                  Average
                </div>

                <div className='controls-btn'>
                  <label htmlFor="end">Weight</label>
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

                  <div className='controls-btn'>
                    <label htmlFor="period">Period</label>
                    <select
                      name="period"
                      value={period}
                      onChange={(event) => {
                          console.log("PERIOD", event.target.value)
                          setPeriod(event.target.value)
                          setVisibleOffset(getDefaultVisibleOffset(event.target.value))

                          const defaultDates = getDefaultDate(event.target.value)
                          setStartDate(defaultDates[0])
                          setEndDate(defaultDates[1])
                      }}>
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="quarter">Quarter</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                
                </div>
          )
  }

    const GraphControls2 = () => {        
        return (
            <div className="barchart-controls">
              
              <GraphRegister />
              <img
                src="/src/assets/spacer.svg"
                style={{height:"35px", width:"35px", marginTop: "5px", marginLeft:"-10px", marginRight:"8px", opacity:"0.3" }}
              />

              <div >
                <label className="controls-label" htmlFor="chart">Chart</label>
                <select
                  name="chart"
                  value={chartType}
                  className="controls-dropdown"
                  onChange={(event) => {
                      setChartType(event.target.value)
                  }}>
                  <option value="line">Line</option>
                  <option value="bar">Bar</option>
                  <option value="candle">Candle</option>
                </select>
              </div>
              
              <div>
                <label className="controls-label" htmlFor="period">Period</label>
                <select
                  name="period"
                  value={period}
                  className="controls-dropdown"
                  onChange={(event) => {
                      setPeriod(event.target.value)
                      setVisibleOffset(getDefaultVisibleOffset(event.target.value))

                      const defaultDates = getDefaultDate(event.target.value)
                      setStartDate(defaultDates[0])
                      setEndDate(defaultDates[1])
                  }}>
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="quarter">Quarter</option>
                  <option value="year">Year</option>
                </select>
              </div>

              <div >
                <label className="controls-label">Average</label>
                <input
                  type="checkbox"
                  className="controls-checkbox"
                  defaultChecked={showAverage}
                  onChange={() => {                        
                      setShowAverage(!showAverage)
                  }}/>
              </div>

              <div>
                <label className="controls-label">Weight</label>
                <input
                  type="number"
                  max={1.0}
                  min={0.0}
                  step={0.05}
                  className="controls-number"
                  value={avgWeight}
                  onKeyDown={(e) => {
                      e.preventDefault()
                      return false
                  }}
                  onChange={(event) => {
                      setAvgWeight(event.target.value)
                  }}/>
              </div>

              
              <div>
                <label className="controls-label" htmlFor="volume">Volume</label>
                <input
                  type="checkbox"
                  name="volume"
                  defaultChecked={showVolume}
                  className="controls-checkbox"
                  onChange={() => {
                      setShowVolume(!showVolume)
                  }}/>
              </div>
              <img
                src="/src/assets/spacer.svg"
                style={{height:"35px", width:"35px", marginTop: "5px", marginLeft:"-20px", opacity:"0.3" }}
              />


              <GraphZoomButton />
              {/* <button */}
              {/*   className="controls-visibility" */}
              {/*   onClick={() => setVisibility((currVisibility) => !currVisibility)} */}
              {/* >{visibility ? "Hide" : "Show"}</button> */}
            </div>
                        
        )
    }
    
    const GraphZoomButton = () => (
        <div>
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
        </div>
    )

    const calcAverage = (slicedData) => {
        if (slicedData === undefined)
            return
        
        
        let [avg, num] = [0, 0]
        console.log("CALC AVERAGE")
        const newData = slicedData.map((trade) => {
            if (trade === undefined)
                return
            
            [avg, num] = getWeightedAverage(trade, avg, num, avgWeight)
            return {
                ...trade,
                Average: avg
            }
        })

        return newData
    }

    
    const MainGraph = () => {
        let slicedStockData = calcAverage(getSlicedStockData(stockData.data, visibleOffset))
               
        if (chartType == "line"){
            return ( // linechart when zoomed out
                <>
                  <LineChart
                    className="barchart-chart"
                    height={graphHeight}
                    width={graphWidth}
                    data={slicedStockData}
                    margin={{
                        top: 20,
                        left: -20,
                        bottom: 70,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis height={80} dataKey="Date" angle={-45} textAnchor='end'/>
                    <YAxis type="number" />

                    {/* <ToolTipClickListener /> */}
                    <Tooltip id="clickable-tooltip" content={<CustomToolTip />} /* cursor={<CustomCursor />} */  isAnimationActive={false}/>
                    
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
        }
        else if (chartType == "candle") {
            return (  //normal chart when zoomed in 
                <>
                  <ComposedChart
                    className="barchart-chart"
                    height={graphHeight}
                    width={graphWidth}
                    data={slicedStockData}
                    margin={{
                        top: 20,
                        left: -20,
                        bottom: 70,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis height={80} dataKey="Date" angle={-45} textAnchor='end'/>
                    <YAxis type="number" />

                    <Tooltip id="clickable-tooltip" content={<CustomToolTip />} /* cursor={<CustomCursor />} */ isAnimationActive={false}/>

                    <Bar dataKey="Bottom" stackId="a" fill="#FFFFFF00" isAnimationActive={false} onClick={(e) => callback(e)}/> 
                    <Bar shape={CustomBar} dataKey="Area" stackId="a" isAnimationActive={false} onClick={(e) => callback(e)}/>
                    <Line
                      type="monotone"
                      dataKey={showAverage && !fetchingStatus ? "Average" : ""}
                      stroke="#0095f7"
                      dot={false}
                      strokeDasharray="5 5"
                    />
                    <Scatter shape={CustomScatterHigh} name="High" dataKey="High" fill="red" isAnimationActive={false}/>
                    <Scatter shape={CustomScatterLow} name="Low" dataKey="Low" fill="Blue" isAnimationActive={false}/>
                  </ComposedChart>
                </>
            )
        }

        return (  //normal chart when zoomed in 
            <>
              <ComposedChart
                className="barchart-chart"
                height={graphHeight}
                width={graphWidth}
                data={slicedStockData}
                margin={{
                    top: 20,
                    left: -20,
                    bottom: 70,
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis height={80} dataKey="Date" angle={-45} textAnchor='end'/>
                <YAxis type="number" />

                <Tooltip id="clickable-tooltip" content={<CustomToolTip />} /* cursor={<CustomCursor />} */ isAnimationActive={false}/>

                <Bar dataKey="Bottom" stackId="a" fill="#FFFFFF00" isAnimationActive={false} onClick={(e) => callback(e)}/> 
                <Bar shape={CustomBar} dataKey="Area" stackId="a" isAnimationActive={false} onClick={(e) => callback(e)}/>
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

    const VolumeGraph = () => {
        return (
            <BarChart
              className="volume-chart"
              height={graphHeight}
              width={graphWidth}
              data={getSlicedStockData(stockData.data, visibleOffset)}
              margin={{
                  top: 20,
                  bottom: 385,
                  left: 40
              }}>
              
              <Tooltip />
              <Bar
                dataKey={showVolume ? "Volume" : null}
                fill="#8884d8"
                activeBar={<Rectangle fill="#8f8e8c" stroke="blue" />}
                isAnimationActive={false} 
              />
            </BarChart>
        )
    }

    const getWidth = () => {
        let tmp = document.getElementById(`barchart-scrollable-${barchartId}`).offsetWidth
        if (tmp < 530) 
            tmp = window.innerWidth-105
        setGraphWidth(tmp)
    }
    
    // ====== avg ======
    // useEffect(() => {
    //     if (fetchingStatus || !showAverage)
    //         return
        
    //     if (stockData === undefined)
    //         return
       
        
    //     let [avg, num] = [0, 0]
    //     console.log("CALC AVERAGE")
    //     const newData = stockData.data.map((trade) => {
    //         [avg, num] = getWeightedAverage(trade, avg, num, avgWeight)
    //         return {
    //             ...trade,
    //             Average: avg
    //         }
    //     })

    //     setStockData({...stockData, data: newData})
    // }, [fetchingStatus, avgWeight, showAverage])

    
    if (!visibility) {
        return (
            <>
              <StockPreview stockData={stockData}/>
              
            </>
        )
    }

    if (!stockData)
      return (            
          <div
            className='barchart-wrapper'
            id={`barchart-scrollable-${barchartId}`}
            style={{marginBottom:"-80px", padding:"0px"}}
          >
            {/* <GraphScrollListener */}
            {/*   barchartId={barchartId} */}
            {/*   eventAddStatus={eventAddStatus} */}
            {/*   setEventAddStatus={setEventAddStatus} */}
            {/*   visibleOffset={visibleOffset} */}
            {/*   setVisibleOffset={setVisibleOffset} */}
            {/* /> */}
            <StockPreview stockData={stockData}/>
            <GraphControls2 />
            {/* <GraphZoomButton /> */}
            {/* <LoadingSpinny status={fetchingStatus}/> */}

            <div
              id={`barchart-scrollable-${barchartId}`}          
            >
              <h3 id="select-prompt" style={selected ? {display: "none"} : {}}>↓ Select Stock ↓</h3>
              <ComposedChart
                className="barchart-chart"
                height={graphHeight}
                width={graphWidth}
                data={null}
                
                margin={{
                    top: 20,
                    left: -50,
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
        <div className='barchart-wrapper fadeInDown'>
          <GraphScrollListener
            barchartId={barchartId}
            eventAddStatus={eventAddStatus}
            setEventAddStatus={setEventAddStatus}
            visibleOffset={visibleOffset}
            setVisibleOffset={setVisibleOffset}
          />
          <StockPreview stockData={stockData}/>
          <GraphControls2 />

          {/* <LoadingSpinny status={fetchingStatus}/> */}
          <div className="barchart-chart-wrapper"  id={`barchart-scrollable-${barchartId}`}>
              <MainGraph />
              <VolumeGraph />
          </div>
          {/* <getWidth /> */}
        </div>
        
    )

}









