const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque, tortor nec mattis feugiat, velit purus euismod odio, quis vulputate velit urna sit amet enim. Maecenas vulputate auctor ligula sed sollicitudin."


export function StockInfoItem({
    selected, setSelected,
    name="Stock", 
    ticker="---", 
    rating=0, rateStock,
    sector="finance", 
    desc=lorem}) {

    const getLogoName = (name) => (name.replaceAll(" ", "_"))

    
    return (
        <div className="col-sm-6 col-md-4">
          <div className="testimonials-box">
            <div className="row personal-info">
              
              <button className="testimonials-button" onClick={() => {
                  setSelected(ticker)
                  console.log(`selected ${ticker}`)
              }}>
                <div className="testimonials-wrapper">
                  <div className="col-md-2 col-xs-2 padding-none">
                    <img className="icon testimonials-logo" src={`/src/assets/logos/${getLogoName(name)}.svg`} alt={name}></img>
                  </div>
                  <div className="col-md-10 col-xs-10 testimonial-flex" >
                    <div className="testimonials-name-info">
                      <h6 className="testimonials-name">{name}</h6>
                      <small className="testimonials-info">{sector} | {ticker}</small>
                      <button onClick={() => {
                          console.log("RATE PRESSED")
                          rateStock(ticker)
                      }}>
                        <span className="rating">{rating} <i className="icon ion-md-star"></i></span>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="testimonials-desc">{desc}</p>
              </button>
            </div>
          </div>
        </div>
    )
}
