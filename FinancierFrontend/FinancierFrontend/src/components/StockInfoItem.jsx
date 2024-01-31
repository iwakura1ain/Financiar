import {useState, useEffect} from "react"

import {getLogoName, lorem} from "./Utils.jsx"


export function StockInfoItem({
    register,
    selected, setSelected,
    name="Stock", 
    ticker="---", 
    rating=0, rateStock,
    sector="finance", 
    desc="No Description"}) {

    const elementStyle = () => register.has(ticker) ? {border: "5px solid #0095f7"} : {}
    
    return (  
        <div className="col-sm-6 col-md-6 col-lg-4" >
          <div style={{position:"relative", width:"100%"}}>
            <div className="testimonials-box" id={`stock-item-${ticker}`} style={elementStyle()}>
              <div className="row personal-info">
                
                <button className="testimonials-button" onClick={() => {
                    setSelected((prevSelected) => {

                        if (prevSelected)
                            document.getElementById(`stock-item-${prevSelected}`).style.outline = "unset"

                        document.getElementById(`stock-item-${ticker}`).style.outline = "1px solid #0095f7"

                        return ticker
                    })
                    console.log(`selected ${ticker}`)
                    
                }}>
                  <div className="testimonials-wrapper" >
                    <div className="col-md-2 col-xs-2 padding-none">
                      <img className="icon testimonials-logo" src={`/src/assets/logos/${getLogoName(name)}.svg`} alt={name}></img>
                    </div>
                    <div className="col-md-10 col-xs-10 testimonial-flex" >
                      <div className="testimonials-name-info">
                        <div className="testimonials-flex">
                          <h6 className="testimonials-name">{name}</h6>
                          <small className="testimonials-info">{sector} | {ticker}</small>
                        </div>
                        <button onClick={() => {
                            rateStock(ticker)
                        }}>
                          <span className="rating">{rating} <i className="icon ion-md-star"></i></span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="testimonials-desc">{desc.length < 20 ? lorem : desc}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
    )
}
