export const CustomToolTip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {
        
        return (
            <div className="custom-tooltip">
              <div className="tooltip-container">
                <div style={{display:"flex", justifyContent: "space-between"}}>
                  <p className="tooltip-date">{payload[0].payload.Date}</p>  
                  {payload[0].payload.Color == "red" ? 
                    <img src="/src/assets/rising.svg" style={{color:"red", height:"20px", width:"20px"}}></img> : 
                    <img src="/src/assets/falling.svg" style={{color:"blue", height:"20px", width:"20px"}}></img>}
                </div>
                {/* <p className="tooltip-label-start">Open:</p> <span className="tooltip-label-end">{payload[0].payload.Open}</span> */}
                <p className="tooltip-label">Open: {payload[0].payload.Open}</p>
                <p className="tooltip-label">Close: {payload[0].payload.Close}</p>
                <p className="tooltip-label">Highest: {payload[0].payload.High}</p>
                <p className="tooltip-label">Lowest: {payload[0].payload.Low}</p>
                <p className="tooltip-label">Volume: {payload[0].payload.Volume}</p>
              </div>
            </div>
        );
    }

    return null;
};
