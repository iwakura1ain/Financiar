import {useState, useEffect} from 'react';


import {
    ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, 
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
          height={2}
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
          height={2}
          fill="blue"
          className="recharts-bar-rectangle"
        />
    )
}

const GraphScrollListener = ({barchartId, eventAddStatus, setEventAddStatus, visibleOffset, setVisibleOffset}) => {
    //console.log("ADDING LISTENER FOR ", barchartId)
    
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
    height=600, width=1000,
    showControls=true,
}) {
    const [avgWeight, setAvgWeight] = useState(0.2)
    const [showAverage, setShowAverage] = useState(false)
    const [showVolume, setShowVolume] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [visibility, setVisibility] = useState(true)
    const [eventAddStatus, setEventAddStatus] = useState(false)

    const [registerButtonText, setRegisterButtonText] = useState()

    useEffect(() => {
        setRegisterButtonText(register.has(selected) ? "Remove" : "Add")
    }, [register, selected])
    
    // TODO: refactor into object
    const GraphSize = () => {
        // console.log('outer-width:',window.outerWidth, 'outer-height:', window.outerHeight);
        // console.log('inner-width:',window.innerWidth, 'inner-height:', window.innerHeight);
        
        if(window.innerWidth >= 2160) {
            width = window.innerWidth*0.7
            height = 700
        }

        if(window.innerWidth >= 1440 && window.innerWidth < 2160) {
            width = window.innerWidth*0.7
            height = 600
        }

        if(window.innerWidth >= 992 && window.innerWidth < 1440) {
            width = window.innerWidth*0.9
            height = 540
        }

        if(window.innerWidth >= 768 && window.innerWidth < 992) {
            width = window.innerWidth*0.7
            height = 500
        }

        //console.log('width:', width, 'height:', height);
    }
    GraphSize(); 

    // TODO: refactor into component
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
        
        return (<button onClick={() => callback()}>{registerButtonText}</button>)

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
                    }}
                    />
                </div>
                <div 
                  className='controls-btn'
                  onClick={ () => {setShowOptions(!showOptions)}}>
                  {capitalLetterUpperCase(period)}
                  
                  <div className={'btn-select' + (showOptions ? '' : ' hide')}>
                      <ul>
                        <li className='select-option-first' onClick={ (event) => {
                          setPeriod(event.target.innerText.toLowerCase())
                          setVisibleOffset(getDefaultVisibleOffset(event.target.innerText.toLowerCase()))

                          const defaultDates = getDefaultDate(event.target.innerText.toLowerCase())
                          setStartDate(defaultDates[0])
                          setEndDate(defaultDates[1])
                          }}>Day</li>
                        <li className='select-option' onClick={ (event) => {
                          setPeriod(event.target.innerText)
                          setVisibleOffset(getDefaultVisibleOffset(event.target.innerText.toLowerCase()))

                          const defaultDates = getDefaultDate(event.target.innerText.toLowerCase())
                          setStartDate(defaultDates[0])
                          setEndDate(defaultDates[1])
                          }}>Week</li>
                        <li className='select-option' onClick={ (event) => {
                          setPeriod(event.target.innerText)
                          setVisibleOffset(getDefaultVisibleOffset(event.target.innerText.toLowerCase()))

                          const defaultDates = getDefaultDate(event.target.innerText.toLowerCase())
                          setStartDate(defaultDates[0])
                          setEndDate(defaultDates[1])
                          }}>Month</li>
                        <li className='select-option' onClick={ (event) => {
                          setPeriod(event.target.innerText)
                          setVisibleOffset(getDefaultVisibleOffset(event.target.innerText.toLowerCase()))

                          const defaultDates = getDefaultDate(event.target.innerText.toLowerCase())
                          setStartDate(defaultDates[0])
                          setEndDate(defaultDates[1])
                          }}>Quarter</li>
                        <li className='select-option-last' onClick={ (event) => {
                          setPeriod(event.target.innerText)
                          setVisibleOffset(getDefaultVisibleOffset(event.target.innerText.toLowerCase()))

                          const defaultDates = getDefaultDate(event.target.innerText.toLowerCase())
                          setStartDate(defaultDates[0])
                          setEndDate(defaultDates[1])
                          }}>Year</li>
                      </ul>
                  </div>
                </div>
              </div>
          )
  }

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
        let slicedStockData = getSlicedStockData(stockData.data, visibleOffset)
        
        if (visibleOffset[1] > 250)
            return ( // linechart when zoomed out
                <>
                  <LineChart
                    className="barchart-chart"
                    width={width}
                    height={height}
                    data={slicedStockData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
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

        return (  //normal chart when zoomed in 
            <>
              <ComposedChart
                className="barchart-chart"
                width={width}
                height={height}
            /* data={[...stockData.data, ...Array.apply(null, Array(stockData.count-stockData.data.length)).map(function () {})]} */
                data={slicedStockData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
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

    const VolumeGraph = () => {
        return (
            <BarChart
              className="volume-chart"
              width={width}
              height={height-320}
              data={getSlicedStockData(stockData.data, visibleOffset)}

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
            [avg, num] = getWeightedAverage(trade, avg, num, avgWeight)
            
            return {
                ...trade,
                Average: avg
            }
        })

        setStockData({...stockData, data: newData})
    }, [fetchingStatus, avgWeight, showAverage])
    
    if (!visibility) {
        return (
            <GraphControls />
        )
    }

    if (!stockData)
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
            {/* <GraphControls /> */}
            <GraphZoomButton />
            <LoadingSpinny status={fetchingStatus}/>

            <div   id={`barchart-scrollable-${barchartId}`}>
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
              {/* <GraphControls /> */}
            </div>
          </div>
      )        

    return (
        <div className='barchart-wrapper'> 
          {/* <GraphControls /> */}
          <GraphScrollListener
            barchartId={barchartId}
            eventAddStatus={eventAddStatus}
            setEventAddStatus={setEventAddStatus}
            visibleOffset={visibleOffset}
            setVisibleOffset={setVisibleOffset}
          />
          <StockPreview stockData={stockData}/>
          <GraphControls />
          <GraphZoomButton />

          {/* <LoadingDots status={fetchingStatus}/> */}
          <LoadingSpinny status={fetchingStatus}/>
          <div   id={`barchart-scrollable-${barchartId}`}>
            <MainGraph />
            <VolumeGraph />
          </div>

        </div>
        
    )

}



