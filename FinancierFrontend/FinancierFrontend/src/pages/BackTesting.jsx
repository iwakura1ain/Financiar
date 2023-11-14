import {useState, useEffect} from 'react';

import {StockGraphBox} from "../components/StockGraph.jsx"
import {TradeDataLoader2} from "../components/TradeDataLoader.jsx"
import {GetDefaultDate} from "./StockInfoListing.jsx"

/*
  Page used for backtesting.

  Use TradeDataloader and StockGraph to create Backtesting page.
  Keep in mind when using multiple TradeDataloaders and StockGraphs,
  they require seperate stockData and startDate/endDate states to work. 
*/

function StockData (
    selected,
    stockData=undefined,
    visibleOffset=[0, 180],
    fetchingStatus=false,
    startDate=GetDefaultDate()[1],
    endDate=GetDefaultDate()[0]
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

export function BackTesting() {    
    var stockDataList = [
        StockData("MMM"),
        StockData("AOS"),
         StockData("ABT")
    ]
    
    return (
        <section id="testimonials">
          <div className="testimonials-container width-full">             
            <div className="title-block animated fadeInDown">
              <h2 className='testimonials-title'>BackTesting</h2>
              <p>Access all stocks anytime, anywhere, with ease.</p>
              <div>
                {stockDataList.map((stockData, i) => (
                    <div>
                      <TradeDataLoader2
                        key={i}
                        {...stockDataList[i]}
                      />
                      <StockGraphBox
                        key={i}
                        {...stockDataList[i]}
                        barchartId={i}
                      />
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>
    )
}







