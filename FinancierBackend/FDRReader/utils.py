import FinanceDataReader as fdr

def query_fdr(ticker="", start="2020-01-01", end="2021-01-01"):
    data = fdr.DataReader(ticker, start, end)
    data = data.reset_index()
    data["Date"] = list(map(lambda d: str(d)[:-9], data["Date"]))
    return data
    












