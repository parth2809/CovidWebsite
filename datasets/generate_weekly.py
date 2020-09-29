import numpy as np
import pandas as pd
import json

gleam_data = pd.read_csv("2020-09-28-UCSD_NEU-DeepGLEAM.csv")
locations = pd.read_csv("locations.csv")
df_master = pd.merge(gleam_data, locations, on='location')
df_master = df_master[df_master["type"] == "point"]
df_master = df_master.loc[~df_master['abbreviation'].isin(["US"])]
df_master['target_end_date'] = pd.to_datetime(df_master['target_end_date']).astype(np.int64) / 1000000

export_inc = {}
export_cum = {}

for state in df_master.abbreviation.unique():
    df = df_master[df_master["abbreviation"] == state]
    export_inc[state] = df[["target_end_date", "value"]].iloc[1::2].values.tolist()
    export_cum[state] = df[["target_end_date", "value"]].iloc[::2].values.tolist()

with open("df_weekly_inc.json", "w") as outfile:  
    json.dump(export_inc, outfile, indent=4) 

with open("df_weekly_cum.json", "w") as outfile:  
    json.dump(export_cum, outfile, indent=4) 