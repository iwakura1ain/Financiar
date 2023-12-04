export const StockPreview = ({stockData}) => {
        // Todo: 
        // when selected, replace title(Financiar) with StockPreview Component
        // add some animations when replacing.
        // maybe add the 'ADD' button(register) by the component?
    
    if (stockData){
        const latestStockData = stockData.data.length-1
        
        return ( 
            <div className="preview-wrapper">
                <div className="preview-label">
                    <div className="label-name">{stockData.name}</div>
                    <div className="label-ticker">{stockData.ticker}</div>
                    <div className="preview-sector">{stockData.sector}</div>
                </div>
                <div className="preview-stock">
                    <div className="stock-open">Opening {stockData.data[latestStockData].Open}</div>
                    {
                        stockData.data[latestStockData].Color === 'red' 
                        ? <div className="stock-close-wrapper" style={{display:'flex', alignItems: 'center'}}>
                            <div className="stock-close" style={{marginRight:'5px'}}>Closing</div>
                            <div className="stock-close red">{stockData.data[latestStockData].Close}</div> 
                            <img src="/src/assets/rising.svg" style={{color:"red", height:"20px", width:"20px", marginRight:"10px", marginLeft: "-12px" }}></img>
                          </div>
                        : <div className="stock-close-wrapper" style={{display:'flex', alignItems: 'center'}}>
                            <div className="stock-close" style={{marginRight:'5px'}}>Closing</div>
                            <div className="stock-close blue">{stockData.data[latestStockData].Close}</div> 
                            <img src="/src/assets/falling.svg" style={{color:"blue", height:"20px", width:"20px"}}></img>
                          </div>
                    }
                    <div className="stock-high">Highest {stockData.data[latestStockData].High}</div>
                    <div className="stock-bottom">Lowest {stockData.data[latestStockData].Bottom}</div>
                    <div className="stock-date">(date: {stockData.data[latestStockData].Date})</div>
                </div>
            </div>
        )
    }
}
