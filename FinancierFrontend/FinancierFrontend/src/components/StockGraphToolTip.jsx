export const CustomToolTip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
              {payload[0].payload.Color == "red" ?
               <img src="/src/assets/rising.svg" style={{color:"red", height:"20px", width:"20px"}}></img> :
               <img src="/src/assets/falling.svg" style={{color:"blue", height:"20px", width:"20px"}}></img> }

              <p className="label">{`${label} : ${parseFloat(payload[0].value).toFixed(2)}`}</p>
              <div>
                {payload.map((pld) => (
                    <div style={{ display: "inline-block", padding: 10 }}>
                      <div>{pld.Close}</div>
                      <p>{pld.Color}</p>
                      {/* <div>{pld.payload.Color}</div> */}
                    </div>
                ))}
              </div>
            </div>
        );
    }

    return null;
};
