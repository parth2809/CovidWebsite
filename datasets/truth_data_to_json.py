import pandas as pd
import json
dateparse = lambda x: pd.datetime.strptime(x, '%d/%m/%y')
df = pd.read_csv('truth-Cumulative Cases.csv', parse_dates=['date'], date_parser=dateparse)
df = df[df['location']!='US']
df['location'] = df['location'].astype(int)
df = df[(df['date'] <= '09/07/2020') & (df['date'] >= '01/27/2020')]
df = df[(df['location'] < 57) & (df['location'] > 0)& (df['location'] !=11)]
locations = pd.read_csv("locations.csv")
locations = locations[locations['location']!='US']
del locations['location_name']
locations['location'] = locations['location'].astype(int)
locations = locations[(locations['location'] < 57) & (locations['location'] > 0) & (locations['location'] != 11)]
df_master = pd.merge(df, locations, on='location')
df_master['date'] = df_master['date'].astype(str)
unique_dates = df_master.date.unique()
unique_states = df_master.abbreviation.unique()
json_object_list=[]
for i in range(len(unique_states)):
    dictionary={}
    dictionary["code"]=unique_states[i]
    df_temp = df_master[df_master["abbreviation"]==unique_states[i]]
    for j in range(len(unique_dates)):
        if j%7==0:
            dictionary[unique_dates[j]]=str(df_temp.iloc[j,3])
    json_object_list.append(dictionary)
with open("df_truth_cum.json", "w") as outfile: 
        json.dump(json_object_list, outfile, indent=4) 