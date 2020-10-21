import pandas as pd
import numpy as np
import sys

'''
Creates a clean JSON from the GLEAM data for use with the charting tool
'''

GLEAMCSV = sys.argv[1]

gleam_data = pd.read_csv(GLEAMCSV) # Ideal if it can download straight from their github
locations = pd.read_csv("locations.csv")
df_master = pd.merge(gleam_data, locations, on='location')
df_master = df_master[df_master["type"] == "point"]
df_master = df_master.loc[~df_master['abbreviation'].isin(["US"])]

df_abbreviation = df_master[df_master["target"] == "1 wk ahead cum death"]["abbreviation"]
df_week1 = df_master[df_master["target"] == "1 wk ahead cum death"][["value"]]
df_week2 = df_master[df_master["target"] == "2 wk ahead cum death"][["value"]]
df_week3 = df_master[df_master["target"] == "3 wk ahead cum death"][["value"]]
df_week4 = df_master[df_master["target"] == "4 wk ahead cum death"][["value"]]

df_abbreviation.reset_index(drop=True, inplace=True)
df_week1.rename(columns={'value':'week1'})
df_week1.reset_index(drop=True, inplace=True)
df_week2.rename(columns={'value':'week2'})
df_week2.reset_index(drop=True, inplace=True)
df_week3.rename(columns={'value':'week3'})
df_week3.reset_index(drop=True, inplace=True)
df_week4.rename(columns={'value':'week4'})
df_week4.reset_index(drop=True, inplace=True)
df = pd.concat( [df_abbreviation, df_week1, df_week2, df_week3, df_week4], axis=1) 
df.columns=['abbreviation','week1','week2','week3','week4']
df = df.replace(0.0, 0.0000001).rename(columns={'abbreviation': 'code'}) # MAKE SURE ALL 0.0 ARE CONVERTED to 0.0000001
df.to_json('df_cum.json', orient="records", indent=4)