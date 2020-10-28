import pandas as pd
import datetime
import numpy as np
import json
import sys

WASHINGTON_DC = 11
US_STATES_ID = 57
df = pd.read_csv('truth-Incident Deaths.csv', 
                 dtype={"date": str, "location": str, "location_name": "str", "value": "float"})
df_USA = df[df['location']=='US'] # ADDITION
df = df[df['location']!='US']
df['location'] = df['location'].astype(int)
df = df[(df['location'] < US_STATES_ID) & (df['location'] > 0)& (df['location'] != WASHINGTON_DC)]
df = df.append(df_USA, ignore_index=True) # ADDITION

# the timestamp should be two days before the result date
df['date'] = pd.to_datetime(df['date'])
df = df[(df['date'] <= pd.Timestamp(int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]))) & (df['date'] >= pd.Timestamp(2020, 1, 25))]

locations = pd.read_csv("locations.csv")
USA = locations[(locations['location'] == 'US')][["abbreviation", "location"]] # ADDITION
locations = locations[locations['location']!='US']
locations['location'] = locations['location'].astype(int)
locations = locations[(locations['location'] < US_STATES_ID) & (locations['location'] > 0) & (locations['location'] != WASHINGTON_DC)]
del locations['location_name']
locations = locations.append(USA, ignore_index=True) # ADDITION

df_master = pd.merge(df, locations, on='location')
df_master = df_master.groupby(['abbreviation', pd.Grouper(key='date', freq='W-SAT')])['value'].sum().reset_index().sort_values('abbreviation')
df_export = df_master[['abbreviation','date', 'value']]

export = {}
for state in df_export['abbreviation'].unique():
    state_data = df_export.groupby('abbreviation').get_group(state).drop("abbreviation", axis=1).sort_values('date')
    state_data['date'] = state_data['date'].astype(np.int64) / 1000000
    export[state] = state_data.values.tolist()

json_object = json.dumps(export, indent = 4)   
with open("df_truth_inc.json", "w") as outfile:  
    json.dump(export, outfile, indent=4) 