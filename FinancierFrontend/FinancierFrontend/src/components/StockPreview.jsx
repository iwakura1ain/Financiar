const defaultStockData = {
    name: "Select Stock",
    ticker: "",
    sector: "",
    data: [{
        Open: "0.00",
        Close: "0.00",
        High: "0.00",
        Low: "0.00",
        Date: "0000-00-00"
    }]
}

export const StockPreview = ({stockData=defaultStockData}) => {
        // Todo: 
        // when selected, replace title(Financiar) with StockPreview Component
        // add some animations when replacing.
    // maybe add the 'ADD' button(register) by the component?
    
    
    if (stockData){
        const latestStockData = stockData.data[stockData.data.length-1]
        
        return ( 
            <div className="preview-wrapper">
                <div className="preview-label">
                    <div className="label-name">{stockData.name}</div>
                    <div className="label-ticker">{stockData.ticker}</div>
                    <div className="preview-sector">{stockData.sector}</div>
                </div>
                <div className="preview-stock">
                  <div className="stock-open">Opening Price {latestStockData.Open}</div>
                  <div className="stock-close-wrapper" style={{display:'flex', alignItems: 'center'}}>
                    <div className="stock-close" style={{marginRight:'5px'}}>Closing Price</div>
                    <div className="stock-close">{latestStockData.Close}</div>
                    <img
                      src={
                          latestStockData.Color === 'red' ? "/src/assets/rising.svg" : "/src/assets/rising.svg"
                      }
                      style={{color:"red", height:"20px", width:"20px"}}/>
                  </div>
                  <div className="stock-high">Highest {latestStockData.High}</div>
                  <div className="stock-bottom">Lowest {latestStockData.Low}</div>
                  <div className="stock-date">(date: {latestStockData.Date})</div>
                </div>
            </div>
        )
    }
}



