const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque, tortor nec mattis feugiat, velit purus euismod odio, quis vulputate velit urna sit amet enim. Maecenas vulputate auctor ligula sed sollicitudin."

export function StockInfoItem({
    selected,
    setSelected,
    name="Stock",
    ticker="---",
    rating=0,
    sector="finance",
    desc=lorem
}) {
    return (
        <div className="col-md-4">
          <div className="testimonial-box">
            <div className="row personal-info">
              
              <button className="testimonial-button" onClick={() => {
                  setSelected(ticker)
                  console.log(`selected ${ticker}`)
              }}>
                <div className="col-md-2 col-xs-2">
                  <div className="profile-picture review-one"></div>
                </div>
                <div className="col-md-10 col-xs-10" >
                  <h6 className="testimonial-name">{name}</h6>
                  <span className="rating">{rating} <i className="icon ion-md-star"></i></span>
                  <small className="testimonial-info">{sector} | {ticker}</small>
                </div>
               </button>
            </div>
            <p>{desc}</p>
          </div>
        </div>
    )
}
