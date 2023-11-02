import FinanceDataReader as fdr
import numpy as np

def query_fdr(**kwargs):
    start = kwargs.get("start")
    end = kwargs.get("end")
    ticker = kwargs.get("ticker")

    if start is None or end is None:
        start="2020-01-01"
        end="2021-01-01"
    
    data = fdr.DataReader(ticker, start, end)
    data = data.reset_index()
    data = data.dropna()

    data['Color'] = data.apply(lambda t: "red" if t['Open'] <= t['Close'] else "blue", axis=1)
    data["Bottom"] = data.apply(lambda t: t["Open"]  if t['Color'] == "red" else t["Close"], axis=1)
    data["Area"] = data.apply(lambda t: abs(np.trunc(100 * (t["Open"] - t["Close"])) / 100), axis=1)
    
    for k in ["Open", "High", "Low", "Close", "Adj Close"]:
        data[k] = np.trunc(100 * data[k]) / 100

    

    data["Date"] = list(map(lambda d: str(d)[:-9], data["Date"]))
    
    return data
    












