import FinanceDataReader as fdr

def query_fdr(ticker="", start="2020-01-01", end="2021-01-01"):
    return fdr.DataReader(ticker, start, end)
    












