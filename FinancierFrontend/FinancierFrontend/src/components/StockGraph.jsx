import {useState, useEffect} from 'react';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function CleanTradeData(trade) {
    console.log(trade)
    
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



export function StockGraphBox({selected, setSelected}) {
    const [stockData, setStockData] = useState()
    
    useEffect(() => {
        console.log(`inside graph ${selected}`)
        
        if (selected === undefined)
            setStockData()

        else {
            fetch(`/api/fdr/stocks/${selected}`, { headers:{accept: 'application/json'} })
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    return json
                })
                .then((json) => {return Array.from(json).map((trade) => CleanTradeData(trade))})
                .then((cleaned) => {
                    console.log(cleaned)
                    return cleaned
                })
                .then(setStockData)
                .catch(console.log)
        }
    }, [selected])

    if (stockData) {
        return (
            <div style={{height:500, width:1000}}>
              <button onClick={() => setSelected()}>Close</button>
              {/* <ResponsiveContainer width="100%" height="100%"> */}
                <BarChart
                  width={1000}
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
                  <XAxis />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Open" stackId="a" fill="#8884d8" /> 
                  <Bar dataKey="Close" stackId="a" fill="#82ca9d" />
                </BarChart>
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
