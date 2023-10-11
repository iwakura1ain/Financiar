const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque, tortor nec mattis feugiat, velit purus euismod odio, quis vulputate velit urna sit amet enim. Maecenas vulputate auctor ligula sed sollicitudin."

export function StockInfoItem({
  selected, 
  setSelected,
  name="Stock", 
  ticker="---", 
  rating=0, 
  sector="finance", 
  desc=lorem}) 
  {
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
                <div className="profile-picture review-one"></div>
              </div>
              <div className="col-md-10 col-xs-10 testimonial-flex" >
                <div className="testimonials-name-info">
                <h6 className="testimonials-name">{name}</h6>
                {/* <span className="rating">{rating} <i className="icon ion-md-star"></i></span> */}
                <small className="testimonials-info">{sector} | {ticker}</small>
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
