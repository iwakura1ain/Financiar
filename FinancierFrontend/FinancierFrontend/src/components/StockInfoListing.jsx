import {StockInfoItem} from "./StockInfoItem.jsx"
import {SearchBar} from "./Searchbar.jsx"

export function StockInfoListing() {
    const stocks = [
        {
            name:"Apple",
            ticker: "APPL",
            rating:5,
            info:"Electronics"
        },
        {
            name:"Apple",
            ticker: "APPL",
            rating:5,
            info:"Electronics"
        },
        {
            name:"Apple",
            ticker: "APPL",
            rating:5,
            info:"Electronics"
        },
        {
            name:"3M",
            ticker: "MMM",
            rating:3,
            info:"Home Appliances"
        }
    ]
    
    return (
        <>
          <section  id="testimonials">

            <div className="container width-full">
              
              <div className="title-block animated fadeInDown">
                <h2>The Best Digital Agencies Recommend Our Software</h2>
                <p>Industry experts mention their experience using our software and the excellent results they have achieved</p>
              </div>

              <SearchBar />
              
              <div className="row">
                {stocks.map((stock, i) => (
                    <StockInfoItem key={i} {...stock}/>
                ))}

              </div>
            </div>
          </section>
          

        </>
    )
}
