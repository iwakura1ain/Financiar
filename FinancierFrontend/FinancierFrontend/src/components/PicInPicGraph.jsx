import {useState, useEffect} from "react"

import {getSlicedStockData} from "./Utils.jsx"


import { ComposedChart, LineChart, Line, Rectangle, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export function PIPGraphBox({
    selected, stockData, visibleOffset, width=400, height=200
}) {
    const [visibility, setVisibility] = useState(true)

    useEffect(() => {
        console.log(visibility)
    }, [visibility])

    const listenToScroll = () => {
        let heightToHideFrom = 500;
        const winScroll = document.body.scrollTop ||
              document.documentElement.scrollTop;

        if (winScroll < heightToHideFrom) {
            // visibility &&      // to limit setting state only the first time
            setVisibility(false);
        } else {
            setVisibility(true);
        }
    }
    
    useEffect(() => {
        window.addEventListener("scroll", listenToScroll);
        return () =>
        window.removeEventListener("scroll", listenToScroll);
    }, [])


    if (stockData) {
        if (visibility) {
            return (
                <div className="pic-in-pic-box">
                  <button
                    className="pic-in-pic-button" /* style={{bottom:"-20px"}} */
                    onClick={() => window.scrollTo({
                        top: document.body.scrollTop,
                        left: 0,
                        behavior: 'smooth'
                    })}
                  >UP</button>
                  <div>
                    <LineChart
                      className="barchart-chart pic-in-pic-graph"
                      width={width}
                      height={height}
                      data={getSlicedStockData(stockData.data, visibleOffset)}
                      margin={{
                          top: 15,
                          right: 30,
                          left: -20,
                          bottom: 18,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <YAxis type="number" />
                      <Line type="monotone" dataKey="Close" stroke="#0095f7" dot={false} />
                    </LineChart>
                  </div>
                </div>
            )
        }

        return (
            <div className="pic-in-pic-box">
              <button
                className="pic-in-pic-button"
                style={{position:"fixed", bottom:"10px", right: "20px"}}             
                onClick={() => {
                    document.getElementById(`stock-item-${selected}`)
                        .scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
                }}
              >BACK</button>
            </div>
        )
    }        

    return (
        <div>
          
        </div>
    )


        
}


