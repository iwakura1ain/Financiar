import {useState, useEffect} from 'react';

import {StockGraphBox} from "../components/StockGraph.jsx"
import {TradeDataLoader2} from "../components/TradeDataLoader.jsx"
import {getDefaultDate} from "../components/Utils.jsx"
import {ProfitGraphBox} from "../components/ProfitGraph.jsx"
// import {Registered} from "./StockInfoListing.jsx"

/*
  Page used for backtesting.

  Use TradeDataloader and StockGraph to create Backtesting page.
  Keep in mind when using multiple TradeDataloaders and StockGraphs,
  they require seperate stockData and startDate/endDate states to work. 
*/

var register = new Set()
export const addRegister = (ticker) =>  ticker ? register.add(ticker) : null
export const removeRegister = (ticker) => ticker? register.delete(ticker) : null
export const hasRegister = (ticker) => register.has(ticker)

//TODO: refactor this into StockInfoListing page
function StockData (
    selected,
    stockData=undefined,
    visibleOffset=[0, 180],
    fetchingStatus=false,
    startDate=getDefaultDate()[1],
    endDate=getDefaultDate()[0]
) {
    var target = new Object()
    
    const capitalize = (string) => 
          (string.charAt(0).toUpperCase() + string.slice(1))
    
    const setValue = (value, name) => {
        const [temp, setTemp] = useState(value)
        target[`${name}`] = temp
        target[`set${capitalize(name)}`] = setTemp
    }
    
    setValue(selected, "selected")
    setValue(stockData, "stockData")
    setValue(visibleOffset, "visibleOffset")
    setValue(fetchingStatus, "fetchingStatus")
    setValue(startDate, "startDate")
    setValue(endDate, "endDate")

    return target
}

export function BackTesting () {
    var stockDataList = Array.from(register).map((ticker) => StockData(ticker))
    
    return (
        <section id="testimonials">
          <div className="testimonials-container width-full">             
            <div className="title-block animated fadeInDown">
              <h2 className='testimonials-title'>BackTesting</h2>
              <p>Access all stocks anytime, anywhere, with ease.</p>
              
              <div className="backtest-profit-box">
                <span><h3>Profit Graph</h3></span>
                <ProfitGraphBox barchartId={100}/>
              </div>
              
              <div>
                {stockDataList.map((stockData, i) => (
                    <div className="backtest-box" key={i}>
                      <span><h3>{stockDataList[i].name}</h3></span>
                      <TradeDataLoader2
                        {...stockDataList[i]}
                      />
                      <StockGraphBox
                        {...stockDataList[i]}
                        barchartId={i}
                        showControls={false}
                      />
                      {/* TODO: OFFLOAD GraphScrollListener TO HERE */}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>
    )
}







