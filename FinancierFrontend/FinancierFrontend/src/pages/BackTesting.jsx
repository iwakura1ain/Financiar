/*
  Page used for backtesting.

  Use TradeDataloader and StockGraph to create Backtesting page.
  Keep in mind when using multiple TradeDataloaders and StockGraphs,
  they require seperate stockData and startDate/endDate states to work. 
*/
export function BackTesting() {
    return (
        <section id="testimonials">
          <div className="testimonials-container width-full">             
            <div className="title-block animated fadeInDown">
              <h2 className='testimonials-title'>BackTesting</h2>
              <p>Access all stocks anytime, anywhere, with ease.</p>
            </div>
          </div>
        </section>
    )
}







