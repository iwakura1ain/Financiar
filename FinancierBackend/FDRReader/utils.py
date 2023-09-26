import FinanceDataReader as fdr

def get_ticker_data(_, ticker, start="2020-01-01", end="2023-01-01"):
    return fdr.DataReader(ticker, start, end)
        
    
if __name__=="__main__":
    print(get_ticker_data(None, "MMM"))














