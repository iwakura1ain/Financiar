import FinanceDataReader as fdr
import numpy as np
import pandas as pd

from .cache import get_cache, set_cache_df, set_cache_list

def parse_slice(data):
    #data["Date"] = list(map(lambda d: str(d)[:-9], data["Date"]))

    isRising = lambda data: data["Open"].iloc[0] <= data["Close"].iloc[-1]     
    
    return {
        "Open": data["Open"].iloc[0],
        "Close": data["Close"].iloc[-1],
        # "Adj Close": data["Adj Close"].iloc[-1],
        "High": max(data["High"]),
        "Low": min(data["Low"]),
        "Volume": sum(data["Volume"]),
        "Color": "red" if isRising(data) else "blue",
        "Date": str(data["Date"].iloc[0]),
        "DateEnd": str(data["Date"].iloc[-1]),
        "Bottom": data["Open"].iloc[0] if isRising(data) else data["Close"].iloc[-1],
        "Area": np.trunc(100 * abs(data["Close"].iloc[-1] - data["Open"].iloc[0])) / 100
    }

def get_indices(dates, data):
    for i in range(len(dates)):
        start = data.index[0] if i == 0 else dates[i-1]
        end = dates[0] if i == 0 else dates[i]
        yield start, end

def set_dates(data):
    data2 = data.copy()
    data2.index = pd.to_datetime(data2["Date"])
    data2["year"] = data2.index.year
    data2["month"] = data2.index.month
    data2["week"] = data2.index.strftime("%V")

    return data2


def parse_year(data):
    years = data.drop_duplicates(["year"], keep="last").index #year
    retval = []
    
    for start, end in get_indices(years, data):
        retval.append(parse_slice(data[start:end]))

    return retval

def parse_quarter(data):
    quarter = [3, 6, 9, 12]
    tmp = data.loc[data["month"].isin(quarter)]
    quarters = tmp.drop_duplicates(["year", "month"], keep="last").index
    retval = []
    
    for start, end in get_indices(quarters, data):
        retval.append(parse_slice(data[start:end]))

    return retval

    
    
def parse_month(data):
    months = data.drop_duplicates(["year", "month"], keep="last").index #month
    retval = []

    for start, end in get_indices(months, data):
        retval.append(parse_slice(data[start:end]))

    return retval

def parse_week(data):
    weeks = data.drop_duplicates(["year", "month", "week"], keep="last").index #week
    retval = []

    for start, end in get_indices(weeks, data):
        retval.append(parse_slice(data[start:end]))

    return retval

def parse_day(data):
    data = data.drop(["year", "month", "week"], axis=1)
    data["Color"] = data.apply(lambda t: "red" if t['Open'] <= t['Close'] else "blue", axis=1)
    data["Bottom"] = data.apply(lambda t: t["Open"]  if t['Color'] == "red" else t["Close"], axis=1)
    data["Area"] = data.apply(lambda t: abs(np.trunc(100 * (t["Open"] - t["Close"])) / 100), axis=1)

    #data["Date"] = list(map(lambda d: str(d)[:-9], data["Date"]))
    
    #return data.T.to_dict().values()
    return data.to_dict('records')


def get_date_str(row):
    return str(row["Date"])[:10]

def query_fdr(**kwargs):
    start = kwargs.get("start")
    end = kwargs.get("end")
    ticker = kwargs.get("ticker")
    period = kwargs.get("period")

    if start is None or end is None:
        start="2020-01-01"
        end="2021-01-01"

    # caching
    data, uncached = get_cache(start, end, ticker)
    for u_start, u_end in uncached:
        tmp = fdr.DataReader(ticker, u_start, u_end)
        tmp = tmp.dropna()
        tmp = tmp.reset_index()
        tmp["Date"] = tmp["Date"].map(lambda t: t.strftime("%Y-%m-%d"))
        
        set_cache_df(tmp, ticker)
        data.update({f"{row['Date']}": row.to_dict() for i, row in tmp.iterrows()})

    invalid = [{"Date":k, "Open": -1, "High":-1, "Low":-1, "Close": -1} for k, v in data.items() if v is None]
    set_cache_list(invalid, ticker)

    
    data = pd.DataFrame.from_records([d for d in data.values() if d is not None])
    #data = pd.DataFrame.from_records([d for d in data.values()])
    data = data.replace({-1:None})
    data = data.reset_index()
    data = data.dropna()
    data = set_dates(data)
    
    for k in ["Open", "High", "Low", "Close"]:
        data[k] = np.trunc(100 * data[k]) / 100

    funcs = {
        "day": parse_day,
        "week": parse_week,
        "month": parse_month,
        "quarter": parse_quarter,
        "year": parse_year
    }
    
    return funcs[period](data) if period in list(funcs.keys()) else parse_day(data)
    












