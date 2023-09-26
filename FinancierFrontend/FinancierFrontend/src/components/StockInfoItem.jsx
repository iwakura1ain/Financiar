const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque, tortor nec mattis feugiat, velit purus euismod odio, quis vulputate velit urna sit amet enim. Maecenas vulputate auctor ligula sed sollicitudin."

export function StockInfoItem({
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
              <div className="col-md-2 col-xs-2">
                <div className="profile-picture review-one"></div>
              </div>
              <div className="col-md-10 col-xs-10">
                <h6>{name} <span className="rating">{rating} <i className="icon ion-md-star"></i></span></h6>
                <small>{sector} | {ticker}</small>
              </div>
            </div>
            <p>{desc}</p>
          </div>
        </div>
    )
}
