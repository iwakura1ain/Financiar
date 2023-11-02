import {useState, useEffect} from "react"

import {StockGraphBox} from "./StockGraph.jsx"

export function GraphPictureInPicture({
    stockData, setStockData, nextStockDataPage, setNextStockDataPage,  selected, setSelected
}) {
    const [visibility, setVisibility] = useState(true)

    const listenToScroll = () => {
        let heightToHideFrom = 300;
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


    if (visibility) {
        return (
            <div className="pic-in-pic-box">
              <button
                className="pic-in-pic-button" /* style={{bottom:"-20px"}} */
                onClick={() => window.scrollTo(0, 0)}
              >UP</button>
              <StockGraphBox                  
                stockData={stockData}
                setStockData={setStockData}
                nextStockDataPage={nextStockDataPage}
                setNextStockDataPage={setNextStockDataPage}
                selected={selected}
                setSelected={setSelected}
                height={200}
                width={400}
                small={true}
              />
            </div>
        )
    }
    
    
}


