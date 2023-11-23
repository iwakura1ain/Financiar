
import redis
import pandas as pd

rconn = redis.Redis(host='redis', port=6379, decode_responses=True)

def get_empty_key_ranges(keys, vals):
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
    

def set_cache(vals):
    rconn.mset({str(v.Date)[:-9]:v for v in vals})

def get_cache(start, end):
    keys = list(map(lambda d: str(d)[:10], pd.date_range(start=start, end=end)))
    vals = rconn.mget(keys)

    
    return vals, get_empty_key_ranges(keys, vals)
    

