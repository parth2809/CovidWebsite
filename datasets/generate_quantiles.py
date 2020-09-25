import numpy as np
import pandas as pd
import json

gleam_data = pd.read_csv("2020-09-07-UCSD_NEU-DeepGLEAM.csv")
locations = pd.read_csv("locations.csv")

df_master = pd.merge(gleam_data, locations, on='location')
df_master = df_master[df_master["type"] == "quantile"]
df_master = df_master.loc[~df_master['abbreviation'].isin(["US"])]
df_master['target_end_date'] = pd.to_datetime(df_master['target_end_date'])
lst = df_master["quantile"].unique().tolist()
quantiles = list(zip(lst[:len(lst) // 2], lst[len(lst) // 2 + 1 : len(lst)][::-1])) + [(0.5, 0.5)]

export_cum = {}
df_all_quantiles = df_master[["abbreviation", "target", "target_end_date", "quantile", "value"]]

for q in quantiles:
    df = df_all_quantiles[df_all_quantiles['quantile'].isin(q) ]
    q_tmp = {}
    for state in df_master.abbreviation.unique():
        #lower_inc = lower.iloc[1::2] on second iloc
        
        if q == (0.5, 0.5):
            lower_cum = df[df["abbreviation"] == state].iloc[::2].reset_index().drop('index', axis=1)
            upper_cum = df[df["abbreviation"] == state].iloc[::2].reset_index().drop('index', axis=1)
        else:
            lower_cum = df[df["abbreviation"] == state].iloc[::2].iloc[::2].reset_index().drop('index', axis=1)
            upper_cum = df[df["abbreviation"] == state].iloc[1::2].iloc[::2].reset_index().drop('index', axis=1)
            
        d = ({"target_end_date": upper_cum["target_end_date"].astype(np.int64) / 1000000, 
         "lower": lower_cum["value"],
         "upper": upper_cum["value"]})
        q_tmp[state] = pd.DataFrame(data = d).values.tolist()
    export_cum[q[1]] = q_tmp

with open("df_quant_cum.json", "w") as outfile:  
    json.dump(export_cum, outfile, indent=4) 

export_inc = {}
df_all_quantiles = df_master[["abbreviation", "target", "target_end_date", "quantile", "value"]]

for q in quantiles:
    df = df_all_quantiles[df_all_quantiles['quantile'].isin(q) ]
    q_tmp = {}
    for state in df_master.abbreviation.unique():
        #lower_inc = lower.iloc[1::2] on second iloc
        
        if q == (0.5, 0.5):
            lower_inc = df[df["abbreviation"] == state].iloc[1::2].reset_index().drop('index', axis=1)
            upper_inc = df[df["abbreviation"] == state].iloc[1::2].reset_index().drop('index', axis=1)
        else:
            lower_inc = df[df["abbreviation"] == state].iloc[::2].iloc[1::2].reset_index().drop('index', axis=1)
            upper_inc = df[df["abbreviation"] == state].iloc[1::2].iloc[1::2].reset_index().drop('index', axis=1)
            
        d = ({"target_end_date": upper_inc["target_end_date"].astype(np.int64) / 1000000, 
         "lower": lower_inc["value"],
         "upper": upper_inc["value"]})
        q_tmp[state] = pd.DataFrame(data = d).values.tolist()
    export_inc[q[1]] = q_tmp

with open("df_quant_inc.json", "w") as outfile:  
    json.dump(export_inc, outfile, indent=4)

