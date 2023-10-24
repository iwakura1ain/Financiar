import FinanceDataReader as fdr

def query_fdr(**kwargs):
    start = kwargs.get("start")
    end = kwargs.get("end")
    ticker = kwargs.get("ticker")

    if start is None or end is None:
        start="2020-01-01"
        end="2021-01-01"
    
    data = fdr.DataReader(ticker, start, end)
    data = data.reset_index()
    data["Date"] = list(map(lambda d: str(d)[:-9], data["Date"]))
    return data
    












