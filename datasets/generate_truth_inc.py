import pandas as pd
import datetime
import numpy as np
import json

df = pd.read_csv('truth-Incident Deaths.csv', 
                 dtype={"date": str, "location": str, "location_name": "str", "value": "float"})
df = df[df['location']!='US']
df['location'] = df['location'].astype(int)
df['date'] = pd.to_datetime(df['date'])
df = df[(df['date'] <= pd.Timestamp(2020, 9, 5)) & (df['date'] >= pd.Timestamp(2020, 1, 25))]
df = df[(df['location'] < 57) & (df['location'] > 0)& (df['location'] !=11)]

locations = pd.read_csv("locations.csv")
locations = locations[locations['location']!='US']
locations['location'] = locations['location'].astype(int)
locations = locations[(locations['location'] < 57) & (locations['location'] > 0) & (locations['location'] != 11)]
del locations['location_name']

df_master = pd.merge(df, locations, on='location')
df_master = df_master.groupby(['abbreviation', pd.Grouper(key='date', freq='W-SAT')])['value'].sum().reset_index().sort_values('abbreviation')
#df_master['date'] = df_master['date'].astype(np.int64) / 1000000
df_export = df_master[['abbreviation','date', 'value']]

export = {}
for state in df_export['abbreviation'].unique():
    state_data = df_export.groupby('abbreviation').get_group(state).drop("abbreviation", axis=1).sort_values('date')
    state_data['date'] = state_data['date'].astype(np.int64) / 1000000
    export[state] = state_data.values.tolist()

json_object = json.dumps(export, indent = 4)   
with open("df_truth_inc.json", "w") as outfile:  
    json.dump(export, outfile, indent=4) 