
import redis
import pandas as pd
import json

rconn = redis.Redis(host='redis', port=6379, decode_responses=True)

def get_empty_date_ranges(keys, vals):
    retval = []

    tmp = [-1, -1]
    for i, (k, v) in enumerate(zip(keys, vals)):
        if v is None and tmp[0] == -1:
            tmp[0] = i

        if v is not None and tmp[0] != -1:
            tmp[1] = i-1
            retval.append([keys[tmp[0]], keys[tmp[1]]])
            tmp = [-1, -1]

    if tmp[0] != -1:
        tmp[1] = len(keys)-1
        retval.append([keys[tmp[0]], keys[tmp[1]]])
        
    return retval
    
def set_cache_list(vals, ticker):
    if vals:
        rconn.mset({f"{ticker}-{v['Date']}":json.dumps(v) for v in vals})
    
def set_cache_df(vals, ticker):
    #rconn.mset({v["Date"]:json.dumps(v.to_dict()) for i, v in vals.iterrows()})
    
    rconn.mset({f"{ticker}-{v['Date']}":json.dumps(v.to_dict()) for i, v in vals.iterrows()})
    
def get_cache(start, end, ticker):
    dates = list(map(lambda d: str(d)[:10], pd.date_range(start=start, end=end)))
    keys = [f"{ticker}-{d}" for d in dates]
    vals = rconn.mget(keys=keys)
    vals = list(map(lambda v:None if v is None else json.loads(v), vals))
    
    return {k:v for k, v in zip(dates, vals)}, get_empty_date_ranges(dates, vals)
    


