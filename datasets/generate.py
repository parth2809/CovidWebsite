import pandas as pd
import numpy as np

'''
Creates a clean JSON from the GLEAM data for use with the charting tool
'''

gleam_data = pd.read_csv("2020-09-07-UCSD_NEU-DeepGLEAM.csv") # Ideal if it can download straight from their github
locations = pd.read_csv("locations.csv")
df_master = pd.merge(gleam_data, locations, on='location')
df_master = df_master[df_master["type"] == "point"]
df_master = df_master[df_master["target"] == "1 wk ahead inc death"]
df = df_master.drop(9647) # THIS DROPS THE ROW LABELED "US", MAKE SURE TO FIND AND DROP THE ROW 
df_mini = df[['value', 'abbreviation']]
df_mini = df_mini.replace(0.0, 0.0000001).rename(columns={'abbreviation': 'code'}) # MAKE SURE ALL 0.0 ARE CONVERTED to 0.0000001
df_mini.to_json('df.json', orient="records", indent=4)