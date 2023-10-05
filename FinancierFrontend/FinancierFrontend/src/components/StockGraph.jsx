import {useState, useEffect} from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {StockAPIRoute} from "../APIRoutes.jsx"

const testData = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

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
                .then(setStockData)
                .catch(console.log)
        }
    }, [selected])

    if (stockData) {
        return (
            <div className='barchart-wrapper'>
              {/* <ResponsiveContainer width="100%" height="100%"> */}
                <BarChart className="barchart-chart"
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
                  {/* <Bar dataKey="Open" stackId="a" fill="#8884d8" /> */}
                  <Bar dataKey="Close" stackId="a" fill="#82ca9d" />
                </BarChart>
                <button className="barchart-btn" onClick={() => setSelected()}>Close</button>
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
